异步编程模式在前端开发过程中，显得越来越重要。从最开始的`XHR`到封装后的`Ajax`都在试图解决异步编程过程中的问题。随着 ES6 新标准的到来，处理异步数据流又有了新的方案。我们都知道，在传统的`ajax`请求中，当异步请求之间的数据存在依赖关系的时候，就可能产生很难看的多层回调，俗称'回调地狱'（callback hell），这却让人望而生畏，`Promise`的出现让我们告别回调函数，写出更优雅的异步代码。在实践过程中，却发现`Promise`并不完美，`Async`/`Await`是近年来 JavaScript 添加的最革命性的的特性之一，`Async`/`Await`提供了一种使得异步代码看起来像同步代码的替代方法。接下来我们介绍这两种处理异步编程的方案。 ###一、Promise 的原理与基本语法
####1.Promise 的原理
Promise 是一种对异步操作的封装，可以通过独立的接口添加在异步操作执行成功、失败时执行的方法。主流的规范是 Promises/A+。

Promise 中有几个状态：

- pending: 初始状态, 非 fulfilled 或 rejected；
- fulfilled: 成功的操作，为表述方便，fulfilled 使用 resolved 代替；
- rejected: 失败的操作。

![Promise.png](https://upload-images.jianshu.io/upload_images/12877063-60443217542c5536.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> pending 可以转化为 fulfilled 或 rejected 并且只能转化一次，也就是说如果 pending 转化到 fulfilled 状态，那么就不能再转化到 rejected。并且 fulfilled 和 rejected 状态只能由 pending 转化而来，两者之间不能互相转换。

####2.Promise 的基本语法

- `Promise`实例必须实现 then 这个方法
- `then()`必须可以接收两个函数作为参数
- `then()`返回的必须是一个 Promise 实例

```
<script src="https://cdn.bootcss.com/bluebird/3.5.1/bluebird.min.js"></script>//如果低版本浏览器不支持Promise，通过cdn这种方式
      <script type="text/javascript">
        function loadImg(src) {
            var promise = new Promise(function (resolve, reject) {
                var img = document.createElement('img')
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function () {
                    reject('图片加载失败')
                }
                img.src = src
            })
            return promise
        }
        var src = 'https://www.imooc.com/static/img/index/logo_new.png'
        var result = loadImg(src)
        result.then(function (img) {
            console.log(1, img.width)
            return img
        }, function () {
            console.log('error 1')
        }).then(function (img) {
            console.log(2, img.height)
        })
     </script>
```

###二、Promise 多个串联操作
Promise 还可以做更多的事情，比如，有若干个异步任务，需要先做任务 1，如果成功后再做任务 2，任何任务失败则不再继续并执行错误处理函数。要串行执行这样的异步任务，不用 Promise 需要写一层一层的嵌套代码。

有了 Promise，我们只需要简单地写

```
job1.then(job2).then(job3).catch(handleError);
```

其中 job1、job2 和 job3 都是 Promise 对象。

比如我们想实现第一个图片加载完成后，再加载第二个图片，如果其中有一个执行失败，就执行错误函数：

```
        var src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
        var result1 = loadImg(src1) //result1是Promise对象
        var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
        var result2 = loadImg(src2) //result2是Promise对象
        result1.then(function (img1) {
            console.log('第一个图片加载完成', img1.width)
            return result2  // 链式操作
        }).then(function (img2) {
            console.log('第二个图片加载完成', img2.width)
        }).catch(function (ex) {
            console.log(ex)
        })
```

这里需注意的是：**`then `方法可以被同一个 `promise` 调用多次，`then `方法必须返回一个 `promise `对象。**上例中`result1.then`如果没有明文返回`Promise`实例，就默认为本身`Promise`实例即`result1`，`result1.then`返回了`result2`实例，后面再执行.then 实际上执行的是`result2.then`

###三、Promise 常用方法
除了串行执行若干异步任务外，Promise 还可以并行执行异步任务。

试想一个页面聊天系统，我们需要从两个不同的 URL 分别获得用户的个人信息和好友列表，这两个任务是可以并行执行的，用`Promise.all()`实现如下：

```
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 600, 'P2');
});
// 同时执行p1和p2，并在它们都完成后执行then:
Promise.all([p1, p2]).then(function (results) {
    console.log(results); // 获得一个Array: ['P1', 'P2']
});
```

有些时候，多个异步任务是为了容错。比如，同时向两个 URL 读取用户的个人信息，只需要获得先返回的结果即可。这种情况下，用 Promise.race()实现：

```
var p1 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 500, 'P1');
});
var p2 = new Promise(function (resolve, reject) {
    setTimeout(resolve, 600, 'P2');
});
Promise.race([p1, p2]).then(function (result) {
    console.log(result); // 'P1'
});
```

由于 p1 执行较快，Promise 的 then()将获得结果'P1'。p2 仍在继续执行，但执行结果将被丢弃。

> 总结：
>
> - Promise.all 接受一个 promise 对象的数组，待全部完成之后，统一执行 success;
> - Promise.race 接受一个包含多个 promise 对象的数组，只要有一个完成，就执行 success

接下来我们对上面的例子做下修改，加深对这两者的理解：

```
     var src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
     var result1 = loadImg(src1)
     var src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
     var result2 = loadImg(src2)
     Promise.all([result1, result2]).then(function (datas) {
         console.log('all', datas[0])//<img src="https://www.imooc.com/static/img/index/logo_new.png">
         console.log('all', datas[1])//<img src="https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg">
     })
     Promise.race([result1, result2]).then(function (data) {
         console.log('race', data)//<img src="https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg">
     })
```

如果我们组合使用 Promise，就可以把很多异步任务以并行和串行的方式组合起来执行 ###四、Async/Await 简介与用法
异步操作是 JavaScript 编程的麻烦事，很多人认为 async 函数是异步操作的终极解决方案。
####1、Async/Await 简介

- `async`/`await`是写异步代码的新方式，优于回调函数和`Promise`。
- `async`/`await`是基于`Promise`实现的，它不能用于普通的回调函数。
- `async`/`await`与`Promise`一样，是非阻塞的。
- `async`/`await`使得异步代码看起来像同步代码，再也没有回调函数。但是改变不了 JS 单线程、异步的本质。
  ####2、Async/Await 的用法
- 使用`await`，函数必须用`async`标识
- `await`后面跟的是一个`Promise`实例
- 需要安装`babel-polyfill`，安装后记得引入 //npm i --save-dev babel-polyfill

```
   function loadImg(src) {
            const promise = new Promise(function (resolve, reject) {
                const img = document.createElement('img')
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function () {
                    reject('图片加载失败')
                }
                img.src = src
            })
            return promise
        }
     const src1 = 'https://www.imooc.com/static/img/index/logo_new.png'
     const src2 = 'https://img1.mukewang.com/545862fe00017c2602200220-100-100.jpg'
     const load = async function(){
        const result1 = await loadImg(src1)
        console.log(result1)
        const result2 = await loadImg(src2)
        console.log(result2)
     }
     load()
```

当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。 ###五、Async/Await 错误处理
`await` 命令后面的 `Promise` 对象，运行结果可能是 `rejected`，所以最好把 `await `命令放在` try...catch` 代码块中。`try..catch`错误处理也比较符合我们平常编写同步代码时候处理的逻辑。

```
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}
```

###六、为什么 Async/Await 更好？
####1. 简洁
使用`Async`/`Await`明显节约了不少代码。我们不需要写.then，不需要写匿名函数处理`Promise`的`resolve`值，也不需要定义多余的 data 变量，还避免了嵌套代码。
####2. 中间值
你很可能遇到过这样的场景，调用 promise1，使用 promise1 返回的结果去调用 promise2，然后使用两者的结果去调用 promise3。你的代码很可能是这样的:

```
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      return promise2(value1)
        .then(value2 => {
          return promise3(value1, value2)
        })
    })
}
```

使用 async/await 的话，代码会变得异常简单和直观

```
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```

####3.条件语句
下面示例中，需要获取数据，然后根据返回数据决定是直接返回，还是继续获取更多的数据。

```
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```

代码嵌套（6 层）可读性较差，它们传达的意思只是需要将最终结果传递到最外层的`Promise`。使用`async`/`await`编写可以大大地提高可读性:

```
const makeRequest = async () => {
  const data = await getJSON()
  if (data.needsAnotherRequest) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data
  }
}
```

原文链接：[异步解决方案----Promise 与 Await](https://segmentfault.com/a/1190000016675466)
