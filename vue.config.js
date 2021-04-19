module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        components: '.',
      },
    },
  },
  pages: {
    index: {
      entry: 'example/main.js',
      template: 'src/example/public/index.html',
      filename: 'index.html',
      title: 'Vuetify Query Data Table',
    },
  },
}
