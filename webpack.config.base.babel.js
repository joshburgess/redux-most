const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            ['env', { modules: false }],
            'stage-3',
            'react',
          ],
        },
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

export default config
