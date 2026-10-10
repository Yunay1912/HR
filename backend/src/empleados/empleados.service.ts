import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  Empleado,
  EstadoEmpleado,
  TipoIdentificacion,
} from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { BajaEmpleadoDto } from './dto/baja-empleado.dto';
import {
  normalizarIdentificacion,
  validarIdentificacion,
} from './identificacion.util';

type Fechas = {
  fechaNacimiento?: string | null;
  fechaIngreso: string;
  fechaSalida?: string | null;
};

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly repo: Repository<Empleado>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: { departamento: true },
      order: { primerApellido: 'ASC', nombre: 'ASC' },
    });
  }

  async findOne(id: string) {
    const empleado = await this.repo.findOne({
      where: { id },
      relations: { departamento: true },
    });
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }
    return empleado;
  }

  async create(dto: CreateEmpleadoDto) {
    const tipo = dto.tipoIdentificacion ?? TipoIdentificacion.CEDULA;
    const identificacion = this.normalizarYValidar(tipo, dto.identificacion);
    this.validarFechas(dto);

    try {
      const guardado = await this.repo.save(
        this.repo.create({ ...dto, tipoIdentificacion: tipo, identificacion }),
      );
      return await this.findOne(guardado.id);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async update(id: string, dto: UpdateEmpleadoDto) {
    const empleado = await this.repo.findOneBy({ id });
    if (!empleado) {
      throw new NotFoundException('Empleado no encontrado');
    }

    const tipo = dto.tipoIdentificacion ?? empleado.tipoIdentificacion;
    let identificacion = dto.identificacion ?? empleado.identificacion;
    if (
      dto.identificacion !== undefined ||
      dto.tipoIdentificacion !== undefined
    ) {
      identificacion = this.normalizarYValidar(tipo, identificacion);
    }

    Object.assign(empleado, dto, { tipoIdentificacion: tipo, identificacion });
    this.validarFechas(empleado);

    try {
      await this.repo.save(empleado);
      return await this.findOne(id);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  // Dar de baja: el expediente se conserva, solo cambia a INACTIVO.
  async baja(id: string, dto: BajaEmpleadoDto) {
    const empleado = await this.findOne(id);

    if (empleado.estado === EstadoEmpleado.INACTIVO) {
      throw new ConflictException('El empleado ya está dado de baja');
    }
    if (dto.fechaSalida < empleado.fechaIngreso) {
      throw new BadRequestException(
        'La fecha de salida no puede ser anterior a la fecha de ingreso',
      );
    }

    empleado.estado = EstadoEmpleado.INACTIVO;
    empleado.fechaSalida = dto.fechaSalida;
    empleado.motivoSalida = dto.motivoSalida ?? null;
    await this.repo.save(empleado);
    return this.findOne(id);
  }

  async reactivar(id: string) {
    const empleado = await this.findOne(id);

    if (empleado.estado === EstadoEmpleado.ACTIVO) {
      throw new ConflictException('El empleado ya está activo');
    }

    empleado.estado = EstadoEmpleado.ACTIVO;
    empleado.fechaSalida = null;
    empleado.motivoSalida = null;
    await this.repo.save(empleado);
    return this.findOne(id);
  }

  private normalizarYValidar(tipo: TipoIdentificacion, valor: string) {
    const normalizada = normalizarIdentificacion(tipo, valor);
    const error = validarIdentificacion(tipo, normalizada);
    if (error) throw new BadRequestException(error);
    return normalizada;
  }

  private validarFechas(f: Fechas) {
    const hoy = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Costa_Rica',
    });

    if (f.fechaNacimiento) {
      if (f.fechaNacimiento >= hoy) {
        throw new BadRequestException(
          'La fecha de nacimiento no puede ser futura',
        );
      }
      if (f.fechaNacimiento >= f.fechaIngreso) {
        throw new BadRequestException(
          'La fecha de nacimiento debe ser anterior a la fecha de ingreso',
        );
      }
    }

    if (f.fechaSalida && f.fechaSalida < f.fechaIngreso) {
      throw new BadRequestException(
        'La fecha de salida no puede ser anterior a la fecha de ingreso',
      );
    }
  }

  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const code = (error.driverError as { code?: string })?.code;
      if (code === '23505') {
        throw new ConflictException(
          'Ya existe un empleado con esa identificación',
        );
      }
      if (code === '23503') {
        throw new BadRequestException('El departamento seleccionado no existe');
      }
    }
    throw error;
  }
}
