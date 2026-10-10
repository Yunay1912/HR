import type { EstadoEmpleado } from "@/lib/empleados";

export default function EstadoBadge({ estado }: { estado: EstadoEmpleado }) {
  const activo = estado === "ACTIVO";
  return (
    <span
      className={
        activo
          ? "rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
      }
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}