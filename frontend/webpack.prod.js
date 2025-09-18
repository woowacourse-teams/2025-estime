import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import common from './webpack.common.js';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InjectGTMPlugin from './build/plugins/InjectGTMPlugin.js';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './src/assets/images/logo.svg',
    }),
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
      sourcemaps: {
        filesToDeleteAfterUpload: '**/*.js.map',
      },
    }),
  ],
  optimization: {
    minimize: true,
    sideEffects: true,
    minimizer: [`...`, new CssMinimizerPlugin()],
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
