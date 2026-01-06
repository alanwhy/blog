### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [实现一个 sleep 函数，比如 sleep(1000) 意味着等待 1000 毫秒，可从 Promise、Generator、Async/Await 等角度实现](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```js
// Promise
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

sleep(1000).then(() => {
  // do something
});

async function sleepAsync() {
  console.log("fuck the code");
  await sleep(1000);
  console.log("fuck the code again");
}

sleepAsync();
```

```js
// Generator
function* sleepGenerator(time) {
  yield new Promise(function (resolve, reject) {
    setTimeout(resolve, time);
  });
}
sleepGenerator(1000)
  .next()
  .value.then(() => {
    console.log(1);
  });
```

```js
// ES5
function sleep(callback, time) {
  if (typeof callback === "function") setTimeout(callback, time);
}

function output() {
  console.log(1);
}
sleep(output, 1000);
```
