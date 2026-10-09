// Dirección del backend. Se puede cambiar con NEXT_PUBLIC_API_URL en frontend/.env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

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

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
      0
    );
  }

  if (!res.ok) {
    let message = "Ocurrió un error inesperado";
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