module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  globals: {
    'vue-jest': {
      pug: {
        doctype: 'html',
      },
    },
  },
}
