/* eslint-disable import/no-commonjs */

const path = require('path')
const webpack = require('webpack')

const PATH_SRC = path.join(__dirname)
const PATH_DIST = path.join(__dirname, 'dist')
const PATH_PUBLIC = '/static/'

const config = {
  entry: PATH_SRC,
  output: {
    path: PATH_DIST,
    filename: 'bundle.js',
    publicPath: PATH_PUBLIC,
  },
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
        warnings: false,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          'presets': [
            ['env', {
              'modules': false,
            }],
            'stage-3',
            'react',
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}

module.exports = config
