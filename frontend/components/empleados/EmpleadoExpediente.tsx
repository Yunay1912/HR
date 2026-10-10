"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Pencil, RotateCcw, UserMinus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Field, textareaClassName } from "@/components/shared/form";
import { ApiError } from "@/lib/api";
import {
  darDeBaja,
  ESTADOS_CIVILES,
  etiqueta,
  obtenerEmpleado,
  reactivarEmpleado,
  TIPOS_CONTRATO,
  TIPOS_IDENTIFICACION,
  TIPOS_JORNADA,
  type Empleado,
} from "@/lib/empleados";
import {
  formatColones,
  formatFecha,
  formatIdentificacion,
  hoyISO,
  nombreCompleto,
} from "@/lib/format";
import EstadoBadge from "./EstadoBadge";

function Dato({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children || "—"}</dd>
    </div>
  );
}

function BajaForm({
  empleado,
  onDone,
  onCancel,
}: {
  empleado: Empleado;
  onDone: (e: Empleado) => void;
  onCancel: () => void;
}) {
  const [fecha, setFecha] = useState(hoyISO());
  const [motivo, setMotivo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!fecha) {
      setError("La fecha de salida es obligatoria");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      onDone(
        await darDeBaja(empleado.id, {
          fechaSalida: fecha,
          motivoSalida: motivo.trim() === "" ? null : motivo.trim(),
        })
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo dar de baja");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
      <SheetHeader>
        <SheetTitle>Dar de baja</SheetTitle>
        <SheetDescription>
          {nombreCompleto(empleado)}. El expediente se conserva y puede
          reactivarse después.
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 px-4">
        <Field id="fechaSalida" label="Fecha de salida" required>
          <Input id="fechaSalida" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Field>
        <Field id="motivoSalida" label="Motivo">
          <textarea
            id="motivoSalida"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Opcional (renuncia, despido, fin de contrato...)"
            className={textareaClassName}
          />
        </Field>
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <SheetFooter>
        <Button type="submit" variant="destructive" disabled={saving}>
          {saving ? "Guardando..." : "Confirmar baja"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </SheetFooter>
    </form>
  );
}

export default function EmpleadoExpediente({ id }: { id: string }) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bajaOpen, setBajaOpen] = useState(false);

  useEffect(() => {
    obtenerEmpleado(id)
      .then(setEmpleado)
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "No se pudo cargar el expediente"
        )
      );
  }, [id]);

  async function handleReactivar() {
    if (!empleado) return;
    if (!window.confirm(`¿Reactivar a ${nombreCompleto(empleado)}?`)) return;
    try {
      setEmpleado(await reactivarEmpleado(empleado.id));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo reactivar");
    }
  }

  if (error && !empleado) {
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

  const iniciales = (empleado.nombre[0] + empleado.primerApellido[0]).toUpperCase();

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Card className="flex-row flex-wrap items-center justify-between gap-4 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {iniciales}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{nombreCompleto(empleado)}</h2>
              <EstadoBadge estado={empleado.estado} />
            </div>
            <p className="text-sm text-muted-foreground">
              {empleado.puesto}
              {empleado.departamento ? ` · ${empleado.departamento.nombre}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/empleados/${empleado.id}/editar`} className={buttonVariants({ variant: "outline" })}>
            <Pencil /> Editar
          </Link>
          {empleado.estado === "ACTIVO" ? (
            <Button variant="destructive" onClick={() => setBajaOpen(true)}>
              <UserMinus /> Dar de baja
            </Button>
          ) : (
            <Button onClick={handleReactivar}>
              <RotateCcw /> Reactivar
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Datos personales</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Dato label={etiqueta(TIPOS_IDENTIFICACION, empleado.tipoIdentificacion)}>
              {formatIdentificacion(empleado.tipoIdentificacion, empleado.identificacion)}
            </Dato>
            <Dato label="Fecha de nacimiento">{formatFecha(empleado.fechaNacimiento)}</Dato>
            <Dato label="Estado civil">{etiqueta(ESTADOS_CIVILES, empleado.estadoCivil)}</Dato>
            <Dato label="Correo electrónico">{empleado.email}</Dato>
            <Dato label="Teléfono">{empleado.telefono}</Dato>
            <Dato label="Dirección">{empleado.direccion}</Dato>
            <Dato label="Contacto de emergencia">{empleado.contactoEmergenciaNombre}</Dato>
            <Dato label="Teléfono de emergencia">{empleado.contactoEmergenciaTelefono}</Dato>
          </dl>
        </Card>

        <Card className="rounded-2xl p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Datos laborales</h3>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Dato label="Puesto">{empleado.puesto}</Dato>
            <Dato label="Departamento">{empleado.departamento?.nombre ?? "Sin asignar"}</Dato>
            <Dato label="Fecha de ingreso">{formatFecha(empleado.fechaIngreso)}</Dato>
            <Dato label="Salario mensual bruto">{formatColones(empleado.salarioBase)}</Dato>
            <Dato label="Tipo de contrato">{etiqueta(TIPOS_CONTRATO, empleado.tipoContrato)}</Dato>
            <Dato label="Tipo de jornada">{etiqueta(TIPOS_JORNADA, empleado.tipoJornada)}</Dato>
            <Dato label="Número de asegurado (CCSS)">{empleado.numeroAseguradoCcss}</Dato>
            {empleado.estado === "INACTIVO" && (
              <>
                <Dato label="Fecha de salida">{formatFecha(empleado.fechaSalida)}</Dato>
                <Dato label="Motivo de salida">{empleado.motivoSalida}</Dato>
              </>
            )}
          </dl>
        </Card>
      </div>

      <Card className="flex-row items-center gap-3 rounded-2xl p-6 text-sm text-muted-foreground shadow-sm">
        <FileText size={20} />
        Documentos del expediente y constancias: próximamente.
      </Card>

      <Sheet open={bajaOpen} onOpenChange={setBajaOpen}>
        <SheetContent>
          <BajaForm
            empleado={empleado}
            onCancel={() => setBajaOpen(false)}
            onDone={(actualizado) => {
              setEmpleado(actualizado);
              setBajaOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}