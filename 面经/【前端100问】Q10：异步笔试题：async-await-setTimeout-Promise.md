### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [Q10：异步笔试题：async/await/setTimeout/Promise](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/7)

### 正文回答

题目

```js
//请写出输出内容
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");

/* 答案
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
```

#### 任务队列

- JS 分为同步任务和异步任务
- 同步任务都在主线程上执行，形成一个执行栈
- 主线程之外，事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就在任务队列之中放置一个事件。
- 一旦执行栈中的所有同步任务执行完毕（此时 JS 引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到可执行栈中，开始执行。

![q10-1.png](https://upload-images.jianshu.io/upload_images/12877063-e764b15d0cd9463c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 宏任务

(macro)task（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。

浏览器为了能够使得 JS 内部(macro)task 与 DOM 任务能够有序的执行，会在一个(macro)task 执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染

主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI 交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)

#### 微任务

microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前 task 任务后，下一个 task 之前，在渲染之前。

所以它的响应速度相比 setTimeout（setTimeout 是 task）会更快，因为无需等渲染。也就是说，在某一个 macrotask 执行完后，就会将在它执行期间产生的所有 microtask 都执行完毕（在渲染前）。

microtask 主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)

#### 运行机制

在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下

1. 执行一个宏任务（栈中没有就从事件队列中获取）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4. 当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染
5. 渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

![q10-2.jpg](https://upload-images.jianshu.io/upload_images/12877063-055fff5ac388c6c2.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### Promise 和 async 中的立即执行

我们知道 Promise 中的异步体现在 then 和 catch 中，所以写在 Promise 中的代码是被当做同步任务立即执行的。

#### await 做了什么

await 是一个让出线程的标志。

await 后面的表达式会先执行一遍，将 await 后面的代码加入到 microtask 中，然后就会跳出整个 async 函数来执行后面的代码。

由于因为 async await 本身就是 promise+generator 的语法糖。所以 await 后面的代码是 microtask。

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

// 等价于

async function async1() {
  console.log("async1 start");
  Promise.resolve(async2()).then(() => {
    console.log("async1 end");
  });
}
```

#### 变形题

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  //async2做出如下更改：
  new Promise(function (resolve) {
    console.log("promise1");
    resolve();
  }).then(function () {
    console.log("promise2");
  });
}
console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);
async1();

new Promise(function (resolve) {
  console.log("promise3");
  resolve();
}).then(function () {
  console.log("promise4");
});

console.log("script end");

/*
script start
async1 start
promise1
promise3
script end
promise2
async1 end
promise4
setTimeout
 */
```

```js
async function async1() {
  console.log("async1 start");
  await async2();
  //更改如下：
  setTimeout(function () {
    console.log("setTimeout1");
  }, 0);
}
async function async2() {
  //更改如下：
  setTimeout(function () {
    console.log("setTimeout2");
  }, 0);
}
console.log("script start");

setTimeout(function () {
  console.log("setTimeout3");
}, 0);
async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");

/*
script start
async1 start
promise1
script end
promise2
setTimeout3
setTimeout2
setTimeout1
*/
```

```js
async function a1() {
  console.log("a1 start");
  await a2();
  console.log("a1 end");
}
async function a2() {
  console.log("a2");
}

console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise1");
});

a1();

let promise2 = new Promise((resolve) => {
  resolve("promise2.then");
  console.log("promise2");
});

promise2.then((res) => {
  console.log(res);
  Promise.resolve().then(() => {
    console.log("promise3");
  });
});
console.log("script end");

/*
script start
a1 start
a2
promise2
script end
promise1
a1 end
promise2.then
promise3
setTimeout
*/
```
