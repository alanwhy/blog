### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [为什么普通 `for` 循环的性能远远高于 `forEach` 的性能，请解释其中的原因。](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/118)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

- for 循环没有任何额外的函数调用栈和上下文；
- forEach 函数签名实际上是`array.forEach(function(currentValue, index, arr), thisValue)`

它不是普通的 `for` 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

我之前用浏览器的做的实验，现在改为 node 发现了不一样的结果

```js
let arrs = new Array(100000);

console.time("for");
for (let i = 0; i < arrs.length; i++) {}
console.timeEnd("for");

console.time("forEach");
arrs.forEach((arr) => {});
console.timeEnd("forEach");
```

- for: 2.263ms
- forEach: 0.254ms

在 10 万这个级别下， forEach 的性能是 for 的十倍

- for: 2.263ms
- forEach: 0.254ms

在 100 万这个量级下， forEach 的性能是和 for 的一致

- for: 2.844ms
- forEach: 2.652ms

在 1000 万级以上的量级上 ， forEach 的性能远远低于 for 的性能

- for: 8.422ms
- forEach: 30.328m
