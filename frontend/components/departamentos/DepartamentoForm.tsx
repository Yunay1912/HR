"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  actualizarDepartamento,
  crearDepartamento,
  type Departamento,
} from "@/lib/departamentos";
import { ApiError } from "@/lib/api";

export default function DepartamentoForm({
  departamento,
  onSaved,
  onCancel,
}: {
  departamento: Departamento | null; // null = crear uno nuevo
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState(departamento?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(
    departamento?.descripcion ?? ""
  );
  const [activo, setActivo] = useState(departamento?.activo ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setSaving(true);
    setError(null);

    const data = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      activo,
    };

    try {
      if (departamento) await actualizarDepartamento(departamento.id, data);
      else await crearDepartamento(data);
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo guardar el departamento"
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <SheetHeader>
        <SheetTitle>
          {departamento ? "Editar departamento" : "Nuevo departamento"}
        </SheetTitle>
        <SheetDescription>
          {departamento
            ? "Modifica los datos del departamento."
            : "Completa los datos para crear el departamento."}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="space-y-1.5">
          <label htmlFor="dep-nombre" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="dep-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={100}
            placeholder="Ej. Recursos Humanos"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dep-descripcion" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="dep-descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Opcional"
            className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="size-4 accent-primary"
          />
          Departamento activo
        </label>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <SheetFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </SheetFooter>
    </form>
  );
}