const webpack = require('webpack')
const path = require('path')

const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const outputPath = 'dist'

module.exports = (_, args) => {
  
  const isDevelopmentMode = args.mode === 'development'

  return {
    target: 'node',
    mode: isDevelopmentMode ? 'development' : 'production',
    devtool: isDevelopmentMode ? 'source-map' : 'none',
    entry: {
      index: './src/index',
    },
    output: {
      filename: 'jmock.js',
      path: path.join(__dirname, outputPath),
      publicPath: '',
      libraryTarget: 'umd2',
      libraryExport: 'default',
      library: 'jmock',
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: [
            path.resolve(__dirname, 'src'),
          ],
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    optimization: {
      minimizer: isDevelopmentMode ? [
        // pass
      ] : [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            mangle: {
              keep_fnames: true,
            },
            compress: {
              drop_console: false,
              drop_debugger: true,
            },
            output: {
              beautify: false,
              comments: false,
            },
            ie8: true,
          },
        }),
      ]
    },
    plugins: isDevelopmentMode ? [
      // pass
    ] : [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new CleanWebpackPlugin(),
    ],
  }
};
