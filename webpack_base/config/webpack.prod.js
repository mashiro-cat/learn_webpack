
const path = require('path')
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin");

// const os = require("os");
// cpu核数
// const threads = os.cpus().length;

module.exports = {
  // 入口 多入口则配置成对象形式
  entry: "./src/main.js",
  // 输出 需使用绝对路径
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/main.js', // 将js输出到 static/js 目录中
    clean: true
  },
  // loader
  module: {
    rules: [
      {
        oneOf: [
          // 两个loader顺序按此 它会先使用后面的
          {
            test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader", {
              loader: "postcss-loader", // // 在css-loader之后，预处理器loader之前
              options: {
                postcssOptions: {
                  plugins: [
                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                  ],
                },
              },
            }],
          },
          // less-loader将less转为css后还是要交给css-loader处理的
          {
            test: /\.less$/, use: [MiniCssExtractPlugin.loader, "css-loader", {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                  ],
                },
              },
            }, "less-loader"]
          },
          {
            test: /\.s[ac]ss$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    "postcss-preset-env", // 能解决大多数样式兼容性问题
                  ],
                },
              },
            }, "sass-loader"],
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
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../scr"),
            loader: "babel-loader",
            // use:[
            //   {
            //     loader: "thread-loader", // 开启多进程
            //     options: {
            //       workers: threads, // 数量
            //     },
            //   },
            //   {
            //     loader: "babel-loader",
            //     options: {
            //       cacheDirectory: true, // 开启babel编译缓存
            //     },
            //   },
            // ],
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      // 指定缓存目录
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
      // threads,
    }),
    new HtmlWebpackPlugin({ // html处理的插件
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css"
    }),
    // css压缩
    // new CssMinimizerPlugin(),
  ],
  optimization: { //此处多放压缩相关配置
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      // new TerserPlugin({
      //   parallel: threads // 开启多进程
      // })
    ],
  },
  // devServer: {
  //   host: "localhost", // 启动服务器域名
  //   port: "666", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  // development 或者 production
  mode: "production",
  devtool: "source-map"
}