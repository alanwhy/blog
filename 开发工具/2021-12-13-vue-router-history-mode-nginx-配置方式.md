<!--
 * @Author: wuhaoyuan
 * @Date: 2021-12-13 20:28:09
 * @LastEditTime: 2021-12-13 20:41:53
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /undefined/Users/wuhaoyuan/Desktop/vue history mode nginx配置方式.md
-->
## 环境情况

- vue-cli 4.X
- nginx 1.21.X
- system: macos

## 一个域名、多个项目

域名/地址：www.yourDomain.com

项目 A：projectA（最终打包出来的文件夹名称）

项目 B：projectB（最终打包出来的文件夹名称）

想要最终的访问方式：

- www.yourDomain.com/projectA
- www.yourDomain.com/projectB

默认 vue-router 会配置如下：

```js
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL, // process.env.BASE_URL 指向的地址可以在 vue.config.js 中的 publicPath 配置，老的版本是 baseUrl
  routes,
});

export default router;
```

再来看一下 vue.config.js 的配置

```js
// projectA
module.exports = {
  publicPath: "/projectA", //
  outputDir: "projectA",
  // ...
};

// projectB
module.exports = {
  publicPath: "/projectB", //
  outputDir: "projectB",
  // ...
};
```

接着来配置 nginx

```shell
location /projectA {
    index  index.html index.htm;
    try_files $uri $uri/ /projectA/index.html;
}

location /projectB {
    index  index.html index.htm;
    try_files $uri $uri/ /projectB/index.html;
}
```

保存配置，重启 nginx 或者重新加载 nginx 配置

```shell
$ nginx restart

# or

$ nginx -s reload
```

## 一个域名、一个项目

域名/地址：www.yourDomain.com

项目：project（最终打包出来的文件夹名称）

首先 vue-router 的文件不用动，去修改 vue.config.js 的 publicPath

```js
module.exports = {
  publicPath: "/", //
  outputDir: "project",
  // ...
};
```

nginx 中配置

```shell
location / {    
  root /usr/local/var/www;  # 项目在服务器上的真实路径
  index  index.html index.htm;
  try_files $uri $uri/ @rewrites; 
} 
        
location @rewrites {
  rewrite ^(.*)$ /index.html last;
}
```

> 原文链接：https://www.jianshu.com/p/2ddb5983c04f
