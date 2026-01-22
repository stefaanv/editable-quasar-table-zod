module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it should be the default)
  root: true,

  // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'],
  },

  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    node: true, // SSR, Electron, config files
    'vue/setup-compiler-macros': true,
  },

  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  // 'plugin:vue/vue3-essential'    // Priority A: Essential (Error Prevention)
  // 'plugin:vue/vue3-strongly-recommended' // Priority B: Strongly Recommended (Improving Readability)
  // 'plugin:vue/vue3-recommended'  // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
  extends: [
    'plugin:@quasar/recommended',
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],

  // required to lint *.vue files
  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  plugins: ['@typescript-eslint', 'vue', '@quasar'],

  // https://eslint.org/docs/user-guide/configuring#specifying-globals
  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
    process: 'readonly',
  },

  // add your custom rules here
  rules: {
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
  },

  overrides: [
    {
      files: ['src-pwa/custom-service-worker.ts'],
      env: {
        serviceworker: true,
      },
    },
  ],
}
