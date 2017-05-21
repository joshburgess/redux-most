import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV

const basePlugins = [
  nodeResolve({
    jsnext: true,
  }),
  babel({
    plugins: ['external-helpers'],
    exclude: 'node_modules/**',
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
]

const prodPlugins = [
  uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
      screw_ie8: true,
    },
    mangle: {
      screw_ie8: true,
    },
    output: {
      screw_ie8: true,
    },
  }),
]

const config = {
  format: 'umd',
  external: ['most', 'redux', 'most-subject'],
  moduleName: 'ReduxMost',
  exports: 'named',
  plugins: env === 'production'
    ? [...basePlugins, ...prodPlugins]
    : basePlugins,
}

export default config
