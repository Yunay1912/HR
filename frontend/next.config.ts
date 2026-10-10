import type { NextConfig } from "next";

// Dirección del backend. En tu PC es localhost:4000; en producción se
// define con la variable de entorno BACKEND_URL (ej. https://mi-api.com).
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // El navegador siempre llama a /api/... en el mismo sitio y Next.js reenvía
  // la petición al backend. Así no hay problemas de CORS ni de "localhost".
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;