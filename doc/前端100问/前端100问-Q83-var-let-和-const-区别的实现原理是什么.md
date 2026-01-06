### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [var、let 和 const 区别的实现原理是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/133)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

##### 第一次质疑

我第一次质疑我的理解是在遇到 for 循环的时候，代码如下。

```js
// 代码段1
var liList = document.querySelectorAll("li"); // 共5个li
for (var i = 0; i < liList.length; i++) {
  liList[i].onclick = function () {
    console.log(i);
  };
}
```

大家都知道依次点击 li 会打印出 5 个 5。如果把 var i 改成 let i，就会分别打印出 0、1、2、3、4：

```js
// 代码段2
var liList = document.querySelectorAll("li"); // 共5个li
for (let i = 0; i < liList.length; i++) {
  liList[i].onclick = function () {
    console.log(i);
  };
}
```

然而，用我之前的知识来理解这个代码是不能自圆其说的。因为代码中依然只声明了一个 i，在 for 循环结束后，i 的值还是会变成 5 才对。

##### 第二次质疑

我在 StackOverflow 上闲逛的时候，无意中发现了一个是关于「let 到底有没有提升」的问题：

[Are variables declared with let or const not hoisted in ES6?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-hoisted)

其中一个高票回答认为 JS 中所有的声明（var/let/const/function/class），都存在提升，理由是如下代码：

```js
x = "global";
// function scope:
(function() {
    x; // not "global"
    var/let/… x;
}());
// block scope (not for `var`s):
{
    x; // not "global"
    let/const/… x;
}
```

我觉得他说得挺有道理的。于是我又去 MDN 和 ECMAScript 翻了翻，发现两处疑点：

1. MDN 关于 let 是否存在提升的章节，被编辑了两次，第一次说存在提升，第二次说不存在提升（参考 2017 年 3 月 10 号的变更记录）。也就是说 MDN 的维护者都在这个问题上产生过分歧，更何况我们了。
2. ES 文档里出现了「var/let hoisting」字样。

##### 创建、初始化和赋值

###### 我们来看看 var 声明的「创建、初始化和赋值」过程

```js
function fn() {
  var x = 1;
  var y = 2;
}
fn();
```

在执行 fn 时，会有以下过程（不完全）：

1. 进入 fn，为 fn 创建一个环境。
2. 找到 fn 中所有用 var 声明的变量，在这个环境中「创建」这些变量（即 x 和 y）。
3. 将这些变量「初始化」为 undefined。
4. 开始执行代码
5. x = 1 将 x 变量「赋值」为 1
6. y = 2 将 y 变量「赋值」为 2

也就是说 var 声明会在代码执行之前就将「创建变量，并将其初始化为 undefined」。

这就解释了为什么在 var x = 1 之前 console.log(x) 会得到 undefined。

###### 接下来来看 function 声明的「创建、初始化和赋值」过程

```js
fn2();
function fn2() {
  console.log(2);
}
```

JS 引擎会有以下过程：

1. 找到所有用 function 声明的变量，在环境中「创建」这些变量。
2. 将这些变量「初始化」并「赋值」为 function(){ console.log(2) }。
3. 开始执行代码 fn2()

也就是说 function 声明会在代码执行之前就「创建、初始化并赋值」。

###### 接下来看 let 声明的「创建、初始化和赋值」过程

```js
{
  let x = 1;
  x = 2;
}
```

我们只看 {} 里面的过程：

1. 找到所有用 let 声明的变量，在环境中「创建」这些变量
2. 开始执行代码（注意现在还没有初始化）
3. 执行 x = 1，将 x 「初始化」为 1（这并不是一次赋值，如果代码是 let x，就将 x 初始化为 undefined）
4. 执行 x = 2，对 x 进行「赋值」

这就解释了为什么在 let x 之前使用 x 会报错：

```js
let x = "global";
{
  console.log(x); // Uncaught ReferenceError: x is not defined
  let x = 1;
}
```

原因有两个

1. console.log(x) 中的 x 指的是下面的 x，而不是全局的 x
2. 执行 log 时 x 还没「初始化」，所以不能使用（也就是所谓的暂时死区）

看到这里，你应该明白了 let 到底有没有提升：

1. let 的「创建」过程被提升了，但是初始化没有提升。
2. var 的「创建」和「初始化」都被提升了。
3. function 的「创建」「初始化」和「赋值」都被提升了。

最后看 const，其实 const 和 let 只有一个区别，那就是 const 只有「创建」和「初始化」，没有「赋值」过程。

所谓暂时死区，就是**不能在初始化之前，使用变量**。

> 原文：[我用了两个月的时间才理解 let](https://fangyinghang.com/let-in-js/)
