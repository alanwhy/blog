# Cesium 与 webpack4.0 初始化开发

### 需要的支持储备

- 已经安装好 node.js，6 版本及更高，并且是 LTS 版本
- 一个支持 webgl 的浏览器

### 创建一个 webpack 项目

1、新建项目文件夹 cesium-webpack-demo

2、在文件夹下打开命令行，输入

```shell
npm init -y
```

`-y`为默认初始化的配置，可以不加

3、创建好`package.json`文件后，新建 src 文件夹，创建模版文件 `index.html`和 webpack 入口文件 `index.js`

index.html

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>cesium</title>
  </head>
  <body>
    <div id="cesiumContainer"></div>
  </body>
</html>
```

index.js

```javascript
console.log("hello world")
```

4、安装并配置 webpack

```shell
npm i webpack -D
```

在项目根目录下创建`webpack.config.js`的文件，并写入配置

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

此处配置了 context 环境的基本路径，设置`src/index.js`作为入口文件，并命名为 app

5、安装并配置 loader

```shell
npm i style-loader css-loader url-loader -D
```

修改配置

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
};
```

6、安装并配置 Plugins

```shell
npm i html-webpack-plugin -D
```

并设置模版

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};
```

7、配置脚本

在`package.json`中新增脚本

```json
"scripts": {
    "build": "node_modules/.bin/webpack --config webpack.config.js"
  },
```

> ⚠️ 注意：配置了 node_modules 后可以采用项目本身的 webpack 进行打包操作，如果想使用全局的 webpack 进行打包，需要执行命令`npm i webpack -g`进行全局安装，修改配置为`webpack --config webpack.config.js`

8、打包测试

输入命令

```shell
npm run build
```

项目目录下生成新的文件夹 dist，其中包含 index.html 和 app.js 文件，用浏览器打开 index.html，控制台输出 hello world

9、安装 webpack-dev-server 快速提供开发版本查看

```shell
npm i webpack-dev-server webpack-cli -D
```

在`package.json`中新增脚本

```json
"scripts": {
    "build": "node_modules/.bin/webpack --config webpack.config.js",
    "start": "node_modules/.bin/webpack-dev-server --config webpack.config.js --open"
  },
```

在`webpack.config.js`中新增配置

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
};
```

控制台输入

```shell
npm start
```

浏览器自动打开到`http://localhost:8080`，可以看到控制台输出 hello world

10、添加 cesium 到项目中

```shell
npm i cesium -D
```

> 注意：cesium 是个庞大复杂的库，除了 js 脚本，还包含了大量的 css，image，json 等，与其他 npm 模块不同，cesium 没有入口点，需要自行配置，下面我们进行配置，来解决一些 cesium 的怪癖

在`webpack.config.js`中新增配置

```js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";

module.exports = {
  context: __dirname,
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    // needed to compile mutiline strings in Cesium
    sourcePrefix: "",
  },
  amd: {
    // enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  node: {
    // Resolve node module use of fs
    fs: "empty",
  },
  resolve: {
    alias: {
      // Cesium module name
      cesium: path.resolve(__dirname, cesiumSource),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ["url-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
  },
};
```

配置说明

- `output.sourcePrefix`：cesium 有多行字符串实例，需要用空前缀覆盖这个默认值
- `amd.toUrlUndefined`：AMD webpack 用来评估`require`语法版本不符合标准 toUrl 功能
- `node.fs`：解决`fs`模块的一些第三方使用情况
- `resolve`：为`cesium`新增一个别名

11、拷贝管理 cesium 的静态文件

引入`copy-webpack-plugin`

```shell
npm i copy-webpack-plugin -D
```

配置`webpack.config.js`

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");

plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    // copy Cesium Assets,Widgets,and Workers to a static directory
    new CopyWebpackPlugin([
      {
        from: path.join(cesiumSource, cesiumWorkers),
        to: "Workers",
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: path.join(cesiumSource, "Assets"),
        to: "Assets",
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: path.join(cesiumSource, "Widgets"),
        to: "Widgets",
      },
    ]),
    new webpack.DefinePlugin({
      // define relative base path in cesium fro loading assets
      CESIUM_BASE_URL: JSON.stringify(""),
    }),
  ],
```

12、程序引入 ceisum 的方式

CommonJS

```js
// 引入整库
var Cesium = require("cesium/Cesium")
var viewer = new Cesium.Viewer('cesiumContainer')

// 按需引入
var Color = require("cesium/Core/Color")
var color = Color.fromRandom()
```

ES6

```javascript
// 引入整库
import Cesium from "cesium/Cesium"
var viewer = new Cesium.Viewer("cesiumContainer")
// 按需引入
import Color from "cesium/Core/Color"
var color = Color.fromRandom()
```

需要引入资源文件

```js
require("cesium/Widgets/widgets.css")
```

13、最后最后！修改`src/index.js`

```js
var Cesium = require("cesium/Cesium");
require("cesium/Widgets/widgets.css");

var viewer = new Cesium.Viewer("cesiumContainer");
```

输入`npm start`运行，浏览器查看效果

![image.png](https://upload-images.jianshu.io/upload_images/12877063-b2050ddcc24ecfad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 源码地址：[https://github.com/alanwhy/cesium-webpack-demo](https://github.com/alanwhy/cesium-webpack-demo)
> 参考链接：[http://cesium.marsgis.cn/go.html?id=12](http://cesium.marsgis.cn/go.html?id=12)
