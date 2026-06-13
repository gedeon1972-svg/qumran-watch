import { defineConfig } from 'vite';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
    base: '/qumran-watch/',
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
    publicDir: 'public',
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                entryFileNames: 'src/js/[name].js',
                chunkFileNames: 'src/js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) return 'src/css/[name][extname]';
                    if (assetInfo.name.endsWith('.woff2')) return 'src/css/fonts/[name][extname]';
                    return 'assets/[name][extname]';
                },
            },
        },
    },
    test: {
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/js/**'],
            exclude: ['node_modules/', 'dist/'],
        },
    },
});
