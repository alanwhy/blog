<!--
 * @Author: wuhaoyuan
 * @Date: 2022-08-05 09:28:25
 * @LastEditTime: 2022-08-05 10:34:39
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/开发工具/npm包发布详细教程.md
-->

# npm 包发布详细教程

## 项目配置

#### 初始化

```bash
# 初始化git
git init .

# 编写package.json
npm init --yes
```

- `name` 即 npm 项目包名，发布到 npm 时就是取的这个 name 名，你自己取个语义化的名字，和已有的 npm 库不能重复；
- `version` 版本号，更新 npm 包时必须修改一个更高的版本号后才能成功发布到 npm，版本号最好遵循 npm 版本管理规范；
- `description` 包的描述，发布到 npm 后你搜索该 npm 包时，在搜索联想列表里会显示在包名的下方，作为描述说明；
- `main` 入口文件路径，在你通过 import 或 require 引用该 npm 包时就是引入的该路径的文件；

#### 添加 LICENSE

#### 配置 npm 上传白名单

```json
{
  "main": "dist/index.min.js",
  "files": ["dist"],
  "repository": {
    "type": "git",
    "url": "<your git repository>"
  }
}
```

## 发布 npm

#### npm 注册登录

先去 npm 官网注册账号：https://www.npmjs.com/，或者通过终端命令注册：

```bash
npm adduser
```

终端命令，登录 npm 账号：

```bash
npm login
```

依次输入用户名和密码登录即可，登录成功后下次就不用再登录了。

#### 发布

```bash
npm publish
```

#### 注意

因为很多人把 npm 源都切到了淘宝源，毕竟速度快，但是发布 npm 前需要先恢复到 npm 官方源上，否则发布失败，切换命令：

```bash
// 配置npm全局使用淘宝镜像源
npm config set registry https://registry.npm.taobao.org
// 配置npm全局恢复官方镜像源
npm config set registry https://registry.npmjs.org
```

也可以用 [nrm](https://www.npmjs.com/package/nrm) 来实现常用镜像源的切换

#### 如果要发布一个 beta 包，运行命令：

```bash
npm publish --tag beta
```

其实就是发布了一个标签，标签名可以自定义，例如 alpha next。

> 原文链接 🔗：[npm 包发布详细教程](https://blog.csdn.net/u010059669/article/details/109715342)
