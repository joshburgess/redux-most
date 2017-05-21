/* eslint-disable import/no-commonjs */

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    library: 'ReduxMost',
    libraryTarget: 'umd',
  },
  externals: {
    most: {
      root: 'Most',
      commonjs2: 'most',
      commonjs: 'most',
      amd: 'most',
    },
    redux: {
      root: 'Redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux',
    },
  },
  resolve: {
    extensions: ['.js'],
    mainFields: ['module', 'main', 'jsnext:main'],
  },
}

module.exports = config
