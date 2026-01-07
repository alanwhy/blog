<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:27:00
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/开发工具/脚本快速生成tree状目录结构（tree-node-cli）.md
-->
电脑是 windows 的，tree 命令不是很好使。能用 Node 就用 Node!

找了几个跨平台的。分别是[tree-cli](https://github.com/MrRaindrop/tree-cli "tree-cli")和[tree-node-cli](https://github.com/yangshun/tree-node-cli "tree-node-cli")，这两个是一个作者。其中 tree-node-cli 是比较适合 Linux 用户的，大小写区分，而且还有 API，但是目前不能直接生成文件。

### 安装 tree-node-cli

```shell
npm install -g tree-node-cli
```

### 卸载

```shell
npm uninstall -g tree-node-cli
```

### 使用

执行如下命令即可在终端中生成，复制保存下来即可

```shell
treee -L 3 -I "node_modules|.idea|objects|.git" -a --dirs-first
```

例如：

```shell
refined_road
├── public
│   ├── config
│   │   └── app-config.js
│   ├── static
│   │   ├── car
│   │   ├── lib
│   │   ├── map
│   │   ├── road
│   │   └── video
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── api
│   │   └── api.js
│   ├── assets
│   │   ├── img
│   │   └── common.scss
│   ├── components
│   │   ├── CarInfo.vue
│   │   ├── CarList.vue
│   │   ├── Map.vue
│   │   └── VideoPort.vue
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   ├── utils
│   │   ├── common.js
│   │   └── desc.js
│   ├── views
│   │   └── Home.vue
│   ├── App.vue
│   └── main.js
├── .browserslistrc
├── babel.config.js
├── db.json
├── package-lock.json
├── package.json
├── README.md
└── vue.config.js
```

### 解释

- treee：windows 用户需要用 treee 代替 tree，避免和系统的 tree 命令冲突。
- -L 3：指定路径的级别为 3 级。
- -I "node_modules|.idea|objects|.git"： 忽略文件夹（正则表达式匹配的，.git 会匹配到.gitignore,所以.gitignore 文件没有显示出来）。
- -a：显示所有文件（默认前缀有"."的不会显示，例如".electron-vue"）。
- --dirs-first：目录在前，文件在后（默认是字母排序，和 idea 显示的顺序不一致）。

### 完整选项

```shell
-V, --version             输出版本号
-a, --all-files           打印所有文件，包括隐藏文件
--dirs-first              目录在前，文件在后
-d, --dirs-only           仅列出目录
-I, --exclude [patterns]  排除与模式匹配的文件。用 | 隔开,用双引号包裹。 例如 “node_modules|.git”
-L, --max-depth <n>       目录树的最大显示深度
-r, --reverse             按反向字母顺序对输出进行排序
-F, --trailing-slash      为目录添加'/'
-h, --help                输出用法信息
```

> 原文链接：[使用 tree-node-cli 生成树状目录](https://blog.csdn.net/chenggedian7759/article/details/100985562)
