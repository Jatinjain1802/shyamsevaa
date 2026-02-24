import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        // target: "https://serverr.shyampuja.com/",
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/uploads": {
        // target: "https://serverr.shyampuja.com/",
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
    },
  },
});
