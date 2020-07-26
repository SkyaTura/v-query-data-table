module.exports = {
  root: true,
  extends: ['@emiolo/eslint-config/vue'],
  rules: {
    'vue/no-duplicate-attr-inheritance': ['off'],
    'vue/no-potential-component-option-typo': ['off'],
    'vue/no-useless-mustaches': ['off'],
    'vue/no-useless-v-bind': ['off'],
    'vue/match-component-file-name': ['off'],
    'no-console': ['off'],
  },
}
