import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/very-secret-path/api")
      }
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
