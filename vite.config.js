import { defineConfig } from 'vite';
import { createRequire } from 'module';
import viteCompression from 'vite-plugin-compression';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig({
    base: '/qumran-watch/',
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    },
    publicDir: 'public',
    plugins: [
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
            compressionOptions: {
                params: {
                    [require('zlib').constants.BROTLI_PARAM_QUALITY]: 6,
                },
            },
            filter: /\.(js|css|html|json|woff2|png)$/,
        }),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 1024,
            compressionOptions: {
                level: 6,
            },
            filter: /\.(js|css|html|json|woff2|png)$/,
        }),
    ],
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
