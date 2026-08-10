import js from '@eslint/js';
import security from 'eslint-plugin-security';
import globals from 'globals';

export default [
  js.configs.recommended,
  security.configs.recommended,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.config.js', '*.config.mjs']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, __APP_VERSION__: 'readonly' }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'error',
      'prefer-const': 'warn',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'error'
    }
  },
  {
    files: ['public/sw.js', 'public/sw-workbox.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        importScripts: 'readonly',
        workbox: 'readonly',
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        registration: 'readonly'
      }
    },
    rules: {
      'no-constant-binary-expression': 'off',
      'no-undef': 'off'
    }
  },
  {
    files: ['generate-sw.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { node: true, es2022: true }
    }
  }
];