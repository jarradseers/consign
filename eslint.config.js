const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['examples/', 'test/test-app/', 'test/fixtures/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
