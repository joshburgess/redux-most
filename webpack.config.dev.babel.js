import webpack from 'webpack'
import baseConfig from './webpack.config.base.babel'

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

export default config
