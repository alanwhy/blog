### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [聊聊 Redux 和 Vuex 的设计思想](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/45)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

### 正文回答

在软件开发里，有些通用的思想，比如隔离变化，约定优于配置等，隔离变化就是说做好抽象，把一些容易变化的地方找到共性，隔离出来，不要去影响其他的代码。约定优于配置就是很多东西我们不一定要写一大堆的配置，比如我们几个人约定，view 文件夹里只能放视图，不能放过滤器，过滤器必须放到 filter 文件夹里，那这就是一种约定，约定好之后，我们就不用写一大堆配置文件了，我们要找所有的视图，直接从 view 文件夹里找就行。

根据这些思想，对于状态管理的解决思路就是：把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测。

#### Store 模式

最简单的处理就是把状态存到一个外部变量里面，比如：`this.$root.$data`，当然也可以是一个全局变量。但是这样有一个问题，就是数据改变后，不会留下变更过的记录，这样不利于调试

所以我们稍微搞得复杂一点，用一个简单的 Store 模式

```js
var store = {
  state: {
    message: "Hello!",
  },
  setMessageAction(newValue) {
    // 发生改变记录点日志啥的
    this.state.message = newValue;
  },
  clearMessageAction() {
    this.state.message = "";
  },
};
```

store 的 state 来存数据，store 里面有一堆的 action，这些 action 来控制 state 的改变，也就是不直接去对 state 做改变，而是通过 action 来改变，因为都走 action，我们就可以知道到底改变（mutation）是如何被触发的，出现错误，也可以记录记录日志啥的

不过这里没有限制组件里面不能修改 store 里面的 state，万一组件瞎胡修改，不通过 action，那我们也没法跟踪这些修改是怎么发生的。所以就需要规定一下，组件不允许直接修改属于 store 实例的 state，组件必须通过 action 来改变 state，也就是说，组件里面应该执行 action 来分发 (dispatch) 事件通知 store 去改变。这样约定的好处是，我们能够记录所有 store 中发生的 state 改变，同时实现能做到记录变更 (mutation)、保存状态快照、历史回滚/时光旅行的先进的调试工具。

#### vuex

我的主要技术栈是 vuex，所以这里就写写 vuex，其他的参考[Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)

##### Store

每一个 Vuex 里面有一个全局的 Store，包含着应用中的状态 State，这个 State 只是需要在组件中共享的数据，不用放所有的 State，没必要。这个 State 是单一的，和 Redux 类似，所以，一个应用仅会包含一个 Store 实例。单一状态树的好处是能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

Vuex 通过 store 选项，把 state 注入到了整个应用中，这样子组件能通过 `this.$store` 访问到 state 了。

```js
const app = new Vue({
  el: "#app",
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `,
});
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
```

State 改变，View 就会跟着改变，这个改变利用的是 Vue 的响应式机制。

##### Mutation

显而易见，State 不能直接改，需要通过一个约定的方式，这个方式在 Vuex 里面叫做 mutation，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。

```js
const store = new Vuex.Store({
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    },
  },
});
```

**注意：mutation 都是同步事务**。

总的来说都是让 View 通过某种方式触发 Store 的事件或方法，Store 的事件或方法对 State 进行修改或返回一个新的 State，State 改变之后，View 发生响应式改变

##### Action

到这里又该处理异步这块儿了。mutation 是必须同步的，这个很好理解，和之前的 reducer 类似，不同步修改的话，会很难调试，不知道改变什么时候发生，也很难确定先后顺序，A、B 两个 mutation，调用顺序可能是 A -> B，但是最终改变 State 的结果可能是 B -> A。

对比 Redux 的中间件，Vuex 加入了 Action 这个东西来处理异步，Vuex 的想法是把同步和异步拆分开，异步操作想咋搞咋搞，但是不要干扰了同步操作。View 通过 store.dispatch('increment') 来触发某个 Action，Action 里面不管执行多少异步操作，完事之后都通过 store.commit('increment') 来触发 mutation，一个 Action 里面可以触发多个 mutation。所以 Vuex 的 Action 类似于一个灵活好用的中间件。

Vuex 把同步和异步操作通过 mutation 和 Action 来分开处理，是一种方式。但不代表是唯一的方式，还有很多方式，比如就不用 Action，而是在应用内部调用异步请求，请求完毕直接 commit mutation，当然也可以。

Vuex 还引入了 Getter，这个可有可无，只不过是方便计算属性的复用。

Vuex 单一状态树并不影响模块化，把 State 拆了，最后组合在一起就行。Vuex 引入了 Module 的概念，每个 Module 有自己的 state、mutation、action、getter，其实就是把一个大的 Store 拆开。

总的来看，Vuex 的方式比较清晰，适合 Vue 的思想，在实际开发中也比较方便。

##### 对比 Redux

Redux： view——>actions——>reducer——>state 变化——>view 变化（同步异步一样）

Vuex：

- view——>commit——>mutations——>state 变化——>view 变化（同步操作）
- view——>dispatch——>actions——>mutations——>state 变化——>view 变化（异步操作）
