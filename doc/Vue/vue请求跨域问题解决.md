- production：产品 生产环境
- development：开发 开发环境

### 1、开发环境设置跨域

- 使用工具：vue-cli 自带的配置
- 配置目录 /config/index.js
  ![image.png](https://upload-images.jianshu.io/upload_images/12877063-5bcfcb9508d93488.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```js
//自行复制黏贴
proxyTable: {
  '/apis':{
    target: 'http://10.1.63.26:19080/',  // 后台api
    changeOrigin: true,  //是否跨域
    // secure: true,
    pathRewrite: {
      '^/apis': ''   //需要rewrite的,
    }
  }
}
```

注意：以上配置只有在生产环境下有效，打包后就不起作用了

### 2、生产环境设置跨域

- 使用 axios #####思路
  首先，axios 的默认实例有一个 baseURL 的属性，配置了 baseURL 之后，你访问接口时就会自动带上

```js
//假设你vue-cli起了一个开发环境，地址为http://localhost:8080
//例1 当不设置baseURL时
axios.get("/user"); //访问/user相当于访问 http://localhost:8080/user

//例2
axios.defaults.baseURL = "/apis";
axios.get("/user"); //访问/user就相当于访问 http://localhost:8080/apis/user

//例3
axios.defaults.baseURL = "https://sbsb.com";
axios.get("/user"); //访问/user就相当于访问 https://sbsb.com/user

//例4
axios.defaults.baseURL = "https://sbsb.com/apis";
axios.get("/user"); //访问/user就相当于访问 https://sbsb.com/apis/user
```

根据现在的环境是开发环境还是生产环境，配置不同的 baseURL

```js
//判断是否是生产环境
var isPro = process.env.NODE_ENV === "production"; //process.env.NODE_ENV用于区分是生产环境还是开发环境
//配置不同的baseURL
module.exports = {
  baseURL: isPro ? "http://sbsb.com:8888/" : "/apis",
};
```

`process.env.NODE_ENV`用于区分是生产环境还是开发环境，这个值是 webpack 设置的

然后，在 main.js 中引入 axios 和刚才那个文件

```js
//main.js
import Vue from "vue";
import axios from "axios";
import apiConfig from "../config/api.config.js";
axios.defaults.baseURL = apiConfig.baseURL;
//axios的其他配置...
```

这样配置之后，打包部署到服务器上也不用再手工去除/apis

> 参考原文： [vue 开发环境配置跨域，一步到位](https://segmentfault.com/a/1190000017905030)
