
const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口 多入口则配置成对象形式
  entry: "./src/main.js",
  // 输出 需使用绝对路径
  output: {
    // path: path.resolve(__dirname, 'dist'), 使用 webpack server 没有输出
    path: undefined,
    filename: 'static/js/main.js', // 将js输出到 static/js 目录中
    // clean: true
  },
  // loader
  module: {
    rules: [
      {
        oneOf: [
          // 两个loader顺序按此 它会先使用后面的
          { test: /\.css$/i, use: ["style-loader", "css-loader"] },
          // less-loader将less转为css后还是要交给css-loader处理的
          { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
          {
            test: /\.s[ac]ss$/,
            use: ["style-loader", "css-loader", "sass-loader"],
          },
          {
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
              }
            },
            generator: {
              // 将图片文件输出到 static/imgs 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:6]: hash值取6位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: "static/imgs/[hash:6][ext][query]",
            },
          },
          {
            // 处理字体图标或者视频等其它资源
            test: /\.(ttf|woff2?|map4|map3)$/,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:8][ext][query]",
            },
          },
          { // babel配置
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            loader: "babel-loader",
          },
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      // path.resolve(__dirname 获取的是当前文件所在文件夹的绝对路径
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({ // html处理的插件
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    })
  ],
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "666", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  // development 或者 production
  mode: "development",
  devtool: "cheap-module-source-map"
}