// Por defecto el navegador llama a /api/... y Next.js lo reenvía al backend
// (ver next.config.ts). Solo se cambia con NEXT_PUBLIC_API_URL si hace falta.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "El servidor tardó demasiado en responder. Intenta de nuevo.",
        0
      );
    }
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
      0
    );
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let message =
      res.status >= 500
        ? "El servidor no está disponible en este momento. Intenta de nuevo más tarde."
        : "Ocurrió un error inesperado";
    try {
      const body = await res.json();
      if (Array.isArray(body.message)) message = body.message.join(". ");
      else if (typeof body.message === "string") message = body.message;
    } catch {
      // la respuesta no traía JSON; se deja el mensaje genérico
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}