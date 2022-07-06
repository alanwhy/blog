```js
const path = require("path");
// gzip压缩
const CompressionPlugin = require("compression-webpack-plugin");
//监控日志
const SentryCliPlugin = require("@sentry/webpack-plugin");
// 代码压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Version = new Date().getTime();
function resolve(dir) {
  return path.join(__dirname, dir);
}
const cdn = {
  js: [
    // vue必须在第一个
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js",
    "https://cdn.bootcss.com/axios/0.18.1/axios.min.js",
    "https://cdn.bootcss.com/qs/6.5.1/qs.min.js",
    "https://cdn.jsdelivr.net/npm/vant@2.5.4/lib/vant.min.js",
  ],
};
module.exports = {
  publicPath: "./", // 部署应用包时的基本 URL
  outputDir: "wx_vue", // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
  assetsDir: "./" + Version + "/assets", // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查 安装 @vue/cli-plugin-eslint 有效
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本。设置 true 后你就可以在使用 template
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件 sourceMap 的详解请看末尾
  filenameHashing: true, // 去掉hash
  //   pages: {
  //     index: {
  //       entry: "src/main.js",
  //       template: "public/index.html",
  //       filename: "index.html",
  //     },
  //   },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
      config.devtool = "source-map";
    } else {
      // 为开发环境修改配置...
      config.mode = "development";
    }
    // 删除懒加载模块的 prefetch preload，降低带宽压力(使用在移动端)
    config.plugins.delete("prefetch").delete("preload");
    config.optimization.minimize(true);
    // gzip压缩
    // config
    //   .plugin("compressionPlugin")
    //   .use(CompressionPlugin)
    //   .tap(() => [
    //     {
    //       filename: "[path].gz[query]",
    //       algorithm: "gzip",
    //       test: /\.js$|\.html$|\.css/, //匹配文件名
    //       threshold: 10240, //超过10k进行压缩
    //       minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
    //       deleteOriginalAssets: false, //是否删除源文件
    //     },
    //   ]);
    config.plugins.push(
      new CompressionPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.html$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
      })
    );
    // 公共代码抽离
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: "all",
            test: /node_modules/,
            name: "vendor",
            minChunks: 1,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 100,
          },
          common: {
            chunks: "all",
            test: /[\\/]src[\\/]js[\\/]/,
            name: "common",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 60,
          },
          styles: {
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
    };
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@": resolve("src"),
        "@c": path.resolve(__dirname, "./src/components"),
        assets: path.resolve(__dirname, "../src/assets"),
      },
    },
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      axios: "axios",
      qs: "Qs",
      vant: "Vant",
      //   "weixin-js-sdk": "weixin-js-sdk",
      //   clipboard: "clipboard",
      //   qrcodejs2: "qrcodejs2",
      //   "js-md5": "js-md5",
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              // 删除注释
              comments: false,
            },
            // 生产环境自动删除console
            compress: {
              // warnings: false, // 若打包错误，则注释这行
              drop_debugger: true, // 清除 debugger 语句
              drop_console: true, // 清除console语句
              pure_funcs: ["console.log"],
            },
          },
          sourceMap: false,
          parallel: true,
        }),
      ],
    },
  },

  // css相关配置
  css: {
    extract: false,
    loaderOptions: {
      stylus: {
        "resolve url": true,
        import: [],
      },
      //   less: {
      //     // `globalVars` 定义全局对象，可加入全局变量
      //     globalVars: {
      //       primary: "#333",
      //     },
      //   },
    },
    requireModuleExtension: true,
  },

  // webpack-dev-server 相关配置
  devServer: {
    // 设置代理
    hot: true, // 热加载
    host: "localhost", // ip地址
    port: 8080, // 端口
    https: false, // false关闭https，true为开启
    open: true, // 自动打开浏览器
    proxy: {
      // 配置多个跨域
      "/api": {
        // 本地
        target: "https://yishanol.cn/ysol_wx",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  pluginOptions: {
    // 第三方插件配置
    // ...
  },
  chainWebpack: (config) => {
    // ============压缩图片 start============
    config.module
      .rule("images")
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        // { bypassOnDebug: true }
        mozjpeg: { progressive: true, quality: 65 }, // Compress JPEG images
        optipng: { enabled: false }, // Compress PNG images
        pngquant: { quality: [0.65, 0.9], speed: 4 }, // Compress PNG images
        gifsicle: { interlaced: false }, // Compress SVG images
        // webp: { quality: 75 },
      })
      .end();
    // config.module.rules.push({
    //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    //   use: [
    //     {
    //       loader: "image-webpack-loader",
    //       options: { bypassOnDebug: true },
    //     },
    //   ],
    // });
    // ============压缩图片 end============
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
    // 添加分析工具
    if (process.env.NODE_ENV === "production") {
      if (process.env.npm_config_report) {
        config
          .plugin("webpack-bundle-analyzer")
          .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
          .end();
        config.plugins.delete("prefetch");
      }
    }

    if (process.env.UMI_ENV === "production") {
      // 当为 prod 时候才进行 sourcemap 的上传，如果不判断，在项目运行的打包也会上传 这个为线上日志输出 不需要的可以删除掉
      config.plugin("sentry").use(SentryCliPlugin, [
        {
          ignore: ["node_modules"],
          include: /\.map$/, // 上传dist文件的js
          configFile: "sentry.properties", // 配置文件地址，这个一定要有，踩坑在这里，忘了写导致一直无法实现上传sourcemap
          release: "release@0.0.1", // 版本号，自己定义的变量，整个版本号在项目里面一定要对应
          deleteAfterCompile: true,
          urlPrefix: "~/wx_vue/", // cdn js的代码路径前缀
        },
      ]);
    }
  },
};
```

原文链接：[vue.config.js打包优化(有效)](https://blog.csdn.net/weixin_44021417/article/details/106668042)
