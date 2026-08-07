export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.config.js', '*.config.mjs']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { browser: true, es2022: true, node: true }
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