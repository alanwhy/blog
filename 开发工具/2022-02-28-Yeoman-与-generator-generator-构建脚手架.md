<!--
 * @Author: wuhaoyuan
 * @Date: 2022-02-28 14:48:12
 * @LastEditTime: 2022-02-28 15:02:05
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /Desktop/yeoman.md
-->

## 起步

全局安装命令

```shell
$ npm install -g yo generator-generator
```

安装完成后执行

```shell
$ yo generator
```

会让输入 `name`、`description` 等相关信息

需要注意 `name` 会直接定义脚手架的命令方式，例如：`generator-mm-cli`

## 配置

复制所有项目文件到目录 `generator-mm-cli/generators/app/templates` 下，删除目录下的 `dummyfile.txt`

打开外层的 `index.js` 文件，进行配置的修改，下面给一个我的例子

```js
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the perfect ${chalk.red("generator-mm-cli")} generator!`
      )
    );

    // 一些初始化项目的配置
    const prompts = [
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名字",
        default: "minemap-project",
      },
      {
        type: "input",
        name: "version",
        message: "请输入项目版本号",
        default: "0.0.1",
      },
      {
        type: "input",
        name: "name",
        message: "请输入你的名字",
        default: "",
      },
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  configuring() {
    // 用于生成配置的 package.json
    const { projectName, version, name } = this.props;
    let packageSettings = {
      name: projectName,
      version: version,
      description: "",
      scripts: {
        watch: "rollup -w -c build/rollup.config.dev.js",
        dev: "rollup -c build/rollup.config.dev.js",
        build: "rollup -c build/rollup.config.prod.js",
      },
      keywords: ["minemap", "yeoman-generator"],
      author: name,
      dependencies: {},
      devDependencies: {
        "@babel/core": "^7.17.5",
        "@babel/preset-env": "^7.16.11",
        "@rollup/plugin-babel": "^5.3.1",
        "@rollup/plugin-commonjs": "^21.0.2",
        "@rollup/plugin-json": "^4.1.0",
        "@rollup/plugin-replace": "^4.0.0",
        rollup: "^2.68.0",
        "rollup-plugin-terser": "^7.0.2",
      },
    };

    this.fs.writeJSON(this.destinationPath("package.json"), packageSettings);
  }

  writing() {
    // 写入文件
    const templates = [
      ".babelrc",
      ".gitignore",
      ".nvmrc",
      ".prettierrc",
      "README.md",
      "src/main.js",
      "build/rollup.config.dev.js",
      "build/rollup.config.prod.js",
    ];
    templates.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.props
      );
    });
  }

  install() {
    // 安装依赖
    this.installDependencies({
      bower: false,
    });
  }
};
```

## 测试一下

```shell
# 进入脚手架项目根目录
$ cd generator-mm-cli

# 本地绑定一下命令行
$ npm link

# 切换上层目录
$ cd ..

# 新建一个文件夹
$ mkdir demo-dest

$ cd demo-dest

# 利用脚手架构建项目
$ yo mm-cli
```

顺着将信息输入完成，就可以看到项目被初始化好了

## 发布 npm

```shell
# 修改镜像源
$ npm config set registry https://registry.npmjs.org

# 登录
$ npm login

# 发布
$ npm publish

# 撤销发布
$ npm unpublish <your package name>@<package version> --force
```

## 如何使用

```shell
# 安装依赖
$ npm install -g yo
$ npm install -g generator-mm-cli

# 初始化项目
$ yo mm-cli
```
