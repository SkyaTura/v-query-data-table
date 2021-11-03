module.exports = {
  chainWebpack: (config) => {
    config.plugin('VuetifyLoaderPlugin').tap((args) => [
      {
        match(originalTag, { kebabTag, camelTag, path, component }) {
          if (kebabTag.startsWith('core-')) {
            return [
              camelTag,
              `import ${camelTag} from '@/components/core/${camelTag.substring(
                4
              )}.vue'`,
            ]
          }
        },
      },
    ])
  },
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
