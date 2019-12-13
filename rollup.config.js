import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import babel from 'rollup-plugin-babel'
import alias from '@rollup/plugin-alias'

const outputs = ['esm', 'cjs', 'umd']

const config = {
  input: 'src/wrapper.js',
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
    cleanup(),
    babel({
      runtimeHelpers: true,
      presets: ['@vue/cli-plugin-babel/preset'],
    }),
    // buble(),
    /*
     */
  ],
}

export default config
