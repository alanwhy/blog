### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

1. 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象（定义时所在的作用域中的 `this`值，因为 JS 的静态作用域的机制，`this` 相当于一个普通变量会向作用域链中查询结果，同时定义时所在对象也并不等于所在对象中的 `this` 值。）。
2. 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替。
3. 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数。
4. 不可以使用 `new` 命令，因为：

- 没有自己的 `this`，无法调用 `call`，`apply`。
- 没有 `prototype` 属性 ，而 `new` 命令在执行时需要将构造函数的 `prototype` 赋值给新的对象的 `__proto__`

new 过程大致是这样的：

```js
function newFunc(father, ...rest) {
  var result = {};
  result.__proto__ = father.prototype;
  var result2 = father.apply(result, rest);
  if (
    (typeof result2 === "object" || typeof result2 === "function") &&
    result2 !== null
  ) {
    return result2;
  }
  return result;
}
```
