<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-14 17:46:11
 * @LastEditTime: 2022-07-14 20:12:51
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/前端性能优化/vue-cli 打包优化.md
-->

# vue-cli 打包优化

参考：[分离第三方类库 DllPlugin 和 DllReferencePlugin](https://blog.csdn.net/qq_42853570/article/details/114079737/)
[详解基于 DllPlugin 和 DllReferencePlugin 的 webpack 构建优化](https://www.yisu.com/zixun/178486.html)

## vue.config.js

```js
/*
 * @Author: wuhaoyuan
 * @Date: 2022-06-28 17:00:11
 * @LastEditTime: 2022-07-14 17:32:58
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /md-platform/vue.config.js
 */
const { defineConfig } = require("@vue/cli-service");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const path = require("path");
const webpack = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const resolve = (dir) => path.join(__dirname, dir);

const publishPath = "/md-platform";

module.exports = defineConfig({
  publicPath: publishPath,
  outputDir: "md-platform",
  pages: {
    index: {
      template: "public/index.html",
      entry: "src/main.js",
    },
  },
  productionSourceMap: false,
  chainWebpack: (config) => {
    if (process.env.use_analyzer) {
      config.plugin("webpack-bundle-analyzer").use(BundleAnalyzerPlugin);
    }
    config.resolve.alias.set("@", resolve("src"));

    config.module.rule("svg").exclude.add(resolve("src/assets/svg")).end();
    config.module
      .rule("svg-sprite")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
        include: ["src/assets/svg"],
      })
      .end();
    config.cache(true);
  },
  configureWebpack: (config) => {
    config.plugins.push(
      ...[
        new webpack.DllReferencePlugin({
          context: process.cwd(),
          manifest: require("./dll/vendor-manifest.json"),
        }),
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: resolve("dll/*.js"),
          // dll 引用路径
          publicPath: `${publishPath}/vendor`,
          // dll最终输出的目录
          outputPath: `./vendor`,
        }),
      ]
    );
    /* config.optimization = {
      splitChunks: {
        // 分割代码块
        cacheGroups: {
          vendor: {
            //第三方库抽离
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1, //在分割之前，这个代码块最小应该被引用的次数
            maxInitialRequests: 5,
            minSize: 0, //大于0个字节
            priority: 100, //权重
          },
          common: {
            //公用模块抽离
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
            maxInitialRequests: 5,
            minSize: 0, //大于0个字节
            priority: 60,
          },
          styles: {
            //样式抽离
            name: "styles",
            test: /\.(sa|sc|c)ss$/,
            chunks: "all",
            enforce: true,
          },
          runtimeChunk: {
            name: "manifest",
          },
        },
      },
    }; */
  },
  css: {
    /* 配置 scss 全局变量 */
    loaderOptions: {
      scss: {
        additionalData: `@import '~@/scss/var.scss';@import '~@/scss/service.var.scss';`,
      },
    },
  },
  transpileDependencies: true,
  devServer: {},
});
```

## webpack.dll.conf.js

```js
/*
 * @Author: wuhaoyuan
 * @Date: 2022-07-14 13:51:13
 * @LastEditTime: 2022-07-14 15:59:02
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /md-platform/webpack.dll.conf.js
 */
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

// dll文件存放的目录
const dllPath = "dll";
const vendorModules = [
  "vue",
  "vue-router",
  "vuex",
  "echarts",
  "element-ui",
  "lodash",
];

module.exports = {
  entry: {
    // 需要提取的库文件
    vendor: vendorModules,
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: "[name].dll.js",
    // vendor.dll.js中暴露出的全局变量名
    // 保持与 webpack.DllPlugin 中名称一致
    library: "[name]_[hash]",
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(["*.*"], {
      root: path.join(__dirname, dllPath),
    }),
    // 设置环境变量
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "production",
      },
    }),
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, "[name]-manifest.json"),
      // 保持与 output.library 中名称一致
      name: "[name]_[hash]",
      context: process.cwd(),
    }),
  ],
};
```

## package.json

```json
{
  // ...
  "scripts": {
    "build": "vue-cli-service build",
    "analyzer": "use_analyzer=true npm run build",
    "dll": "webpack -p --progress --config ./webpack.dll.conf.js"
  },
  // ...
  "devDependencies": {
    "add-asset-html-webpack-plugin": "^3.2.2",
    "clean-webpack-plugin": "^1.0.1",
    "svg-sprite-loader": "^6.0.11",
    "webpack-bundle-analyzer": "^4.5.0",
    "webpack-cli": "^3.3.12"
  }
  // ...
}
```
