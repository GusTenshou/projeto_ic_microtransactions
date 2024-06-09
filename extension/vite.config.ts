// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Obtenha o caminho absoluto para a pasta raiz do seu projeto.
// Ajuste o caminho relativo conforme necessário para apontar para a pasta do seu projeto.
const projectRootDir = resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Use resolve para construir caminhos absolutos baseados no diretório atual
        main: resolve(projectRootDir, "index.html"), // Seu ponto de entrada principal (popup, por exemplo)
        background: resolve(projectRootDir, "src/background.ts"), // Caminho para o seu script de background
        contentScript: resolve(projectRootDir, "src/ContentScript.ts"), // Caminho para o seu content script
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
