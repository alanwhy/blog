### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [Async/Await 如何通过同步的方式实现异步](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/156)

### 正文回答

`Async`/`Await` 就是一个自执行的 `generate` 函数。利用 `generate` 函数的特性把异步的代码写成“同步”的形式。

```js
var fetch = require("node-fetch");

function* gen() {
  // 这里的*可以看成 async
  var url = "https://api.github.com/users/github";
  var result = yield fetch(url); // 这里的yield可以看成 await
  console.log(result.bio);
}
```

```js
var g = gen();
var result = g.next();

result.value
  .then(function (data) {
    return data.json();
  })
  .then(function (data) {
    g.next(data);
  });
```
