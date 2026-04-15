import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const analyze = process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), preact(), ...(analyze ? [analyzer({})] : [])], //TODO: remove analyzer
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
