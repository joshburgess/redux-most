'use strict'

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'ReduxMost',
    libraryTarget: 'umd'
  },
  externals: {
    most: {
      root: 'Most',
      commonjs2: 'most',
      commonjs: 'most',
      amd: 'most'
    },
    redux: {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux'
    }
  },
  resolve: {
    extensions: ['', '.js']
  }
}
