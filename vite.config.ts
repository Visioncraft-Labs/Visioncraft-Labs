// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Portable __dirname for ESM (Node 18 friendly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(async () => {
  const plugins = [react(), runtimeErrorOverlay()];

  // Only load the Replit plugin in non-prod AND when REPL_ID is present
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": resolve(__dirname, "client", "src"),
        "@shared": resolve(__dirname, "shared"),
        "@assets": resolve(__dirname, "attached_assets"),
      },
    },
    root: resolve(__dirname, "client"),
    build: {
      // Matches your netlify.toml: publish = "dist/public"
      outDir: resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
