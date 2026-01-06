### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [setTimeout、Promise、Async/Await 的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/33)

### 正文回答

事件循环中分为宏任务队列和微任务队列

`setTimeout` 的回调函数放到宏任务队列里，等到执行栈清空以后执行

`promise.then` 里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行

`async` 函数表示函数里面可能会有异步方法，`await` 后面跟一个表达式，`async` 方法执行时，遇到 `await` 会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行

#### 一些例子

```js
console.log("script start"); //1. 打印 script start
setTimeout(function () {
  console.log("settimeout"); // 4. 打印 settimeout
}); // 2. 调用 setTimeout 函数，并定义其完成后执行的回调函数
console.log("script end"); //3. 打印 script start
// 输出顺序：script start->script end->settimeout
```

```js
console.log("script start");

let promise1 = new Promise(function (resolve) {
  console.log("promise1");
  resolve();
  console.log("promise1 end");
}).then(function () {
  console.log("promise2");
});

setTimeout(function () {
  console.log("settimeout");
});

console.log("script end");
// 输出顺序: script start->promise1->promise1 end->script end->promise2->settimeout
```

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}

console.log("script start");
async1();
console.log("script end");

// 输出顺序：script start->async1 start->async2->script end->async1 end
```
