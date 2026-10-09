import { api } from "@/lib/api";

export type Departamento = {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  empleadosCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type DepartamentoInput = {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
};

export const listarDepartamentos = () =>
  api<Departamento[]>("/departamentos");

export const crearDepartamento = (data: DepartamentoInput) =>
  api<Departamento>("/departamentos", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const actualizarDepartamento = (id: string, data: DepartamentoInput) =>
  api<Departamento>(`/departamentos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const eliminarDepartamento = (id: string) =>
  api<void>(`/departamentos/${id}`, { method: "DELETE" });