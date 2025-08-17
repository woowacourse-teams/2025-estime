import path from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import webpack from 'webpack';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// package.json 파일 객체로 만들기
const pkg = JSON.parse(readFileSync(path.resolve('./package.json'), 'utf-8'));

dotenv.config();

// 빌드시, index.html에 버전 정보 넣기
class InjectVersionConsolePlugin {
  constructor(version) {
    this.version = version;
  }
  apply(compiler) {
    // "컴파일" 객체가 만들어질 때마다 한번씩 호출되는 훅에 구독
    compiler.hooks.compilation.tap('InjectVersionConsolePlugin', (compilation) => {
      // HtmlWebpackPlugin이 노출한 훅 세트 가져오기
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        'InjectVersionConsolePlugin',
        (data) => {
          const banner = `<script>console.info('v${this.version}');</script>`;
          // 최종 HTML 문자열을 바꿔치기
          data.html = data.html.replace('</body>', `${banner}\n</body>`);
        }
      );
    });
  }
}

export default {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true, // 빌드 때 dist 폴더 정리
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // @로 시작하는 import 경로를 src 폴더로 매핑
    },
  }, // import 할 때, 확장자명 추론해줌. (사용할 때 안붙여도 됨.)
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './src/assets/images/logo.svg',
    }),
    new ForkTsCheckerPlugin(),
    new InjectVersionConsolePlugin(pkg.version),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
