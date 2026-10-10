import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  EstadoCivil,
  EstadoEmpleado,
  TipoContrato,
  TipoIdentificacion,
  TipoJornada,
} from '../entities/empleado.entity';

// Texto sin espacios sobrantes. Un texto vacío se guarda como null.
const limpiar = ({ value }: { value: unknown }): unknown => {
  if (typeof value !== 'string') return value;
  const texto = value.trim();
  return texto === '' ? null : texto;
};

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const MSG_FECHA = 'La fecha debe tener el formato AAAA-MM-DD';

export class CreateEmpleadoDto {
  @IsOptional()
  @IsEnum(TipoIdentificacion)
  tipoIdentificacion?: TipoIdentificacion;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'La identificación es obligatoria' })
  @MaxLength(30)
  identificacion: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @MaxLength(100)
  primerApellido: string;

  @Transform(limpiar)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  segundoApellido?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @Matches(FECHA, { message: MSG_FECHA })
  @IsISO8601(
    { strict: true },
    { message: 'La fecha de nacimiento no es válida' },
  )
  fechaNacimiento?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @IsEnum(EstadoCivil)
  estadoCivil?: EstadoCivil | null;

  @Transform(limpiar)
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @MaxLength(150)
  email?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @Matches(/^[0-9+()\-\s]{7,30}$/, { message: 'El teléfono no es válido' })
  telefono?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  direccion?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @IsString()
  @MaxLength(150)
  contactoEmergenciaNombre?: string | null;

  @Transform(limpiar)
  @IsOptional()
  @Matches(/^[0-9+()\-\s]{7,30}$/, {
    message: 'El teléfono de emergencia no es válido',
  })
  contactoEmergenciaTelefono?: string | null;

  @Transform(limpiar)
  @IsString()
  @IsNotEmpty({ message: 'El puesto es obligatorio' })
  @MaxLength(120)
  puesto: string;

  @Matches(FECHA, { message: MSG_FECHA })
  @IsISO8601({ strict: true }, { message: 'La fecha de ingreso no es válida' })
  fechaIngreso: string;

  @Transform(limpiar)
  @IsOptional()
  @Matches(FECHA, { message: MSG_FECHA })
  @IsISO8601({ strict: true }, { message: 'La fecha de salida no es válida' })
  fechaSalida?: string | null;

  @IsOptional()
  @IsEnum(TipoContrato)
  tipoContrato?: TipoContrato;

  @IsOptional()
  @IsEnum(TipoJornada)
  tipoJornada?: TipoJornada;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El salario debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El salario no puede ser negativo' })
  @Max(9999999999.99)
  salarioBase?: number;

  @Transform(limpiar)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  numeroAseguradoCcss?: string | null;

  @IsOptional()
  @IsEnum(EstadoEmpleado)
  estado?: EstadoEmpleado;

  @Transform(limpiar)
  @IsOptional()
  @IsUUID('all', { message: 'El departamento no es válido' })
  departamentoId?: string | null;
}
