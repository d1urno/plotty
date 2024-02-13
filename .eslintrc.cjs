/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb-with-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'vue/script-setup-uses-vars': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    '@typescript-eslint/no-non-null-assertion': 'error',
    'arrow-body-style': ['error', 'as-needed'],

    /* We strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
    TypeScript already provides the checks it provides without the need for configuration -
    TypeScript just does this significantly better
    (Source:
    https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors). */
    'no-undef': 'off',

    // We need to use the extended 'no-shadow' rule from typescript:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',

    'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }],

    // Enforce v-bind directive usage in shorthand form.
    'vue/v-bind-style': ['error', 'shorthand'],

    // Enforce v-on directive usage in shorthand form.
    'vue/v-on-style': ['error', 'shorthand'],

    // Ignore virtual modules
    'import/no-unresolved': ['error', { ignore: ['^virtual:', 'vue-router/auto/routes'] }],

    // Disable the following rule, because it's not relevant for the tool chain
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.config.ts', '.eslintrc.cjs']
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
