const { resolve } = require('path')

module.exports = function() {
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'v-query-data-table.js',
  })
}

module.exports.meta = require('../package.json')
