```
// 方法1
Function.prototype.call2 = function (context) {
  // 因为传进来的context有可能是null
  var context = context || window
  context.fn = this
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    // 不这么做的话 字符串的引号会被自动去掉 变成了变量 导致报错
    args.push(`arguments[${i}]`)
  }
  args = args.join(",")

  // 相当于执行了context.fn(arguments[1], arguments[2]);
  var result = eval(`context.fn(${args})`)

  delete context.fn
  // 因为有可能this函数会有返回值return
  return result
}

// 方法2
Function.prototype.call3 = function (context, ...args) {
  // 因为传进来的 context 有可能是 null
  context = context || window
  // Function.prototype this 为当前运行的函数
  // 让 fn 的上下文为 context
  context.fn = this

  const result = context.fn(...args)

  delete context.fn

  return result
}

function text(a, b, c) {
  console.log(this, a, b, c)
  return this
}
text.call3({ test: 22 }, 1, 2, 3)

//方法3
Function.prototype.call4 = function () {
  var args = arguments
  var context = args[0] || window
  context.fn = this
  var newArr = []
  for (var i = 0; i < args.length; i++) {
    newArr.push(args[i])
  }
  context.fn(newArr.slice(1).join(","))
  delete context.fn
}

var test = function (a, b) { console.log(a, b) }
test.call4({}, 1, 2)
```

> 原文链接：[手写代码，简单实现call](https://github.com/airuikun/Weekly-FE-Interview/issues/6)
