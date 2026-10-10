"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { obtenerEmpleado, type Empleado } from "@/lib/empleados";
import EmpleadoForm from "./EmpleadoForm";

export default function EmpleadoEditor({ id }: { id: string }) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerEmpleado(id)
      .then(setEmpleado)
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "No se pudo cargar el empleado"
        )
      );
  }, [id]);

  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!empleado) {
    return (
      <Card className="rounded-2xl p-6 text-muted-foreground shadow-sm">
        Cargando...
      </Card>
    );
  }

  return <EmpleadoForm empleado={empleado} />;
}