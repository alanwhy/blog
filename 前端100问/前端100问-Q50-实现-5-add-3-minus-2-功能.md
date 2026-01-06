### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [实现 (5).add(3).minus(2) 功能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/88)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```js
Number.prototype.add = function (value) {
  let number = parseFloat(value);
  if (typeof number !== "number" || Number.isNaN(number)) {
    throw new Error("请输入数字或者数字字符串～");
  }
  return this + number;
};
Number.prototype.minus = function (value) {
  let number = parseFloat(value);
  if (typeof number !== "number" || Number.isNaN(number)) {
    throw new Error("请输入数字或者数字字符串～");
  }
  return this - number;
};
console.log((5).add(3).minus(2));
```
