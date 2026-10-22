import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercelJson from "./vercel.json";

/**
 * Cabeçalhos de segurança: a fonte única é o vercel.json (produção). O `npm run preview` aplica os mesmos cabeçalhos
 * globais, para testar a Content-Security-Policy localmente antes de publicar. O `npm run dev` fica sem eles
 * (o recarregamento ao vivo do Vite precisa de scripts e conexões que a política bloqueia).
 */
type VercelConfig = { headers?: { source: string; headers: { key: string; value: string }[] }[] };
const vercel: VercelConfig = vercelJson;
const securityHeaders = Object.fromEntries(
  (vercel.headers?.find((h) => h.source === "/(.*)")?.headers ?? []).map((h) => [h.key, h.value]),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: { headers: securityHeaders },
});
