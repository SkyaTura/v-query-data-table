module.exports = {
  root: true,
  extends: [
    '@emiolo/eslint-config/node',
    '@emiolo/eslint-config/nuxt',
    '@emiolo/eslint-config/jest',
  ],
  ignorePatterns: ['node_modules', 'lib', 'dist', '.thalamus', '.nuxt'],
  rules: {
    'jest/no-hooks': ['off'],
  },
}
