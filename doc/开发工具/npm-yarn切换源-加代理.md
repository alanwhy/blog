### npm 和 yarn 转换淘宝源和官方源

```tcl
npm config set registry http://registry.npm.taobao.org/
npm config set registry https://registry.npmjs.org/

yarn config set registry http://registry.npm.taobao.org/
yarn config set registry https://registry.yarnpkg.com
```

### npm 设置代理

```shell
npm config set proxy http://127.0.0.1:8080
npm config set https-proxy http://127.0.0.1:8080
```

### npm 删除代理

```shell
npm config delete proxy
npm config delete https-proxy
```

### yarn 设置代理

```shell
yarn config set proxy http://127.0.0.1:8080
yarn config set https-proxy http://127.0.0.1:8080
```

### yarn 删除代理

```shell
yarn config delete proxy
yarn config delete https-proxy
```
