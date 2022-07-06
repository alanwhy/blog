### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/19)

### 正文回答

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});

promise.then(() => {
  console.log(3);
});

console.log(4);
```

执行结果是：1243
promise 构造函数是同步执行的，then 方法是异步执行的

Promise new 的时候会立即执行里面的代码 then 是微任务 会在本次任务执行完的时候执行 setTimeout 是宏任务 会在下次任务执行的时候执行

#### 一些扩展

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve(5);
  console.log(2);
}).then((val) => {
  console.log(val);
});

promise.then(() => {
  console.log(3);
});

console.log(4);

setTimeout(function () {
  console.log(6);
});

// 124536
```
