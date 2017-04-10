const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')

const config = Object.assign({}, baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('production'),
        },
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
  ],
})

module.exports = config
