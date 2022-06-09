module.exports = {
    parser: 'vue-eslint-parser',
    env: {
        "browser": true
    },
    extends: [
      'plugin:vue/recommended',
      'eslint:recommended'
    ],
    ignorePatterns: ["/pkg"],
    rules: {
        "eqeqeq": "warn",
        "strict": "off",
        "indent": ["error", 4]
    },
    parserOptions: {
        "parser": "babel-eslint",
        "ecmaVersion": 8,
        "sourceType": "module"
      }
  }