### 一、开发环境说明

![image.png](https://upload-images.jianshu.io/upload_images/12877063-cee9b9f69c8fccde.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 二、配置引入步骤（采用 ES6 import 方式）

##### 1、安装依赖包

采用`vue-cli3`进行 vue 项目的初始化，根据 [supermap 官网步骤](http://iclient.supermap.io/web/introduction/leafletDevelop.html#Ready) 引入 leaflet 以及 supermap iclient for leaflet 安装包

```shell
npm install leaflet
```

```shell
npm install @supermap/iclient-leaflet
```

###### 说明

[@supermap/iclient-leaflet](https://www.npmjs.com/package/@supermap/iclient-leaflet) 截止文章最后修改时间是 10.0.0 的版本 所依赖的 [leaflet](https://www.npmjs.com/package/leaflet) 的版本是 1.5.1
iclient-leaflet v9.1.2 等 9 的版本依赖于 leaflet 1.3.1 的版本

##### 2、引入依赖包

在 vue 项目的 main.js 中全局引入

```javascript
import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@supermap/iclient-leaflet";

Vue.use(L);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

完成引入，接下来正常写代码即可。 ###三、存在的问题

##### 1、IE 兼容问题 ######（1）配置`@babel/polyfill`

安装 `@babel/polyfill`

```shell
npm i @babel/polyfill
```

在`main.js`中的最上方引入

```shell
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
...
```

并在`babel.config.js`文件中配置如下

```js
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
      },
    ],
  ],
};
```

如果是 vue-cli2.0 的项目，则在`webpack.config.js`中添加如下配置

```js
module.exports = {
  entry: ["babel-polyfill", "./src/main.js"],
};
```

###### （2）配置 `babel-loader`

因为采用的是 es6 的 module 引入方式，ie 会不兼容，需要通过`babel-loader`进行转化，
安装`babel-loader`

```shell
npm i babel-loader
```

在 vue 工程的根目录新建一个文件 `vue.config.js`，配置参考 [官方 api](https://cli.vuejs.org/zh/config/)
![transpileDependencies.png](https://upload-images.jianshu.io/upload_images/12877063-b2dd4feffa94bdbc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
添加配置`transpileDependencies`，将 `node_modules` 下 supermap 的包名写进去
其中 `@supermap/iclient-leaflet` 依赖了 `@supermap/iclient-common` 所以都要写进去，配置如下

```js
module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  publicPath: "./", // 基本路径
  outputDir: "dist", // 输出文件目录
  productionSourceMap: false,
  transpileDependencies: ["@supermap/iclient-common", "@supermap/iclient-leaflet"],
  devServer: {
    host: "0.0.0.0", // can be overwritten by process.env.HOST
    port: 8080, // 端口配置
    proxy: {},
  },
};
```

如果是 vue-cli2.0 的项目，则在`webpack.config.js`中添加如下配置
参考：[iClient for Leafet 开发指南](http://iclient.supermap.io/web/introduction/leafletDevelop.html#Import)

```js
// 用 npm install 或者 cnpm install --by=npm 安装的依赖
module: {
  rules: [
    {
      // 使用babel-loader将ES6语法转换为ES5
      test: /\.js$/,
      include: [
        path.resolve(__dirname, "node_modules/@supermap/iclient-common"),
        path.resolve(__dirname, "node_modules/@supermap/iclient-leaflet"),
        // 由于iClient对Elasticsearch的API进行了封装而Elasticsearch也使用了ES6的语法
        path.resolve(__dirname, "node_modules/elasticsearch"),
      ],
      loader: "babel-loader",
      options: {
        presets: ["env"],
      },
    },
  ];
}

// 若您用 cnpm install 安装的依赖
module: {
  rules: [
    {
      // 使用babel-loader将ES6语法转换为ES5
      test: /\.js$/,
      include: [
        path.resolve(__dirname, "node_modules/_@supermap_iclient-common@10.0.0@@supermap/iclient-common"),
        path.resolve(__dirname, "node_modules/_@supermap_iclient-leaflet@10.0.0@@supermap/iclient-leaflet"),
        // 由于iClient对Elasticsearch的API进行了封装而Elasticsearch也使用了ES6的语法
        path.resolve(__dirname, "node_modules/_elasticsearch@13.0.1@elasticsearch"),
      ],
      loader: "babel-loader",
      options: {
        presets: ["env"],
      },
    },
  ];
}
```
