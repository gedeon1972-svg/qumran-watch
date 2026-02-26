import { defineConfig } from 'vite';

export default defineConfig({
  // Asegura que las rutas funcionen bien en GitHub Pages
  base: './', 
  build: {
    outDir: 'dist',
    target: 'esnext',
    // Minificación extrema para que cargue en milisegundos
    minify: 'terser', 
  }
});