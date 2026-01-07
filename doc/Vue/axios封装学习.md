> 视频地址：[https://www.imooc.com/learn/1152](https://www.imooc.com/learn/1152)
> 源码链接：[https://github.com/alanwhy/axios-api](https://github.com/alanwhy/axios-api)

业务场景是实现一个用户信息列表，具有增删改查的功能，页面操作本文不做说明，具体可以查看源码链接运行看

### axios 封装文件目录

```shell
axios-app
  |- service
    |- contactApi.js // api的url等
    |- http.js // 封装文件
  |- views
    |- List.vue
```

### api 的封装

```js
const CONTACT_API = {
  // 获取用户的列表
  getContactList: {
    method: "get",
    url: "/contactList",
  },
  // from-data类型的新增数据
  newContactFrom: {
    method: "post",
    url: "/contact/new/form",
  },
  // json类型的新增数据
  newContactJson: {
    method: "post",
    url: "/contact/new/json",
  },
  // 编辑数据
  editContact: {
    method: "put",
    url: "/contact/edit",
  },
  // 删除数据
  delContact: {
    method: "delete",
    url: "/contact",
  },
};
export default CONTACT_API;
```

### axios 的封装

```javascript
import axios from "axios";
// 引入上面文件封装的api路径
import service from "./contactApi";
// 提示框的引入 用于拦截器的信息提醒 提高用户体验
import { Toast } from "vant";

// 新建axios实例 设置好baseurl及过期时间
// axios的默认过期时间就是1000，所以这里不写也是ok的
let instance = axios.create({
  baseURL: "http://192.168.1.10:9000/api",
  timeout: 1000,
});

const Http = {}; // 包裹请求方法的容器

// 请求格式统一
for (let key in service) {
  // 拿到每一个API的对象
  let api = service[key];
  // 采用async-await，避免回调地狱
  // params 主要用于post，put，patch等请求参数，get等需要具体参数，见后面代码
  // isFormData 区分form-data
  // config 配置参数 如header，token等
  Http[key] = async function (params, isFormData = false, config = {}) {
    let newParams = {};
    // formdata做特殊的判断
    if (params && isFormData) {
      newParams = new FormData();
      for (let i in params) {
        newParams.append(i, params[i]);
      }
    } else {
      newParams = params;
    }

    // 不同请求的判断
    let response = {}; // 请求的返回值
    if (api.method === "put" || api.method === "post" || api.method === "patch") {
      try {
        response = await instance[api.method](api.url, newParams, config);
      } catch (e) {
        response = e;
      }
    } else if (api.method === "delete" || api.method === "get") {
      config.params = newParams;
      try {
        response = await instance[api.method](api.url, config);
      } catch (e) {
        response = e;
      }
    }
    return response;
  };
}

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 请求前 do something
    // 此处为弹出提示框
    Toast.loading({
      mask: false,
      duration: 0,
      forbidClick: true,
      message: "加载中...",
    });
    return config;
  },
  (e) => {
    Toast.clear();
    Toast(e.message);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 响应后 do something
    // 关闭弹出框
    Toast.clear();
    return res.data;
  },
  (e) => {
    Toast.clear();
    Toast(e.message);
  }
);

export default Http;
```

### 暴露全局

到 main.js 中加入代码

```js
import Http from "./service/http";
// 把http挂载到vue实例上
Vue.prototype.$Http = Http;
```

### 接口请求使用方式举例

```js
  // 获取用户信息
    async getList() {
      let res = await this.$Http.getContactList();
      this.list = res.data;
    },
    // 修改和新增用户
    async onSave(info) {
      if (this.isEdit) {
        let res = await this.$Http.editContact(info);
        if (res.code == 200) {
          this.$toast("编辑成功！");
          this.showEdit = false;
          this.getList();
        }
      } else {
        let res = await this.$Http.newContactJson(info);
        if (res.code == 200) {
          this.$toast("新建成功！");
          this.showEdit = false;
          this.getList();
        }
      }
    },
    // 删除用户
    async onDelete(info) {
      let res = await this.$Http.delContact({
        id: info.id
      });
      if (res.code == 200) {
        this.$toast("删除成功！");
        this.showEdit = false;
        this.getList();
      }
    }
```
