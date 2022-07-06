> 上一篇链接：[vue的一些基础知识（涉及面试题）](https://www.jianshu.com/p/6d30aea77cf2)
###1.解释单向数据流和双向数据绑定
**单向数据流**： 顾名思义，数据流是单向的。数据流动方向可以跟踪，流动单一，追查问题的时候可以更快捷。缺点就是写起来不太方便。要使UI发生变更就必须创建各种 action 来维护对应的 state
**双向数据绑定**：数据之间是相通的，将数据变更的操作隐藏在框架内部。优点是在表单交互较多的场景下，会简化大量与业务无关的代码。缺点就是无法追踪局部状态的变化，增加了出错时 debug 的难度
###2.`$route`和`$router`的区别
`$router` 为 VueRouter 实例，想要导航到不同 URL，则使用 $router.push 方法

`$route` 为当前 router 跳转对象里面可以获取 name 、 path 、 query 、 params 等
###3.`$nextTick` 是做什么的
`$nextTick` 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM

###4.Vue 组件 data 为什么必须是函数
因为js本身的特性带来的，如果 data 是一个对象，那么由于对象本身属于引用类型，当我们修改其中的一个属性时，会影响到所有Vue实例的数据。
如果将 data 作为一个函数返回一个对象，那么每一个实例的 data 属性都是独立的，不会相互影响了
###5.计算属性computed 和事件 methods 有什么区别
我们可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的
不同点
- computed： 计算属性是基于它们的依赖进行缓存的,只有在它的相关依赖发生改变时才会重新求值
- method ：只要发生重新渲染，method 调用总会执行该函数
###6.Vue 中怎么自定义指令
```
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```
```
// 局部注册
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```
###7.对 keep-alive 的了解
keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染
```
<keep-alive>
  <component>
    <!-- 该组件将被缓存！ -->
  </component>
</keep-alive>
```
###8.Vue 中 key 的作用
key 的特殊属性主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。
如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试修复/再利用相同类型元素的算法。
使用 key，它会基于 key 的变化重新排列元素顺序，并且会移除 key 不存在的元素。
有相同父元素的子元素必须有独特的 key。重复的 key 会造成渲染错误
###9.Vue 的核心是什么
数据驱动 组件系统
###10.vue-router 使用params与query传参有什么区别
```
// 传递
this.$router.push({path: './xxx', params: {xx:xxx}})
this.$router.push({path: './xxx', query: {xx:xxx}})

// 接收
this.$route.params
this.$route.query
```
- params 是路由的一部分,必须要有。不设置的时候，刷新页面或者返回参数会丢
- query 是拼接在 url 后面的参数，没有也没关系。不设置的时候，不会有什么影响
> 原文链接：# [前端面试题 -- Vue](https://segmentfault.com/a/1190000018634744)
