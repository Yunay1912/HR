"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, selectClassName, textareaClassName } from "@/components/shared/form";
import { ApiError } from "@/lib/api";
import { listarDepartamentos, type Departamento } from "@/lib/departamentos";
import {
  actualizarEmpleado,
  crearEmpleado,
  ESTADOS_CIVILES,
  TIPOS_CONTRATO,
  TIPOS_IDENTIFICACION,
  TIPOS_JORNADA,
  type Empleado,
  type EmpleadoInput,
} from "@/lib/empleados";
import { hoyISO } from "@/lib/format";

type Valores = {
  tipoIdentificacion: string;
  identificacion: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  estadoCivil: string;
  email: string;
  telefono: string;
  direccion: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  puesto: string;
  departamentoId: string;
  fechaIngreso: string;
  tipoContrato: string;
  tipoJornada: string;
  salarioBase: string;
  numeroAseguradoCcss: string;
};

function valoresIniciales(e?: Empleado): Valores {
  return {
    tipoIdentificacion: e?.tipoIdentificacion ?? "CEDULA",
    identificacion: e?.identificacion ?? "",
    nombre: e?.nombre ?? "",
    primerApellido: e?.primerApellido ?? "",
    segundoApellido: e?.segundoApellido ?? "",
    fechaNacimiento: e?.fechaNacimiento ?? "",
    estadoCivil: e?.estadoCivil ?? "",
    email: e?.email ?? "",
    telefono: e?.telefono ?? "",
    direccion: e?.direccion ?? "",
    contactoEmergenciaNombre: e?.contactoEmergenciaNombre ?? "",
    contactoEmergenciaTelefono: e?.contactoEmergenciaTelefono ?? "",
    puesto: e?.puesto ?? "",
    departamentoId: e?.departamentoId ?? "",
    fechaIngreso: e?.fechaIngreso ?? hoyISO(),
    tipoContrato: e?.tipoContrato ?? "INDEFINIDO",
    tipoJornada: e?.tipoJornada ?? "DIURNA",
    salarioBase: e ? String(e.salarioBase) : "",
    numeroAseguradoCcss: e?.numeroAseguradoCcss ?? "",
  };
}

const opcional = (texto: string) => (texto.trim() === "" ? null : texto.trim());

export default function EmpleadoForm({ empleado }: { empleado?: Empleado }) {
  const router = useRouter();
  const [v, setV] = useState<Valores>(() => valoresIniciales(empleado));
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof Valores, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listarDepartamentos()
      .then(setDepartamentos)
      .catch(() => setError("No se pudo cargar la lista de departamentos"));
  }, []);

  const set =
    (campo: keyof Valores) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setV((prev) => ({ ...prev, [campo]: e.target.value }));

  function validar() {
    const e: Partial<Record<keyof Valores, string>> = {};
    if (!v.identificacion.trim()) e.identificacion = "La identificación es obligatoria";
    if (!v.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!v.primerApellido.trim()) e.primerApellido = "El primer apellido es obligatorio";
    if (!v.puesto.trim()) e.puesto = "El puesto es obligatorio";
    if (!v.fechaIngreso) e.fechaIngreso = "La fecha de ingreso es obligatoria";
    if (v.salarioBase !== "" && Number(v.salarioBase) < 0)
      e.salarioBase = "El salario no puede ser negativo";
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    if (!validar()) return;

    const data: EmpleadoInput = {
      tipoIdentificacion: v.tipoIdentificacion as EmpleadoInput["tipoIdentificacion"],
      identificacion: v.identificacion.trim(),
      nombre: v.nombre.trim(),
      primerApellido: v.primerApellido.trim(),
      segundoApellido: opcional(v.segundoApellido),
      fechaNacimiento: opcional(v.fechaNacimiento),
      estadoCivil: opcional(v.estadoCivil) as EmpleadoInput["estadoCivil"],
      email: opcional(v.email),
      telefono: opcional(v.telefono),
      direccion: opcional(v.direccion),
      contactoEmergenciaNombre: opcional(v.contactoEmergenciaNombre),
      contactoEmergenciaTelefono: opcional(v.contactoEmergenciaTelefono),
      puesto: v.puesto.trim(),
      fechaIngreso: v.fechaIngreso,
      tipoContrato: v.tipoContrato as EmpleadoInput["tipoContrato"],
      tipoJornada: v.tipoJornada as EmpleadoInput["tipoJornada"],
      salarioBase: v.salarioBase === "" ? 0 : Number(v.salarioBase),
      numeroAseguradoCcss: opcional(v.numeroAseguradoCcss),
      departamentoId: opcional(v.departamentoId),
    };

    setSaving(true);
    try {
      const guardado = empleado
        ? await actualizarEmpleado(empleado.id, data)
        : await crearEmpleado(data);
      router.push(`/empleados/${guardado.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo guardar el empleado"
      );
      setSaving(false);
    }
  }

  const cancelarHref = empleado ? `/empleados/${empleado.id}` : "/empleados";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Card className="rounded-2xl p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Datos personales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="tipoIdentificacion" label="Tipo de identificación">
            <select
              id="tipoIdentificacion"
              value={v.tipoIdentificacion}
              onChange={set("tipoIdentificacion")}
              className={selectClassName}
            >
              {TIPOS_IDENTIFICACION.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="identificacion" label="Número de identificación" required error={errores.identificacion}>
            <Input
              id="identificacion"
              value={v.identificacion}
              onChange={set("identificacion")}
              placeholder="Ej. 1-2345-6789"
              maxLength={30}
            />
          </Field>
          <Field id="nombre" label="Nombre" required error={errores.nombre}>
            <Input id="nombre" value={v.nombre} onChange={set("nombre")} maxLength={100} />
          </Field>
          <Field id="primerApellido" label="Primer apellido" required error={errores.primerApellido}>
            <Input id="primerApellido" value={v.primerApellido} onChange={set("primerApellido")} maxLength={100} />
          </Field>
          <Field id="segundoApellido" label="Segundo apellido">
            <Input id="segundoApellido" value={v.segundoApellido} onChange={set("segundoApellido")} maxLength={100} />
          </Field>
          <Field id="fechaNacimiento" label="Fecha de nacimiento">
            <Input id="fechaNacimiento" type="date" value={v.fechaNacimiento} onChange={set("fechaNacimiento")} />
          </Field>
          <Field id="estadoCivil" label="Estado civil">
            <select id="estadoCivil" value={v.estadoCivil} onChange={set("estadoCivil")} className={selectClassName}>
              <option value="">Sin especificar</option>
              {ESTADOS_CIVILES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="email" label="Correo electrónico">
            <Input id="email" type="email" value={v.email} onChange={set("email")} maxLength={150} />
          </Field>
          <Field id="telefono" label="Teléfono">
            <Input id="telefono" value={v.telefono} onChange={set("telefono")} placeholder="Ej. 8888-1234" maxLength={30} />
          </Field>
          <Field id="direccion" label="Dirección" className="sm:col-span-2">
            <textarea id="direccion" value={v.direccion} onChange={set("direccion")} rows={2} maxLength={500} className={textareaClassName} />
          </Field>
          <Field id="contactoEmergenciaNombre" label="Contacto de emergencia">
            <Input id="contactoEmergenciaNombre" value={v.contactoEmergenciaNombre} onChange={set("contactoEmergenciaNombre")} maxLength={150} />
          </Field>
          <Field id="contactoEmergenciaTelefono" label="Teléfono de emergencia">
            <Input id="contactoEmergenciaTelefono" value={v.contactoEmergenciaTelefono} onChange={set("contactoEmergenciaTelefono")} maxLength={30} />
          </Field>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Datos laborales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="puesto" label="Puesto" required error={errores.puesto}>
            <Input id="puesto" value={v.puesto} onChange={set("puesto")} maxLength={120} />
          </Field>
          <Field id="departamentoId" label="Departamento">
            <select id="departamentoId" value={v.departamentoId} onChange={set("departamentoId")} className={selectClassName}>
              <option value="">Sin asignar</option>
              {departamentos
                .filter((d) => d.activo || d.id === v.departamentoId)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
            </select>
          </Field>
          <Field id="fechaIngreso" label="Fecha de ingreso" required error={errores.fechaIngreso}>
            <Input id="fechaIngreso" type="date" value={v.fechaIngreso} onChange={set("fechaIngreso")} />
          </Field>
          <Field id="salarioBase" label="Salario mensual bruto (₡)" error={errores.salarioBase}>
            <Input id="salarioBase" type="number" min="0" step="0.01" value={v.salarioBase} onChange={set("salarioBase")} placeholder="0.00" />
          </Field>
          <Field id="tipoContrato" label="Tipo de contrato">
            <select id="tipoContrato" value={v.tipoContrato} onChange={set("tipoContrato")} className={selectClassName}>
              {TIPOS_CONTRATO.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="tipoJornada" label="Tipo de jornada">
            <select id="tipoJornada" value={v.tipoJornada} onChange={set("tipoJornada")} className={selectClassName}>
              {TIPOS_JORNADA.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card className="rounded-2xl p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Seguridad social</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="numeroAseguradoCcss" label="Número de asegurado (CCSS)">
            <Input id="numeroAseguradoCcss" value={v.numeroAseguradoCcss} onChange={set("numeroAseguradoCcss")} maxLength={30} />
          </Field>
        </div>
      </Card>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : empleado ? "Guardar cambios" : "Crear expediente"}
        </Button>
        <Link href={cancelarHref} className={buttonVariants({ variant: "outline" })}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}