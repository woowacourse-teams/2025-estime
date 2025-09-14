import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
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
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './src/assets/images/logo.svg',
      inject: 'head',
      scriptLoading: 'defer',
      templateParameters: {
        gtmScript: `
          <!-- Google Tag Manager -->
          <script>
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5G2XCWPL');
          </script>
          <!-- End Google Tag Manager -->
        `,
      },
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

      // deleteAfterCompile: true,
    }),
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
