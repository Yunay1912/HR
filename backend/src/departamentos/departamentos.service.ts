import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(
    @InjectRepository(Departamento)
    private readonly repo: Repository<Departamento>,
  ) {}

  findAll() {
    return this.repo
      .createQueryBuilder('departamento')
      .loadRelationCountAndMap(
        'departamento.empleadosCount',
        'departamento.empleados',
      )
      .orderBy('departamento.nombre', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const departamento = await this.repo
      .createQueryBuilder('departamento')
      .loadRelationCountAndMap(
        'departamento.empleadosCount',
        'departamento.empleados',
      )
      .where('departamento.id = :id', { id })
      .getOne();

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }
    return departamento;
  }

  async create(dto: CreateDepartamentoDto) {
    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async update(id: string, dto: UpdateDepartamentoDto) {
    const departamento = await this.repo.findOneBy({ id });
    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    Object.assign(departamento, dto);

    try {
      return await this.repo.save(departamento);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async remove(id: string) {
    const departamento = await this.findOne(id);

    if ((departamento.empleadosCount ?? 0) > 0) {
      throw new ConflictException(
        'No se puede eliminar: el departamento tiene empleados asignados',
      );
    }

    await this.repo.remove(departamento);
  }

  private handleDbError(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string })?.code === '23505'
    ) {
      throw new ConflictException('Ya existe un departamento con ese nombre');
    }
    throw error;
  }
}
