import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    // ── PATH ALIASES ───────────────────────────────────────────────
    // Instead of writing: import Button from '../../../components/ui/Button'
    // You can write:      import Button from '@components/ui/Button'
    //
    // This makes imports cleaner and moving files around doesn't break imports.
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@api": path.resolve(__dirname, "./src/api"),
    },
  },

  server: {
    port: 3000,
    // ── API PROXY ─────────────────────────────────────────────────
    // This forwards /api/... requests to your backend during development.
    // So from the frontend, you call: axios.get('/api/products')
    // Vite will secretly forward it to: http://localhost:8000/api/products
    // This avoids CORS issues in development!
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
