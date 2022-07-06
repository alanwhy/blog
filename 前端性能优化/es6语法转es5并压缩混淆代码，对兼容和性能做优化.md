### 需求分析
1、用es6的语法写了一个工具类
2、需要兼容除chrome外较新的浏览器
3、隐藏源码、缩小网络消耗

### 利用工具
- babel 用于es6转换es5
- uglifyjs 用于压缩混淆

### 步骤

##### 1、初始化一个项目
```
npm init -y
```

##### 2、安装babel及uglifyjs
```
npm install babel-preset-es2015 babel-cli --save-dev
npm install uglify-js --save-dev
```

##### 3、项目根目录下新建文件 `.babelrc`， 写入如下配置
```
{
  "presets": [
    "es2015"
  ],
  "plugins": []
}
```

##### 4、在 `package.json` 写入脚本
```
"scripts": {
    "build": "babel js/threejs-building.es6.js -o js/threejs-building.js",
    "uglifyjs": "uglifyjs js/threejs-building.js -m -c -o js/threejs-building.min.js"
},
```
 `build`  ：利用babel进行语法转换，`-o`前为输入文件路径，后为输出文件路径
`uglifyjs` ：进行代码混淆压缩（`uglifyjs`不支持ES6语法，所以需要先转换）
```
1. 输出: -o 输出的文件名
2. 压缩: -c
3. 混淆: -m
```
##### 5、打开控制台先执行`build`、后执行`uglifyjs`，得到如下文件如下
![image.png](https://upload-images.jianshu.io/upload_images/12877063-42c9cd118dc5ed3f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
