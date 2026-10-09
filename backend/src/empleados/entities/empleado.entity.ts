import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Departamento } from '../../departamentos/entities/departamento.entity';

export enum TipoIdentificacion {
  CEDULA = 'CEDULA',
  DIMEX = 'DIMEX',
  PASAPORTE = 'PASAPORTE',
}

export enum EstadoCivil {
  SOLTERO = 'SOLTERO',
  CASADO = 'CASADO',
  UNION_LIBRE = 'UNION_LIBRE',
  DIVORCIADO = 'DIVORCIADO',
  VIUDO = 'VIUDO',
}

export enum TipoContrato {
  INDEFINIDO = 'INDEFINIDO',
  PLAZO_FIJO = 'PLAZO_FIJO',
  POR_OBRA = 'POR_OBRA',
}

export enum TipoJornada {
  DIURNA = 'DIURNA',
  MIXTA = 'MIXTA',
  NOCTURNA = 'NOCTURNA',
}

export enum EstadoEmpleado {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Datos personales ---
  @Column({
    type: 'enum',
    enum: TipoIdentificacion,
    default: TipoIdentificacion.CEDULA,
  })
  tipoIdentificacion: TipoIdentificacion;

  @Column({ type: 'varchar', length: 30, unique: true })
  identificacion: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  primerApellido: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  segundoApellido: string | null;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: string | null;

  @Column({ type: 'enum', enum: EstadoCivil, nullable: true })
  estadoCivil: EstadoCivil | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contactoEmergenciaNombre: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  contactoEmergenciaTelefono: string | null;

  // --- Datos laborales ---
  @Column({ type: 'varchar', length: 120 })
  puesto: string;

  @Column({ type: 'date' })
  fechaIngreso: string;

  @Column({ type: 'date', nullable: true })
  fechaSalida: string | null;

  @Column({
    type: 'enum',
    enum: TipoContrato,
    default: TipoContrato.INDEFINIDO,
  })
  tipoContrato: TipoContrato;

  @Column({
    type: 'enum',
    enum: TipoJornada,
    default: TipoJornada.DIURNA,
  })
  tipoJornada: TipoJornada;

  // Salario mensual bruto en colones (CRC).
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value?: number) => value,
      from: (value: string | null) =>
        value === null ? null : parseFloat(value),
    },
  })
  salarioBase: number;

  // --- Seguridad social ---
  @Column({ type: 'varchar', length: 30, nullable: true })
  numeroAseguradoCcss: string | null;

  @Column({
    type: 'enum',
    enum: EstadoEmpleado,
    default: EstadoEmpleado.ACTIVO,
  })
  estado: EstadoEmpleado;

  // --- Departamento ---
  @Column({ type: 'uuid', nullable: true })
  departamentoId: string | null;

  @ManyToOne(() => Departamento, (departamento) => departamento.empleados, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}