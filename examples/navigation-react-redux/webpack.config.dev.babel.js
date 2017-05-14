import path from 'path'
import webpack from 'webpack'

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
  devServer: {
    contentBase: PATH_SRC,
    historyApiFallback: {
      index: PATH_PUBLIC,
    },
    hot: true,
    inline: true,
    open: true,
    port: 3000,
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('development'),
        },
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}

export default config
