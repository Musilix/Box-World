import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    host: "0.0.0.0", // Listen on all interfaces
    port: 8000, // Optional: specify a custom port (default is 5173)
  },
});
