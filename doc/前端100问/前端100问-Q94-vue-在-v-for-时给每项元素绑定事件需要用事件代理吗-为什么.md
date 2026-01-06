### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [vue 在 v-for 时给每项元素绑定事件需要用事件代理吗？为什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/145)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

首先我们需要知道事件代理主要有什么作用？

- 事件代理能够避免我们逐个的去给元素新增和删除事件
- 事件代理比每一个元素都绑定一个事件性能要更好

事件代理作用主要是 2 个

1. 将事件处理程序代理到父节点，减少内存占用率
2. 动态生成子节点时能自动绑定事件处理程序到父节点

这里我生成了十万个 `span` 节点，通过 performance monitor 来监控内存占用率和事件监听器的数量，对比以下 3 种情况

```html
<!-- 1. 不使用事件代理，每个 span 节点绑定一个 click 事件，并指向同一个事件处理程序 -->
<div>
  <span v-for="(item,index) of 100000" :key="index" @click="handleClick">
    {{item}}
  </span>
</div>

<!-- 2. 不使用事件代理，每个 span 节点绑定一个 click 事件，并指向不同的事件处理程序 -->
<div>
  <span v-for="(item,index) of 100000" :key="index" @click="function () {}">
    {{item}}
  </span>
</div>

<!-- 3. 使用事件代理 -->
<div @click="handleClick">
  <span v-for="(item,index) of 100000" :key="index"> {{item}} </span>
</div>
```

使用事件代理无论是监听器数量和内存占用率都比前两者要少

同时对比 3 个图中监听器的数量以及我以往阅读 vue 源码的过程中，并没有发现 vue 会自动做事件代理，但是一般给 `v-for` 绑定事件时，都会让节点指向同一个事件处理程序（第二种情况可以运行，但是 eslint 会警告），一定程度上比每生成一个节点都绑定一个不同的事件处理程序性能好，但是监听器的数量仍不会变，所以使用事件代理会更好一点

##### 从 vue 的角度上来看上面两点

- 在 `v-for` 中，我们直接用一个 `for` 循环就能在模板中将每个元素都绑定上事件，并且当组件销毁时，vue 也会自动给我们将所有的事件处理器都移除掉。所以事件代理能做到的第一点 vue 已经给我们做到了
- 在 `v-for` 中，给元素绑定的都是相同的事件，所以除非上千行的元素需要加上事件，其实和使用事件代理的性能差别不大，所以也没必要用事件代理

[vue 源码没有做过事件代理](https://forum.vuejs.org/t/is-event-delegation-necessary/3701/2)
