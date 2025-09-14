import path from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import webpack from 'webpack';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin';
import getBuildMeta from './build/utils/buildMeta.js';
import InjectVersionConsolePlugin from './build/plugins/InjectVersionConsolePlugin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// package.json 파일 객체로 만들기
const pkg = JSON.parse(readFileSync(path.resolve('./package.json'), 'utf-8'));

dotenv.config();

const { commit: COMMIT_HASH, builtAt: BUILD_TIME } = getBuildMeta();

export default {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
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
    new InjectVersionConsolePlugin({
      version: pkg.version,
      commit: COMMIT_HASH,
      builtAt: BUILD_TIME,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
