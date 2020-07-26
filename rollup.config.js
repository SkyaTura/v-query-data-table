import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import buble from '@rollup/plugin-buble'

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
  output: outputs.map(format => ({
    format,
    exports: 'named',
    file: `lib/bundle.${format}.js`,
    name: 'VQueryDataTable',
  })),
  plugins: [
    alias({
      resolve: ['.js', '.vue'],
      entries: {
        components: '.',
      },
    }),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: { isProduction: true },
    }),
    // cleanup(),
    buble({ transforms: { asyncAwait: false }, objectAssign: 'Object.assign' }),
    /*
                        babel({
                          runtimeHelpers: true,
                          sourceMap: true,
                          extensions: ['.js', '.vue'],
                          presets: ['@vue/babel-preset-app'],
                        }),
                         */
  ],
}

export default config
