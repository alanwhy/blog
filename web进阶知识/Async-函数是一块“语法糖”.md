原文链接：[小哥哥小姐姐，来尝尝 Async 函数这块语法糖](https://zhuanlan.zhihu.com/p/42649246)

ES7（ECMAScript 2016）推出了 Async 函数（`async/await`），实现了以顺序、同步代码的编写方式来控制异步流程，彻底解决了困扰 JavaScript 开发者的“回调地狱”问题。

```
const result = [];
// pseudo-code, ajax stand for an asynchronous request
ajax('url1', function(err, data){
    if(err) {...}
    result.push(data)
    ajax('url2', function(err, data){
        if(err) {...}
        result.push(data)
    })
})
console.log(result)
```

现在可以写成如下同步代码的样式了：

```
async function example() {
  const r1 = await new Promise(resolve =>
    setTimeout(resolve, 500, 'slowest')
  )
  const r2 = await new Promise(resolve =>
    setTimeout(resolve, 200, 'slow')
  )
  return [r1, r2]
}

example().then(result => console.log(result))
// ['slowest', 'slow']
```

Async 函数需要在`function`前面添加`async`关键字，同时内部以`await`关键字来“阻塞”异步操作，直到异步操作返回结果，然后再继续执行。 ###当前 JavaScript 编程主要是异步编程

- 当前 JavaScript 编程主要是异步编程。为什么这么说呢？网页或 Web 开发最早从 2005 年 Ajax 流行开始，逐步向重交互时代迈进。
- 特别是 SPA（Single Page Application，单页应用）流行之后，一度有人提出“Web 页面要转向 Web 应用，而且要媲美原生应用”。
- 如今在前端开发组件化的背景下催生的 Angular、React 和 Vue，都是 SPA 进一步演化的结果。
- 页面在首次加载过程中，与 JavaScript 相关的主要任务就是加载基础运行库和扩展库（包括给低版本浏览器打补丁的脚本），然后初始化和设置页面的状态。
- 目前 JavaScript 编程最大的应用是 Web 交互，而 Web 交互的核心就是异步逻辑。

ES6 之前 JavaScript 中控制异步流程的手段只有事件和回调。比如下面的示例展示了通过原生`XMLHttpRequest`对象发送异步请求，然后给`onload`和`onerror`事件分别注册成功和错误处理函数：

```
var req = new XMLHttpRequest();
req.open('GET', url);

req.onload = function () {
    if (req.status == 200) {
        processData(req.response);
    }
};

req.onerror = function () {
    console.log('Network Error');
};

req.send();
```

事件和回调有很多问题，主要是它们只适用于简单的情况。逻辑一复杂，代码的编写和维护成本就成倍上升。比如，大家熟知的“回调地狱”。更重要的是，回调模式的异步本质与人类同步、顺序的思维模式是相悖的。
为了应对越来越复杂的异步编程需求，ES6 推出了解决上述问题的**Promise**。
###Promise
Promise，人们普遍的理解就是：“Promise 是一个未来值的占位符”。也就是说，从语义上讲，一个 Promise 对象代表一个对未来值的“承诺”（promise），这个承诺将来如果“兑现”（fulfill），就会“解决”（resolve）为一个有意义的数据；如果“拒绝”（reject），就会“解决”为一个“拒绝理由”（rejection reason），就是一个错误消息。
Promise 对象的状态很简单，一生下来的状态是`pending`（待定），将来兑现了，状态变成`fulfilled`；拒绝了，状态变成`rejected`。`fulfilled`和`rejected`显然是一种“确定”（`settled`）状态。以上状态转换是不可逆的
![Promise对象的状态.png](https://upload-images.jianshu.io/upload_images/12877063-25dc05fb2e6df660.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

以下是通过`Prmoise(executor)`构造函数创建 Promise 实例的详细过程：要传入一个“执行函数”（`executor`），这个执行函数又接收两个参数“解决函数”（`resolver`）和“拒绝函数”（`rejector`），代码中分别对应变量`resolve`和`reject`，作用分别是将新建对象的状态由`pending`改为`fulfilled`和`rejected`，同时返回“兑现值”（`fulfillment`）和“拒绝理由”（`rejection`）。当然，`resolve`和`reject`都是在异步操作的回调中调用的。调用之后，运行时环境（浏览器引擎或 Node.js 的 libuv）中的事件循环调度机制会把与之相关的反应函数——兑现反应函数或拒绝反应函数以及相关的参数添加到“微任务”队列，以便下一次“循检”（`tick`）时调度到 JavaScript 线程去执行。
![Prmoise(executor).png](https://upload-images.jianshu.io/upload_images/12877063-f00647d4f41c7135.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如前所述，Promise 对象的状态由`pending`变成`fulfilled`，就会执行“兑现反应函数”（fulfillment reaction）；而变成`rejected`，就会执行“拒绝反应函数”（rejection reaction）。如下例所示，常规的方式是通过`p.then()`注册兑现函数，通过`p.catch()`注册拒绝函数：

```
p.then(res => { // 兑现反应函数
  // res === 'random success'
})
p.catch(err => { // 拒绝反应函数
  // err === 'random failure'
})
```

当然还有非常规的方式，而且有时候非常规方式可能更好用：

```
// 通过一个.then()方法同时注册兑现和拒绝函数
p.then(
  res => {
    // handle response
  },
  err => {
    // handle error
  }
)
// 通过.then()方法只注册一个函数：兑现函数
p.then(res => {
  // handle response
})
// 通过.then()方法只传入拒绝函数，兑现函数的位置传null
p.then(null, err => {
  // handle error
})
```

关于 Promise 就这样吧。ES6 除了 Promise，还推出了 Iterator（迭代器）和 Generator（生成器），于是就有成就 Async 函数的 PIG 组合。（详见[原文链接](https://zhuanlan.zhihu.com/p/42649246)）
