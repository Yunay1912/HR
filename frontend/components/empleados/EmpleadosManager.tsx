"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectClassName } from "@/components/shared/form";
import { ApiError } from "@/lib/api";
import { listarDepartamentos, type Departamento } from "@/lib/departamentos";
import { listarEmpleados, type Empleado } from "@/lib/empleados";
import {
  formatFecha,
  formatIdentificacion,
  nombreCompleto,
} from "@/lib/format";
import EstadoBadge from "./EstadoBadge";

export default function EmpleadosManager() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    Promise.all([listarEmpleados(), listarDepartamentos()])
      .then(([emp, dep]) => {
        setEmpleados(emp);
        setDepartamentos(dep);
      })
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "No se pudo cargar la lista"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return empleados.filter((e) => {
      if (departamentoId && e.departamentoId !== departamentoId) return false;
      if (estado && e.estado !== estado) return false;
      if (!q) return true;
      return (
        nombreCompleto(e).toLowerCase().includes(q) ||
        e.identificacion.toLowerCase().includes(q) ||
        e.puesto.toLowerCase().includes(q)
      );
    });
  }, [empleados, query, departamentoId, estado]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, cédula o puesto..."
            className="pl-8"
          />
        </div>

        <select
          aria-label="Filtrar por departamento"
          value={departamentoId}
          onChange={(e) => setDepartamentoId(e.target.value)}
          className={`${selectClassName} max-w-48`}
        >
          <option value="">Todos los departamentos</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className={`${selectClassName} max-w-40`}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="INACTIVO">Inactivos</option>
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="rounded-2xl p-2 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Puesto</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Ingreso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filtrados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  {empleados.length === 0
                    ? "Aún no hay empleados. Crea el primer expediente con el botón de arriba."
                    : "No se encontraron resultados."}
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Link
                      href={`/empleados/${e.id}`}
                      className="font-medium hover:underline"
                    >
                      {nombreCompleto(e)}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {formatIdentificacion(e.tipoIdentificacion, e.identificacion)}
                    </div>
                  </TableCell>
                  <TableCell>{e.puesto}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.departamento?.nombre ?? "Sin asignar"}
                  </TableCell>
                  <TableCell>{formatFecha(e.fechaIngreso)}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={e.estado} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/empleados/${e.id}`}
                        aria-label={`Ver expediente de ${nombreCompleto(e)}`}
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      >
                        <Eye />
                      </Link>
                      <Link
                        href={`/empleados/${e.id}/editar`}
                        aria-label={`Editar ${nombreCompleto(e)}`}
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      >
                        <Pencil />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}