### 1.require.context() 1.场景:如页面需要导入多个组件,原始写法

```js
import titleCom from "@/components/home/titleCom";
import bannerCom from "@/components/home/bannerCom";
import cellCom from "@/components/home/cellCom";
components: {
  titleCom, bannerCom, cellCom;
}
```

2.这样就写了大量重复的代码,利用 require.context 可以写成

```js
const path = require("path");
const files = require.context("@/components/home", false, /\.vue$/);
const modules = {};
files.keys().forEach((key) => {
  const name = path.basename(key, ".vue");
  modules[name] = files(key).default || files(key);
});
components: modules;
```

3.API 方法

> 实际上是 webpack 的方法,vue 工程一般基于 webpack,所以可以使用
> `require.context(directory,useSubdirectories,regExp)`
> 接收三个参数:
> `directory`：说明需要检索的目录
> `useSubdirectories`：是否检索子目录
> `regExp`: 匹配文件的正则表达式,一般是文件名

### 4.render 函数 1.场景:有些代码在 template 里面写会重复很多,所以这个时候 render 函数就有作用啦

```html
// 初级
<template>
  <div>
    <div v-if="level === 1"> <slot></slot> </div>
    <p v-else-if="level === 2"> <slot></slot> </p>
    <h1 v-else-if="level === 3"> <slot></slot> </h1>
    <h2 v-else-if="level === 4"> <slot></slot> </h2>
    <strong v-else-if="level === 5"> <slot></slot> </stong>
    <textarea v-else-if="level === 6"> <slot></slot> </textarea>
  </div>
</template>
```

```html
// 优化版,利用 render 函数减小了代码重复率
<template>
  <div>
    <child :level="level">Hello world!</child>
  </div>
</template>
<script type="text/javascript">
  import Vue from "vue";
  Vue.component("child", {
    render(h) {
      const tag = ["div", "p", "strong", "h1", "h2", "textarea"][this.level - 1];
      return h(tag, this.$slots.default);
    },
    props: {
      level: { type: Number, required: true },
    },
  });
  export default {
    name: "hehe",
    data() {
      return { level: 3 };
    },
  };
</script>
```

2.render 和 template 的对比
前者适合复杂逻辑,后者适合逻辑简单;
后者属于声明是渲染，前者属于自定 Render 函数;
前者的性能较高，后者性能较低。

### 5.异步组件

场景:项目过大就会导致加载缓慢,所以异步组件实现按需加载就是必须要做的事啦 1.异步注册组件

```javascript
// 工厂函数执行 resolve 回调
Vue.component("async-webpack-example", function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包, 这些包
  // 会通过 Ajax 请求加载
  require(["./my-async-component"], resolve);
});

// 工厂函数返回 Promise
Vue.component(
  "async-webpack-example",
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import("./my-async-component")
);

// 工厂函数返回一个配置化组件对象
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import("./MyComponent.vue"),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000,
});
```

异步组件的渲染本质上其实就是执行 2 次或者 2 次以上的渲染, 先把当前组件渲染为注释节点, 当组件加载成功后, 通过 forceRender 执行重新渲染。或者是渲染为注释节点, 然后再渲染为 loading 节点, 在渲染为请求完成的组件

2.路由的按需加载

```js
webpack< 2.4 时
{
  path:'/',
  name:'home',
  components:resolve=>require(['@/components/home'],resolve)
}

webpack> 2.4 时
{
  path:'/',
  name:'home',
  components:()=>import('@/components/home')
}
```

import()方法由 es6 提出，import()方法是动态加载，返回一个 Promise 对象，then 方法的参数是加载到的模块。类似于 Node.js 的 require 方法，主要 import()方法是异步加载的。

### 6.动态组件

场景:做一个 tab 切换时就会涉及到组件动态加载

```html
<component v-bind:is="currentTabComponent"></component>
```

但是这样每次组件都会重新加载,会消耗大量性能,所以<keep-alive> 就起到了作用

```html
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

这样切换效果没有动画效果,这个也不用着急,可以利用内置的<transition>

```html
<transition>
  <keep-alive>
    <component v-bind:is="currentTabComponent"></component>
  </keep-alive>
</transition>
```

### 9.components 和 Vue.component

```js
// components:局部注册组件
export default {
  components: { home },
};

// Vue.component:全局注册组件
Vue.component("home", home);
```

### 11.mixins

场景:有些组件有些重复的 js 逻辑,如校验手机验证码,解析时间等,mixins 就可以实现这种混入

```js
const mixin = {
  created() {
    this.dealTime();
  },
  methods: {
    dealTime() {
      console.log("这是mixin的dealTime里面的方法");
    },
  },
};

export default {
  mixins: [mixin],
};
```

### 16.Vue.directive

场景:官方给我们提供了很多指令,但是我们如果想将文字变成指定的颜色定义成指令使用,这个时候就需要用到 Vue.directive

```javascript
// 全局定义
Vue.directive("change-color",function(el,binding,vnode){
  el.style["color"]= binding.value;
})

// 使用
<template>
<div v-change-color=“color”>{{message}}</div>
</template>
<script>
  export default{
    data(){
      return{
        color:'green'
      }
    }
  }
</script>
```

### 22.Vue.config.performance

场景:监听性能

```js
Vue.config.performance = true;
```

只适用于开发模式和支持 performance.mark API 的浏览器上

### 27.v-once

场景:有些 template 中的静态 dom 没有改变,这时就只需要渲染一次,可以降低性能开销

```html
<span v-once> 这时只需要加载一次的标签</span>
```

### 30.5 Vue.$router

```js
this.$router.push():跳转到不同的url，但这个方法回向history栈添加一个记录，点击后退会返回到上一个页面
this.$router.replace():不会有记录
this.$router.go(n):n可为正数可为负数。正数返回上一个页面,类似 window.history.go(n)
```

### 33.2 transformToRequire

场景:以前在写 Vue 的时候经常会写到这样的代码：把图片提前 require 传给一个变量再传给组件

```html
// page 代码
<template>
  <div>
    <avatar :img-src="imgSrc"></avatar>
  </div>
</template>
<script>
  export default {
    created() {
      this.imgSrc = require("./assets/default-avatar.png");
    },
  };
</script>
```

现在:通过配置 transformToRequire 后，就可以直接配置，这样 vue-loader 会把对应的属性自动 require 之后传给组件

```javascript
// vue-cli 2.x在vue-loader.conf.js 默认配置是
transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
}

// 配置文件,如果是vue-cli2.x 在vue-loader.conf.js里面修改
  avatar: ['default-src']

// vue-cli 3.x 在vue.config.js
// vue-cli 3.x 将transformToRequire属性换为了transformAssetUrls
module.exports = {
  pages,
  chainWebpack: config => {
    config
      .module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.transformAssetUrls = {
            avatar: 'img-src',
          }
        return options;
      });
  }
}

// page 代码可以简化为
<template>
  <div>
    <avatar img-src="./assets/default-avatar.png"></avatar>
  </div>
</template>
```

### 34.为路径设置别名 1.场景:在开发过程中，我们经常需要引入各种文件，如图片、CSS、JS 等，为了避免写很长的相对路径（../），我们可以为不同的目录配置一个别名

2.vue-cli 2.x 配置

```js
// 在 webpack.base.config.js中的 resolve 配置项，在其 alias 中增加别名
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
```

3.vue-cli 3.x 配置

```js
// 在根目录下创建vue.config.js
var path = require("path");
function resolve(dir) {
  console.log(__dirname);
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set(key, value); // key,value自行定义，比如.set('@@', resolve('src/components'))
  },
};
```

### 35.img 加载失败

场景:有些时候后台返回图片地址不一定能打开,所以这个时候应该加一张默认图片

```html
// page 代码
<img :src="imgUrl" @error="handleError" alt="" />
<script>
  export default {
    data() {
      return {
        imgUrl: "",
      };
    },
    methods: {
      handleError(e) {
        e.target.src = reqiure("图片路径"); //当然如果项目配置了transformToRequire,参考上面 27.2
      },
    },
  };
</script>
```

> 原文链接：# [Vue 开发必须知道的 36 个技巧【近 1W 字】](https://segmentfault.com/a/1190000020620972)
