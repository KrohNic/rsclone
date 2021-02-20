const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    watch: !isProduction,
    entry: ['./src/index.ts'],
    output: {
      filename: '[name].[contenthash].js',
      path: isProduction
        ? path.join(__dirname, '/rsClone')
        : path.join(__dirname, '/dist'),
    },
    devServer: {
      port: 4200,
      open: true,
      overlay: true,
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
              ],
            },
          },
        },
        {
          test: /\.(css|s[ca]ss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '',
              },
            },
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpe?g|gif|wav)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.(ttf|woff|woff2|eot)$/i,
          loader: 'file-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    plugins: [
      new HTMLWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        favicon: './src/assets/ico/favicon.ico',
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
    ],
  };

  return config;
};
