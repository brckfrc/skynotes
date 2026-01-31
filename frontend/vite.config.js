import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {},
  server: {
    port: parseInt(process.env.VITE_DEV_PORT, 10) || 5174,
  },
});
