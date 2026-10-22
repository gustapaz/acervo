import { defineConfig } from "vite";
export default defineConfig({
  base: "/acervo/assets/",
  build: {
    outDir: "dist/assets",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/client/app.js",
      output: { entryFileNames: "app.js", assetFileNames: "[name][extname]" },
    },
  },
});
