// Fecha AAAA-MM-DD -> DD/MM/AAAA (sin convertir zonas horarias).
export function formatFecha(iso?: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function formatColones(monto: number): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(monto);
}

// Cédula de 9 dígitos -> 1-2345-6789. Los demás tipos se muestran tal cual.
export function formatIdentificacion(tipo: string, valor: string): string {
  if (tipo === "CEDULA" && /^\d{9}$/.test(valor)) {
    return `${valor[0]}-${valor.slice(1, 5)}-${valor.slice(5)}`;
  }
  return valor;
}

export function nombreCompleto(e: {
  nombre: string;
  primerApellido: string;
  segundoApellido: string | null;
}): string {
  return [e.nombre, e.primerApellido, e.segundoApellido]
    .filter(Boolean)
    .join(" ");
}

// Fecha de hoy (AAAA-MM-DD) en la hora de Costa Rica.
export function hoyISO(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Costa_Rica",
  });
}