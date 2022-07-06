###1、对 MVVM 开发模式的理解
MVVM 分为 Model、View、ViewModel 三者。

- Model 代表数据模型，数据和业务逻辑都在 Model 层中定义；
- View 代表 UI 视图，负责数据的展示；
- ViewModel 负责监听 Model 中数据的改变并且控制视图的更新，处理用户交互操作；

Model 和 View 并无直接关联，而是通过 ViewModel 来进行联系的，Model 和 ViewModel 之间有着双向数据绑定的联系。

这种模式实现了 Model 和 View 的数据自动同步，因此开发者只需要专注对数据的维护操作即可，而不需要自己操作 dom。

###2、vue 有哪些常见的指令？

- v-html
- v-show
- v-if
- v-on
- v-for
- 等等

###3、v-if 和 v-show 有什么区别？
v-show 仅仅控制元素的显示方式，将 display 属性在 block 和 none 来回切换；当我们需要经常切换某个元素的显示/隐藏时，使用 v-show 会更加节省性能上的开销；

而 v-if 会控制这个 DOM 节点的存在与否。当只需要一次显示或隐藏时，使用 v-if 更加合理。

###4、简述 vue 的响应式原理
当一个 Vue 实例创建时，vue 会遍历 data 选项的属性，用 `Object.defineProperty` 将它们转为 `getter`/`setter`并且在内部追踪相关依赖，在属性被访问和修改时通知变化。

每个组件实例都有相应的 `watcher` 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。
![image.png](https://upload-images.jianshu.io/upload_images/12877063-03204aa3aafe3f38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###5、vue 中如何在组件间进行通信？
父组件通过 props 传值给子组件，子组件通过 $emit 来通知父组件修改相应的 props 值

在父组件中做了两件事，一是给子组件传入 props，二是监听 input 事件并同步自己的 value 属性。v-model 实际上会帮我们完成上面的两步操作。

###6、vue 如何监控某个属性值的变化？
Vue 中监控对象属性的变化你可以这样：

```
watch: {
      obj: {
      handler (newValue, oldValue) {
        console.log('obj changed')
      },
      deep: true // deep属性表示深层遍历
    }
  }
```

```
// 监控data中，obj.a 的变化
watch: {
   'obj.a': {
      handler (newName, oldName) {
        console.log('obj.a changed')
      }
   }
  }
```

也可以通过 computed 来实现：

```
// 利用计算属性的特性来实现
// 当依赖改变时，便会重新计算一个新值
computed: {
    a1 () {
      return this.obj.a
    }
}
```

###7、vue 中给 data 中的对象属性添加一个新的属性时会发生什么，如何解决？
会发生属性添加成功，但是视图并未刷新的现象
原因：在 Vue 实例创建时，新添加的变量并未声明，因此就没有被 Vue 转换为响应式的属性，自然就不会触发视图的更新，这时就需要使用 Vue 的全局 api `$set()`

```
this.$set(this.obj, 'b', 'obj.b')
console.log(this.obj)
```

`$set()`方法相当于手动的去把新添加的对象处理成一个响应式的属性，此时视图也会跟着改变

###8、delete 和 vue.delete 删除数组的区别

- delete 只是被删除的元素变成了 empty/undefined 其他的元素的键值还是不变。
- Vue.delete 或者说是 this.$delete：直接删除了数组 改变了数组的键值。

```
    var a=[1,2,3,4]
    var b=[1,2,3,4]
    delete a[1]
    console.log(a)
    this.$delete(b,1)
    console.log(b)
// [1, empty, 3, 4]
// [1, 3, 4]
```

###9、如何优化 SPA 应用的首屏加载速度漫的问题？

- 将公用的 JS 库通过 script 标签外部引入，减小 app.bundel 的大小，让浏览器并行下载资源文件，提高下载速度
- 在配置路由时，页面和组件使用懒加载的方式引入，进一步缩小 app.bundel 的体积，在调用某个组件时再加载对应的 js 文件
- 加一个首屏 loading 图，提升用户体验

###10、前端如何优化网站性能？ #####减少 HTTP 请求数量
在浏览器与服务器进行通信时，主要是通过 HTTP 进行通信。
浏览器与服务器需要经过三次握手，每次握手需要花费大量时间。
而且不同浏览器对资源文件并发请求数量有限（不同浏览器允许的并发数不同），一旦 HTTP 请求数量达到一定数量，资源请求就存在等待状态
解决方法

- CSS Sprites：国内俗称 CSS 精灵，这是将多张图片合并成一张图片达到减少 HTTP 请求的一种解决方案，可以通过 CSS background 属性来访问图片内容。这种方案同时还可以减少图片总字节数。
- 合并 CSS 和 JS 文件：现在前端有很多工程化打包工具，如：grunt、gulp、webpack 等。
- 采用 lazyLoad：俗称懒加载，可以控制网页上的内容在一开始无需加载，不需要发请求，等到用户操作真正需要的时候立即加载出内容。 #####控制资源文件加载优先级
  浏览器在加载 HTML 内容时，是将 HTML 内容从上至下依次解析，解析到 link 或者 script 标签就会加载 href 或者 src 对应链接内容，为了第一时间展示页面给用户，就需要将 CSS 提前加载，不要受 JS 加载影响。
  一般情况下都是 CSS 在头部，JS 在底部。
  解决方法：
- 利用浏览器缓存
- 减少重排（Reflow）：重排是 DOM 的变化影响到了元素的几何属性（宽和高），浏览器会重新计算元素的几何属性，会使渲染树中受到影响的部分失效，浏览器会验证 DOM 树上的所有其它结点的 visibility 属性，这也是 Reflow 低效的原因。如果 Reflow 的过于频繁，CPU 使用率就会急剧上升。尽量使用 增加 class 属性，而不是通过 style 操作样式
- 图标使用 IconFont 替换

###11、网页从输入网址到渲染完成经历了哪些过程？

- 输入网址
- 发送到 DNS 服务器，并获取域名对应的 web 服务器对应的 ip 地址
- 与 web 服务器建立 TCP 连接
- 浏览器向 web 服务器发送 http 请求
- web 服务器响应请求，并返回指定 url 的数据（或错误信息，或重定向的新的 url 地址）
- 浏览器下载 web 服务器返回的数据及解析 html 源文件
- 生成 DOM 树，解析 css 和 js，渲染页面，直至显示完成

###12、jQuery 获取的 dom 对象和原生的 dom 对象有何区别？
js 原生获取的 dom 是一个对象
jQuery 对象就是一个数组对象，其实就是选择出来的元素的数组集合

原生 DOM 对象转 jQuery 对象：

```
var box = document.getElementById('box');
var $box = $(box);
```

jQuery 对象转原生 DOM 对象

```
var $box = $('#box');
var box = $box[0];
```

###13、jQuery 如何扩展自定义方法

```
(jQuery.fn.myMethod=function () {
       alert('myMethod');
})
```

或者

```
(function ($) {
        $.fn.extend({
             myMethod : function () {
                  alert('myMethod');
             }
        })
})(jQuery)
```

使用方式：

```
$("#div").myMethod();
```

> 参考原文： [2019 前端面试题汇总（主要为 Vue）](https://segmentfault.com/a/1190000018225708)
