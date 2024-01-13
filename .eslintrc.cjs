/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:import/recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['#styles', './src/assets/styles']
        ],
        extensions: ['.js', '.vue']
      }
    }
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    indent: ['error', 2],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-unused-vars': [
      'error',
      { destructuredArrayIgnorePattern: '^_', argsIgnorePattern: '^_' }
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple']
      }
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'one-var': [2, 'never'],
    'no-underscore-dangle': 'off',
    'import/no-extraneous-dependencies': ['off', { packageDir: [''] }]
  }
}
