import js from '@eslint/js';

export default [
    js.configs.recommended,
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
            },
        },
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'no-undef': 'error',
        },
    },
    {
        ignores: ['dist/', 'node_modules/'],
    },
];
