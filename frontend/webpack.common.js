import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerPlugin from "fork-ts-checker-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true, // 빌드 때 dist 폴더 정리
  },
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] }, // import 할 때, 확장자명 추론해줌. (사용할 때 안붙여도 됨.)
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }],
              "@babel/preset-typescript",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      { test: /\.(png|jpe?g|gif|svg)$/, type: "asset/resource" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new ForkTsCheckerPlugin(),
  ],
};
