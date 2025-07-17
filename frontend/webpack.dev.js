import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  // CSS 처리 최적화 - 개발환경에서도 별도 파일로 추출
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    static: ['./dist', './public'],
    hot: true,
    historyApiFallback: true, // SPA 라우팅
    port: 3000,
    open: true,
  },
});
