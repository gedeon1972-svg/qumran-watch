import js from '@eslint/js';
import security from 'eslint-plugin-security';

export default [
    js.configs.recommended,
    security.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                fetch: 'readonly',
                caches: 'readonly',
                self: 'readonly',
                Blob: 'readonly',
                URL: 'readonly',
                Promise: 'readonly',
                Response: 'readonly',
                Request: 'readonly',
                // Inyectada en tiempo de build por Vite (vite.config.js → define)
                __APP_VERSION__: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'no-undef': 'error',
            'prefer-const': 'warn',
            eqeqeq: ['warn', 'smart'],
            'no-var': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    },
];
