module.exports = {
  root: true,
  extends: [
    "@emiolo/eslint-config/node",
    "@emiolo/eslint-config/ts",
    "@emiolo/eslint-config/prettier",
    "@emiolo/eslint-config/jest",
    "@emiolo/eslint-config/vue",
  ],
  ignorePatterns: ["node_modules", "lib", "dist", ".thalamus", ".nuxt"],
  rules: {},
};
