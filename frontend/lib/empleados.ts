import { api } from "@/lib/api";
import type { Departamento } from "@/lib/departamentos";

export type TipoIdentificacion = "CEDULA" | "DIMEX" | "PASAPORTE";
export type EstadoCivil =
  | "SOLTERO"
  | "CASADO"
  | "UNION_LIBRE"
  | "DIVORCIADO"
  | "VIUDO";
export type TipoContrato = "INDEFINIDO" | "PLAZO_FIJO" | "POR_OBRA";
export type TipoJornada = "DIURNA" | "MIXTA" | "NOCTURNA";
export type EstadoEmpleado = "ACTIVO" | "INACTIVO";

type Opcion<T extends string> = { value: T; label: string };

export const TIPOS_IDENTIFICACION: Opcion<TipoIdentificacion>[] = [
  { value: "CEDULA", label: "Cédula" },
  { value: "DIMEX", label: "DIMEX" },
  { value: "PASAPORTE", label: "Pasaporte" },
];

export const ESTADOS_CIVILES: Opcion<EstadoCivil>[] = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "UNION_LIBRE", label: "Unión libre" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
];

export const TIPOS_CONTRATO: Opcion<TipoContrato>[] = [
  { value: "INDEFINIDO", label: "Tiempo indefinido" },
  { value: "PLAZO_FIJO", label: "Plazo fijo" },
  { value: "POR_OBRA", label: "Por obra determinada" },
];

export const TIPOS_JORNADA: Opcion<TipoJornada>[] = [
  { value: "DIURNA", label: "Diurna (8 h diarias, 48 h semanales)" },
  { value: "MIXTA", label: "Mixta (7 h diarias, 42 h semanales)" },
  { value: "NOCTURNA", label: "Nocturna (6 h diarias, 36 h semanales)" },
];

export function etiqueta<T extends string>(
  opciones: Opcion<T>[],
  valor: T | null | undefined
): string {
  if (!valor) return "—";
  return opciones.find((o) => o.value === valor)?.label ?? valor;
}

export type Empleado = {
  id: string;
  tipoIdentificacion: TipoIdentificacion;
  identificacion: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string | null;
  fechaNacimiento: string | null;
  estadoCivil: EstadoCivil | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  puesto: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  motivoSalida: string | null;
  tipoContrato: TipoContrato;
  tipoJornada: TipoJornada;
  salarioBase: number;
  numeroAseguradoCcss: string | null;
  estado: EstadoEmpleado;
  departamentoId: string | null;
  departamento: Departamento | null;
  createdAt: string;
  updatedAt: string;
};

export type EmpleadoInput = {
  tipoIdentificacion: TipoIdentificacion;
  identificacion: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string | null;
  fechaNacimiento: string | null;
  estadoCivil: EstadoCivil | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  puesto: string;
  fechaIngreso: string;
  tipoContrato: TipoContrato;
  tipoJornada: TipoJornada;
  salarioBase: number;
  numeroAseguradoCcss: string | null;
  departamentoId: string | null;
};

export const listarEmpleados = () => api<Empleado[]>("/empleados");

export const obtenerEmpleado = (id: string) =>
  api<Empleado>(`/empleados/${id}`);

export const crearEmpleado = (data: EmpleadoInput) =>
  api<Empleado>("/empleados", { method: "POST", body: JSON.stringify(data) });

export const actualizarEmpleado = (id: string, data: EmpleadoInput) =>
  api<Empleado>(`/empleados/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const darDeBaja = (
  id: string,
  data: { fechaSalida: string; motivoSalida: string | null }
) =>
  api<Empleado>(`/empleados/${id}/baja`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const reactivarEmpleado = (id: string) =>
  api<Empleado>(`/empleados/${id}/reactivar`, { method: "POST" });