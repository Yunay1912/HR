"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  eliminarDepartamento,
  listarDepartamentos,
  type Departamento,
} from "@/lib/departamentos";
import { ApiError } from "@/lib/api";
import DepartamentoForm from "./DepartamentoForm";

export default function DepartamentosManager() {
  const [items, setItems] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Departamento | null>(null);
  // Cambia cada vez que se abre el formulario, para que arranque limpio.
  const [formKey, setFormKey] = useState(0);

  async function reload() {
    try {
      setItems(await listarDepartamentos());
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo cargar la lista"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listarDepartamentos()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "No se pudo cargar la lista"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  function openForm(departamento: Departamento | null) {
    setEditing(departamento);
    setFormKey((k) => k + 1);
    setSheetOpen(true);
  }

  async function handleDelete(departamento: Departamento) {
    const ok = window.confirm(
      `¿Eliminar el departamento "${departamento.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;

    try {
      await eliminarDepartamento(departamento.id);
      await reload();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo eliminar el departamento"
      );
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        (d.descripcion ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar departamento..."
            className="pl-8"
          />
        </div>

        <Button onClick={() => openForm(null)}>
          <Plus /> Nuevo departamento
        </Button>
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
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Empleados</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  {items.length === 0
                    ? "Aún no hay departamentos. Crea el primero con el botón de arriba."
                    : "No se encontraron resultados."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.nombre}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {d.descripcion || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {d.empleadosCount ?? 0}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        d.activo
                          ? "rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                          : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {d.activo ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Editar ${d.nombre}`}
                        onClick={() => openForm(d)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Eliminar ${d.nombre}`}
                        onClick={() => handleDelete(d)}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <DepartamentoForm
            key={formKey}
            departamento={editing}
            onCancel={() => setSheetOpen(false)}
            onSaved={() => {
              setSheetOpen(false);
              void reload();
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}