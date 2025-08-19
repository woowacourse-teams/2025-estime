import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import InjectGtmInProdPlugin from './build/plugins/InjectGTMPlugin.js';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import common from './webpack.common.js';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';

export default merge(common, {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        // CSS는 별도 파일로 뽑아야 캐싱에 유리
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
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

      // deleteAfterCompile: true,
    }),
    new InjectGtmInProdPlugin('GTM-5G2XCWPL'),
  ],
  //   optimization: {
  //     minimizer: [
  //       `...`, // 기본 minimizer 유지
  //       new CssMinimizerPlugin(), // CSS 압축 최적화
  //     ],
  //     splitChunks: {
  //       chunks: "all",
  //       cacheGroups: {
  //         // CSS를 별도 청크로 분리
  //         styles: {
  //           name: "styles",
  //           test: /\.css$/,
  //           chunks: "all",
  //           enforce: true,
  //         },
  //       },
  //     },
  //     runtimeChunk: "single",
  //   },
});
