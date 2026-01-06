<!--
 * @Author: wuhaoyuan
 * @Date: 2022-09-01 16:51:18
 * @LastEditTime: 2022-09-01 17:00:06
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/工程化/parcel添加打包后banner.md
-->

# parcel 添加打包后 banner

## 环境说明

版本：parcel 2.X （我的版本：2.6.2）

## 如何添加

1. 安装插件

```shell
$ npm install -D @parcel/optimizer-terser
```

2. 在项目根目录下新增文件 `.terserrc.js`

文件内容：

```js
module.exports = {
  output: {
    preamble: "<your banner>",
  },
};
```

3. 一些我的操作

安装 `dayjs` 依赖，创建目录及文件 `build/banner.js`

```shell
npm install -D dayjs
```

```js
// build/banner.js
const { name, version } = require("../package.json");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
// 考虑部分 linux 服务器是 utc 时间，需要转换到北京时间
// 所以利用 dayjs 获取时间直接取 utc，按照时区，增加8小时
const buildTime = dayjs.utc().add(8, "hour").format("YYYY-MM-DD HH:mm:ss");

module.exports = `/**
 * ${name}
 * build time: ${buildTime}
 * version: ${version}
 */`;
```

```js
// .terserrc.js
const banner = require("./build/banner.js");

module.exports = {
  output: {
    preamble: banner,
  },
};
```

## 效果如图

![效果如图](/img/iShot_2022-09-01_16.59.40.png)

> 参考链接：https://github.com/parcel-bundler/parcel/pull/2666
