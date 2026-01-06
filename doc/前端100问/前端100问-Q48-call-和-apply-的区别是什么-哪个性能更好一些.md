### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [call 和 apply 的区别是什么，哪个性能更好一些](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/84)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

1. `Function.prototype.apply` 和 `Function.prototype.call` 的作用是一样的，区别在于传入参数的不同；
2. 第一个参数都是，指定函数体内 `this` 的指向；
3. 第二个参数开始不同，`apply` 是传入带下标的集合，数组或者类数组，`apply` 把它传给函数作为参数，`call` 从第二个开始传入的参数是不固定的，都会传给函数作为参数。

##### 性能上来说

`call` 比 `apply` 的性能要好，`call` 传入参数的格式正是内部所需要的格式。`apply` 多了 `CreateListFromArrayLike` 的调用，其他的操作几乎是一样的

尤其是 es6 引入了 Spread operator (延展操作符) 后，即使参数是数组，可以使用 call

```js
let params = [1, 2, 3, 4];
xx.call(obj, ...params);
```

然而这玩意要是被 babel 或者 ts 过了一遍变成 es5 全都变成了 `xxx.call.apply(obj, params)`

但是其实基于最新的浏览器引擎差别不大，只是适用于不同的开发场景罢了
