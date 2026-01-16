import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import common from './webpack.common.js';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import InjectGTMPlugin from './build/plugins/InjectGTMPlugin.js';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',

  parallelism: 4,

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: ['babel-plugin-react-compiler', '@emotion'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new InjectGTMPlugin({
      gtmId: 'GTM-5G2XCWPL',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    sentryWebpackPlugin({
      org: 'estime',
      project: 'javascript-react',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      sourcemaps: {
        filesToDeleteAfterUpload: '**/*.js.map',
      },
    }),
  ],
  optimization: {
    minimize: true,
    sideEffects: true,

    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        framework: { test: /react|react-dom/, name: 'framework', priority: 40 },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 20,
        },
      },
    },
    runtimeChunk: 'single',
  },
});
