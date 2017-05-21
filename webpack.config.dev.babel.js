/* eslint-disable import/no-commonjs */

const webpack = require('webpack')
const baseConfig = require('./webpack.config.base.babel')

const config = {
  ...baseConfig,
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('development'),
        },
      },
    }),
  ],
}

module.exports = config
