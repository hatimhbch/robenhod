import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    preset: "cloudflare_module",
    compatibilityDate: "2025-06-20"
  },
  vite: {
    plugins: [tailwindcss()]
  }
});