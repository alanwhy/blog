### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [['1', '2', '3'].map(parseInt) what & why ?](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/4)

### 正文回答

#### 回顾一下，map 函数的第一个参数 callback

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array
}[, thisArg])
```

这个 callback 一共可以接收三个参数

第一个参数 `currentValue` 代表【当前被处理的元素】

第二个参数 `index` 代表【该元素的索引】

第三个参数 `array`【调用的数组】

```js
const arr = [1, 2, 3];
arr.map((num) => num + 1); // [2, 3, 4]
```

#### `parseInt` 则是用来解析字符串的，使字符串成为指定基数的整数

`parseInt(string, radix)` 接收两个参数

第一个表示【被处理的值（字符串）】

第二个表示为【解析时的基数】

```js
parseInt(100); // 100
parseInt(100, 10); // 100
parseInt(100, 2); // 4 -> 将以2为基数的100转换为以10为基数的值
```

在 `radix` 为 `undefined`，或者 `radix` 为 `0` 或者没有指定的情况下，JavaScript 作如下处理：

- 如果字符串 `string` 以"0x"或者"0X"开头, 则基数是 16 (16 进制).
- 如果字符串 `string` 以"0"开头, 基数是 8（八进制）或者 10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用 10，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出 `radix` 参数的值。
- 如果字符串 `string` 以其它任何值开头，则基数是 10 (十进制)。
- 该值介于 2 ~ 36 之间

#### 解析题目

实际执行的代码：

```js
["1", "2", "3"].map((item, index) => {
  return parseInt(item, index);
});
```

```js
parseInt("1", 0); // 1
parseInt("2", 1); // NaN
parseInt("3", 2); // NaN, 3 不是二进制
```

#### 对函数解析的 MSN 的说明链接

详见[Array.prototype.map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

详见[parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)

#### 题目变形

```js
let unary = (fn) => (val) => fn(val);
let parse = unary(parseInt);
console.log(["1.1", "2", "0.3"].map(parse));
//[1, 2, 0]
```

```js
["10", "10", "10", "10", "10"].map(parseInt);
// [10, NaN, 2, 3, 4]
```

```js
["10", "10", "10", "10", "10"].map(Number);
// [10, 10, 10, 10, 10]
```

```js
["1", "2", "3"].map((n) => parseInt(n, 10));
// [1, 2, 3]
```
