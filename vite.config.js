import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public', // Le dice a Vite que copie lo que pusimos en la carpeta public
  build: {
    rollupOptions: {
      output: {
        // Obligamos a Vite a NO usar "hashes" (códigos raros) en los nombres
        entryFileNames: 'src/js/[name].js',
        chunkFileNames: 'src/js/[name].js',
        assetFileNames: (assetInfo) => {
          // Mantiene el CSS y las fuentes en sus carpetas originales para que el sw.js los encuentre
          if (assetInfo.name.endsWith('.css')) return 'src/css/[name][extname]';
          if (assetInfo.name.endsWith('.woff2')) return 'src/css/fonts/[name][extname]';
          return 'assets/[name][extname]';
        }
      }
    }
  }
});