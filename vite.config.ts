import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    vike(),
    react(),
    tailwindcss(),
    // Auto-start the Hono API server on port 3001 alongside Vike
    {
      name: "api-server",
      configureServer(server) {
        let started = false;
        server.httpServer?.once("listening", async () => {
          if (started) return;
          started = true;
          const { serve } = await import("@hono/node-server");
          const { app } = await import("./server/index.ts");
          serve({ fetch: app.fetch, port: 3001 }, () => {
            console.log("  \u279c  API:    http://localhost:3001");
          });
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/components": path.resolve(__dirname, "./components"),
      "@": path.resolve(__dirname, "./"),
    },
  },
});
