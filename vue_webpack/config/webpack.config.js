
const path = require("path");

// 定义环境变量给用户代码使用 cross-env定义的环境变量给打包工具使用
const { DefinePlugin } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// element plus 按需引入
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const isProduction = process.env.NODE_ENV === "production"

// vue-loader vue-style 提供了热更新的功能

const getStyleLoaders = (preProcessor) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "vue-style-loader", // 提取css
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        }
      }
    },
    preProcessor && {
      // 后面增加elment ui 的自定义主题
      loader: preProcessor,
      options: preProcessor === "sass-loader" ?
        {
          additionalData: `@use "@/style/element/index.scss" as *;`,
        } : {}
    },
  ].filter(Boolean)
}

module.exports = {
  entry: "./src/main.js",
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
    clean: true,
  },
  module: {
    rules: [
      { // vue-loader不支持oneOf
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(__dirname, "../node_modules/.cache/vue-loader")
        }
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
        options: {
          cacheDirectory: true,
          cacheCompression: false, // 缓存是否压缩
        }
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
      },
      {
        test: /\.(ttf|woff2?)$/,
        type: "asset/resource",
      },
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(
      { template: path.resolve(__dirname, "../public/index.html") }
    ),
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    // 解决页面警告
    new DefinePlugin({
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
    }),
    // 提取css
    isProduction && new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    // 复制文件到dist
    isProduction && new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          toType: "dir",
          noErrorOnMissing: true,
          globOptions: {
            ignore: ["**/index.html"],
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),
    // element plus 按需引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver(
        { importStyle: "sass", } // 自定义主题时配置
      )],
    }),
  ].filter(Boolean), // 不要的就过滤掉
  optimization: {
    minimize: isProduction, // 指定是否需要压缩
    // 压缩操作
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vue: { // vue 打包到一起
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: 'vue-chunk',
          priority: 40 // 权重
        },
        elementPlus: { // elementPlus 打包到一起
          test: /[\\/]node_modules[\\/]element-plus(.*)?[\\/]/,
          name: 'elmentPlus-chunk',
          priority: 30 // 权重低一些
        },
        libs: { // 其它包 打包到一起
          test: /[\\/]node_modules[\\/]/,
          name: 'libs-chunk',
          priority: 20 // 权重低一些
        },
      }
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    }
  },
  resolve: {// 自动补全文件扩展名
    extensions: [".vue", ".js", ".json"],
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "../src")
    }
  },
  devServer: {
    host: "localhost",
    port: "996",
    open: true,
    hot: true,
    historyApiFallback: true, // 解决前端路由404
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  performance: false, // 关闭性能分析提升打包速度
}