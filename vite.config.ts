import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"), // point d’entrée
      name: "PdfPreview", // nom global si UMD
      fileName: (format) => `index.${format}.js` // nom fichiers build
    },
    rollupOptions: {
      // Ne pas inclure Vue et pdfjs-dist dans le bundle
      external: ["vue", "pdfjs-dist"],
      output: {
        globals: {
          vue: "Vue",
          "pdfjs-dist": "pdfjsLib"
        }
      }
    },
    cssCodeSplit: true // permet d’avoir style.css séparé
  }
});
