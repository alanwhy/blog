# 常用开发小技巧

### 写在前面

### JavaScript 篇

1.格式化金钱

```js
const ThousandNum = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const money = ThousandNum(20190214);
// money => "20,190,214"
```

2.取整

代替正数的 `Math.floor()`，代替负数的 `Math.ceil()`

```js
const num1 = ~~1.69;
const num2 = 1.69 | 0;
const num3 = 1.69 >> 0;
// num1 num2 num3 => 1 1 1
```

3.转数值

只对 `null` 、`""` 、`false` 、`数值字符串` 有效

```js
const num1 = +null;
const num2 = +"";
const num3 = +false;
const num4 = +"169";
// num1 num2 num3 num4 => 0 0 0 169
```

4.精确小数

```js
const RoundNum = (num, decimal) => Math.round(num * 10 ** decimal) / 10 ** decimal;
const num = RoundNum(1.69, 1);
// num => 1.7
```

5.取最小最大值

```js
const arr = [0, 1, 2];
const min = Math.min(...arr);
const max = Math.max(...arr);
// min max => 0 2
```

6.判断数据类型

```js
function DataType(tgt, type) {
  const dataType = Object.prototype.toString
    .call(tgt)
    .replace(/\[object (\w+)\]/, "$1")
    .toLowerCase();
  return type ? dataType === type : dataType;
}
DataType("young"); // "string"
DataType(20190214); // "number"
DataType(true); // "boolean"
DataType([], "array"); // true
DataType({}, "array"); // false
```

7.是否为空对象

```js
const obj = {};
const flag = DataType(obj, "object") && !Object.keys(obj).length;
// flag => true
```

8.克隆数组

```js
const _arr = [0, 1, 2];
const arr = [..._arr];
// arr => [0, 1, 2]
```

9.合并数组

```js
const arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];
const arr = [...arr1, ...arr2];
// arr => [0, 1, 2, 3, 4, 5];
```

10.去重数组

```js
const arr = [...new Set([0, 1, 1, null, null])];
// arr => [0, 1, null]
```

11.截断数组

```js
const arr = [0, 1, 2];
arr.length = 2;
// arr => [0, 1]
```

12.交换赋值

```js
let a = 0;
let b = 1;
[a, b] = [b, a];
// a b => 1 0
```

13.创建指定长度且值相等的数组

```javascript
const arr = new Array(3).fill(0);
// arr => [0, 0, 0]
```

14.克隆对象

```javascript
const _obj = { a: 0, b: 1, c: 2 }; // 以下方法任选一种
const obj = { ..._obj };
const obj = JSON.parse(JSON.stringify(_obj));
// obj => { a: 0, b: 1, c: 2 }
```

15.合并对象

```js
const obj1 = { a: 0, b: 1, c: 2 };
const obj2 = { c: 3, d: 4, e: 5 };
const obj = { ...obj1, ...obj2 };
// obj => { a: 0, b: 1, c: 3, d: 4, e: 5 }
```

16.创建纯空对象

```javascript
const obj = Object.create(null);
Object.prototype.a = 0;
// obj => {}
```

17.优雅处理 Async/Await 参数

```js
function AsyncTo(promise) {
  return promise.then((data) => [null, data]).catch((err) => [err]);
}
const [err, res] = await AsyncTo(Func());
```

### Vue 篇

1.路由懒加载

```js
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      component: () => import("xxx"),
    },
  ],
});
```

2.页面需要导入多个组件

原来的写法

```js
import titleCom from "@/components/home/titleCom";
import bannerCom from "@/components/home/bannerCom";
import cellCom from "@/components/home/cellCom";
components: {
  titleCom, bannerCom, cellCom;
}
```

利用 require.context 可以写成

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

API 说明

> 实际上是 webpack 的方法,vue 工程一般基于 webpack,所以可以使用
> `require.context(directory,useSubdirectories,regExp)` > <br/>接收三个参数:
> <br/>`directory`：说明需要检索的目录
> <br/>`useSubdirectories`：是否检索子目录
> <br/>`regExp`: 匹配文件的正则表达式,一般是文件名

3.动态组件

做一个 tab 切换时就会涉及到组件动态加载

```html
<component v-bind:is="currentTabComponent"></component>
```

但是这样每次组件都会重新加载,会消耗大量性能,所以 `<keep-alive>` 就起到了作用

```html
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

这样切换效果没有动画效果,这个也不用着急,可以利用内置的 `<transition>`

```html
<transition>
  <keep-alive>
    <component v-bind:is="currentTabComponent"></component>
  </keep-alive>
</transition>
```

4.mixins

有些组件有些重复的 js 逻辑,如校验手机验证码,解析时间等,mixins 就可以实现这种混入

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

5.为路径设置别名

在开发过程中，我们经常需要引入各种文件，如图片、CSS、JS 等，为了避免写很长的相对路径（../），我们可以为不同的目录配置一个别名

```js
// vue-cli 2.x 配置
// 在 webpack.base.config.js中的 resolve 配置项，在其 alias 中增加别名
resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },

// vue-cli 3.x 配置
// 在根目录下创建vue.config.js
var path = require('path')
function resolve (dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set(key, value) // key,value自行定义，比如.set('@@', resolve('src/components'))
  }
}
```

6.img 加载失败

有些时候后台返回图片地址不一定能打开,所以这个时候应该加一张默认图片

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
        e.target.src = reqiure("图片路径");
      },
    },
  };
</script>
```

7.页面统一判断

在开发中经常会遇到权限判断的问题，我们又不可能在每一个页面的生命周期中去判断一下，那样太消耗时间了，处理方式：

```js
router.beforeEach((to, from, next) => {
  myAccess.checkhaveAccess(to.path) === true ? next() : next("/forbid");
});
```

8.路由的项目启动页和 404 页面

404 页面指的是: 当进入一个没有 声明/没有匹配 的路由页面时就会跳转到 404 页面

```js
export default new Router({
  routes: [
    {
      path: "/", // 项目启动页
      redirect: "/login", // 重定向到下方声明的路由
    },
    {
      path: "*", // 404 页面
      component: () => import("./notfind"),
    },
  ],
});
```

### CSS 篇

1.使用 text-align-last 对齐两端文本

[在线演示](https://codepen.io/JowayYoung/pen/ZgxZJa)

```html
<div class="bruce flex-ct-x">
  <ul class="justify-text">
    <li>账号</li>
    <li>密码</li>
    <li>电子邮件</li>
    <li>通讯地址</li>
  </ul>
</div>

.justify-text { li { margin-top: 5px; padding: 0 20px; width: 100px; height: 40px; background-color: #f66; line-height:
40px; text-align-last: justify; color: #fff; &:first-child { margin-top: 0; } } }
```

2.使用 color 改变边框颜色

`border` 没有定义 `border-color` 时，设置 `color` 后，`border-color` 会被定义成 `color`

场景：边框颜色与文字颜色相同

```css
.elem {
  border: 1px solid;
  color: #f66;
}
```

3.黑白图像

让你的彩色照片显示黑白照片

```css
img.desaturate {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
}
```

4.将图片作为背景

当给页面添加图片时，尤其需要图片是响应式的时候，最好使用 background 属性来引入图片，而不是 `<img>` 标签

这看起来使用图片会更复杂，但实际上它会使设置图片的样式变得更加容易。有了 `background-size`, `background-position` 和其它的属性，保持或改变图片原始尺寸和宽高比会更方便

`background` 引入图片的一个缺点是页面的 Web 可访问性会受到轻微的影响，因为屏幕阅读器和搜索引擎无法正确地获取到图像。这个问题可以通过 CSS `object-fit` 属性解决，到目前为止除了 IE 浏览器其他的浏览器都可以使用 `object-fit`。

```html
<section>
  <p>Img element</p>
  <img src="https://tutorialzine.com/media/2016/08/bicycle.jpg" alt="bicycle" />
</section>

<section>
  <p>Div with background image</p>
  <div></div>
</section>
```

```css
img {
  width: 300px;
  height: 200px;
}

div {
  width: 300px;
  height: 200px;
  background: url("https://tutorialzine.com/media/2016/08/bicycle.jpg");
  background-position: center center;
  background-size: cover;
}

section {
  float: left;
  margin: 15px;
}
```

5.保持选择器的低权重

css 的选择器并不都是平等的。当初学习 CSS 时，我总是认为选择器会覆盖它上面的所有内容。然而，情况并非如此

```html
<a href="#" id="blue-btn" class="active">按钮</a>

a{ color: #fff; padding: 15px; } a#blue-btn { background-color: blue; } a.active { background-color: red; }
```

我们希望.active 类中设置的样式会生效使按钮变为红色。但是它并不会起作用，因为按钮在上面有一个 ID 选择器，它同样设置了 background-color，ID 选择器具有更高的权重，所以按钮的颜色是蓝色的

权重也会叠加，于是 a#button.active 的权重要比 a#button 的高。一开始就使用高权重的选择器会导致你在后面的维护中不断的使用更高权重的选择器

6.使用 rem 进行全局大小调整；使用 em 进行局部大小调整

在设置根目录的基本字体大小后，例如 html 字体大小：15px；，可以将包含元素的字体大小设置为 rem

```css
article {
  font-size: 1.25rem;
}
aside {
  font-size: 0.9rem;
}
```

将文本元素的字体大小设置为 em

```css
h2 {
  font-size: 2em;
}
p {
  font-size: 1em;
}
```

### 参考链接

[灵活运用 JS 开发技巧](https://segmentfault.com/a/1190000020749133)

[灵活运用 CSS 开发技巧](https://segmentfault.com/a/1190000020899202)

[我在 vue 开发中的小技巧](https://www.jianshu.com/p/baedcedc3191)

[如何提升你的 CSS 技能，掌握这 20 个 css 技巧即可[完整版]](http://www.imooc.com/article/283531)
