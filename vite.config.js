import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    publicDir: 'public',
    build: {
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
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/js/**'],
            exclude: ['node_modules/', 'dist/'],
        },
    },
});
