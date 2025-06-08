import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";

import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), cloudflare(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./web"),
    },
  },
});
