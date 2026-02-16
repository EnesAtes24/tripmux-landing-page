import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // Multi-page: Cloudflare Pages için tüm HTML sayfaları dist'e dahil edilir.
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "about.html"),
        contact: path.resolve(__dirname, "contact.html"),
        "privacy-policy": path.resolve(__dirname, "privacy-policy.html"),
        "terms-of-service": path.resolve(__dirname, "terms-of-service.html"),
      },
    },
  },
});
