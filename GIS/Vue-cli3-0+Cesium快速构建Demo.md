说在前面：本文章包含nodejs，vuejs，vue-cli3，Cesium等环境
安装node、vue和vue-cli3.0具体参考
[Vue 爬坑之路（一）—— 使用 vue-cli 搭建项目](https://www.cnblogs.com/wisewrong/p/6255817.html)
[Vue 爬坑之路（十二）—— vue-cli 3.x 搭建项目](https://www.cnblogs.com/wisewrong/p/9740173.html)

###一、环境说明
![image.png](https://upload-images.jianshu.io/upload_images/12877063-5fd44139d568f2f5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###二、初始化vue项目
######1.在想要创建项目的目录下打开cmd，执行
```
// cesium-demo为项目名
vue create cesium-demo
```
######2.设置所需要的vue选项，下图为参考
![image.png](https://upload-images.jianshu.io/upload_images/12877063-7bbe198c6b2ec9bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######3.选择配置项（空格选择），下图为我常用的
![image.png](https://upload-images.jianshu.io/upload_images/12877063-bdbe32c50b7d8d85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######4.选择路由方式，y为history，n为hash
![image.png](https://upload-images.jianshu.io/upload_images/12877063-6472a210371e0ed2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######5.CSS预编译工具
![image.png](https://upload-images.jianshu.io/upload_images/12877063-35993deacbd42a09.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######6.eslint检查标准选择
![image.png](https://upload-images.jianshu.io/upload_images/12877063-3f7f6f57c608def2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######7.什么时候检查？
![image.png](https://upload-images.jianshu.io/upload_images/12877063-68308222a88e9768.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######8.配置的文件都放哪里？
![image.png](https://upload-images.jianshu.io/upload_images/12877063-394b3b1fb98eac19.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######9.是否保存配置以便下次使用？
![image.png](https://upload-images.jianshu.io/upload_images/12877063-dadf71b35bc77c68.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
######10.等待初始化成功
###三、引入Cesium库
######1.进入到项目的文件夹，在此处打开cmd，输入
```
npm install cesium -s
```
######2.引入完成后，在项目文件夹下新建文件：`vue.config.js`，文件内容为：
```
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 5000,
    https: false,
    hotOnly: false
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: /^.\/.*$/,
      unknownContextCritical: false
    }
  }
};
```
######3.在views文件夹下新建组件`CesiumScene.vue`，文件内容：
```
<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import Cesium from "cesium/Cesium";
import widget from "cesium/Widgets/widgets.css";
export default {
  name: "CesiumScene",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      let viewerOption = {
        geocoder: false, // 地理位置查询定位控件
        homeButton: false, // 默认相机位置控件
        timeline: false, // 时间滚动条控件
        navigationHelpButton: false, // 默认的相机控制提示控件
        fullscreenButton: false, // 全屏控件
        scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
        baseLayerPicker: false, // 底图切换控件
        animation: false // 控制场景动画的播放速度控件
      };
      let viewer = new Cesium.Viewer(this.$el, viewerOption);
      viewer._cesiumWidget._creditContainer.style.display = "none";// 隐藏版权
    }
  }
};
</script>

<style lang='scss' scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
```
######4.修改App.vue文件内容如下：
```
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  color: #000;
  overflow: hidden;
}
</style>
```
######5.修改路由如下：
```
import Vue from 'vue'
import Router from 'vue-router'
import CesiumScene from './views/CesiumScene.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'scene',
      component: CesiumScene
    }
  ]
})
```
###四、启动项目
######1.在项目文件夹下打开cmd，输入
```
npm run serve
```
######2.打开浏览器，输入IP或localhost+端口号，即localhost:5000，查看结果
![image.png](https://upload-images.jianshu.io/upload_images/12877063-4d322745cf01bf8d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
