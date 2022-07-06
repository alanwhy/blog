### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [介绍下 Promise.all 使用、原理实现及错误处理](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/130)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

##### Promise 概念

Promise 是 JS 异步编程中的重要概念，异步抽象处理对象，是目前比较流行 Javascript 异步编程解决方案之一。Promise.all()接受一个由 promise 任务组成的数组，可以同时处理多个 promise 任务，当所有的任务都执行完成时，Promise.all()返回 resolve，但当有一个失败(reject)，则返回失败的信息，即使其他 promise 执行成功，也会返回失败。和后台的事务类似。和 rxjs 中的 forkJoin 方法类似，合并多个 Observable 对象 ，等到所有的 Observable 都完成后，才一次性返回值。

##### Promise.all 如何使用

```js
// 以下 demo，请求两个 url，当两个异步请求返还结果后，再请求第三个 url
const p1 = request(`http://some.url.1`);
const p2 = request(`http://some.url.2`);
Promise.all([p1, p2])
  .then((datas) => {
    // 此处 datas 为调用 p1, p2 后的结果的数组
    return request(`http://some.url.3?a=${datas[0]}&b=${datas[1]}`);
  })
  .then((data) => {
    console.log(data);
  });
```

##### Promise.all 原理实现

```js
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("argument must be anarray"))
    }
    var countNum = 0;
    var promiseNum = promises.length;
    var resolvedvalue = new Array(promiseNum);
    for (var i = 0; i < promiseNum; i++) {
      (function (i) {
        Promise.resolve(promises[i]).then(function (value) {
          countNum++;
          resolvedvalue[i] = value;
          if (countNum === promiseNum) {
            return resolve(resolvedvalue)
          }
        }, function (reason) {
          return reject(reason)
        )
      })(i)
    }
  })
}

var p1 = Promise.resolve(1),
  p2 = Promise.resolve(2),
  p3 = Promise.resolve(3);
promiseAll([p1, p2, p3]).then(function (value) {
  console.log(value)
})
```

##### Promise.all 错误处理

有时候我们使用 Promise.all()执行很多个网络请求，可能有一个请求出错，但我们并不希望其他的网络请求也返回 reject，要错都错，这样显然是不合理的。如何做才能做到 promise.all 中即使一个 promise 程序 reject，promise.all 依然能把其他数据正确返回呢?

**1、全部改为串行调用（失去了 node 并发优势）**

**2、当 promise 捕获到 error 的时候，代码吃掉这个异常，返回 resolve，约定特殊格式表示这个调用成功了**

```js
var p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 0);
});
var p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(2);
  }, 200);
});
var p3 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    try {
      console.log(XX.BBB);
    } catch (exp) {
      resolve("error");
    }
  }, 100);
});
Promise.all([p1, p2, p3])
  .then(function (results) {
    console.log("success");
    console.log(results);
  })
  .catch(function (r) {
    console.log("err");
    console.log(r);
  });
```

##### 说 all 体验不好，那我们也可以自己做一个 some 方法，表示全部失败才算失败

```js
Promise.some = function (promiseArrs) {
  return new Promise((resolve, reject) => {
    let arr = []; //定义一个空数组存放结果
    let i = 0;
    function handleErr(index, err) {
      //处理错误函数
      arr[index] = err;
      i++;
      if (i === promiseArrs.length) {
        //当i等于传递的数组的长度时
        reject(err); //执行reject,并将结果放入
      }
    }
    for (let i = 0; i < promiseArrs.length; i++) {
      //循环遍历数组
      promiseArrs[i].then(resolve, (e) => handleErr(i, e));
    }
  });
};
```
