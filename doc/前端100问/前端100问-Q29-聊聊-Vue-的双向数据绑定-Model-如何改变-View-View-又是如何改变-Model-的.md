### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/34)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

### 正文回答

#### 比较清楚的回答

始终感觉这个问题有点问题，明明是单向绑定，只是 m -> v，在 vue 2.x 中 通过 `defineProperty` 实现的数据劫持，`getter` 收集依赖，`setter` 调用更新回调，这个过程是 vue 黑盒提供的，也就是说数据驱动视图，开发人员只需关注数据的变更即可；再说 v -> m，通过 `v-model` 的方式，指令添加是开发人员加的吧，如果一个组件有多个 `v-model` ，你要自己写 `v-on` 和 `data` 的修改吧。
