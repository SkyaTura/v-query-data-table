import alias from '@rollup/plugin-alias'
import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'

const outputs = ['esm', 'cjs', 'umd']

const config = {
  input: 'src/wrapper.js',
  external: [
    'vue',
    'vuetify',
    'vue-runtime-helpers',
    'regenerator-runtime',
    'components',
    'core-js',
  ],
  output: outputs.map((format) => ({
    format,
    exports: 'named',
    file: `lib/bundle.${format}.js`,
    name: 'VQueryDataTable',
  })),
  plugins: [
    alias({
      resolve: ['.js', '.vue'],
      entries: { components: '.' },
    }),
    commonjs(),
    vue({
      target: 'node',
      preprocessStyles: true,
    }),
    buble({
      transforms: { asyncAwait: false },
      objectAssign: 'Object.assign',
    }),
  ],
}

export default config
