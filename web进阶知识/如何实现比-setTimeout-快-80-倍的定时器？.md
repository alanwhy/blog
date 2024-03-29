如何实现比 setTimeout 快 80 倍的定时器？

> 在浏览器中，setTimeout()/setInterval() 的每调用一次定时器的最小间隔是 4ms，这通常是由于函数嵌套导致（嵌套层级达到一定深度）。

简单来说，5 层以上的定时器嵌套会导致至少 4ms 的延迟。

用如下代码做个测试：

```js
let a = performance.now();
setTimeout(() => {
  let b = performance.now();
  console.log(b - a);
  setTimeout(() => {
    let c = performance.now();
    console.log(c - b);
    setTimeout(() => {
      let d = performance.now();
      console.log(d - c);
      setTimeout(() => {
        let e = performance.now();
        console.log(e - d);
        setTimeout(() => {
          let f = performance.now();
          console.log(f - e);
          setTimeout(() => {
            let g = performance.now();
            console.log(g - f);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
}, 0);

// 1.3500000350177288
// 1.244999933987856
// 1.38000026345253
// 1.2050000950694084
// 4.724999889731407
// 5.309999920427799
```

## 探索

假设我们就需要一个「立刻执行」的定时器呢？有什么办法绕过这个 4ms 的延迟吗，上面那篇 MDN 文档的角落里有一些线索：

> 如果想在浏览器中实现 0ms 延时的定时器，你可以参考这里[3]所说的 `window.postMessage()`。

用 `postMessage` 来实现真正 0 延迟的定时器：

```js
(function () {
  var timeouts = [];
  var messageName = "zero-timeout-message";

  // 保持 setTimeout 的形态，只接受单个函数的参数，延迟始终为 0。
  function setZeroTimeout(fn) {
    timeouts.push(fn);
    window.postMessage(messageName, "*");
  }

  function handleMessage(event) {
    if (event.source == window && event.data == messageName) {
      event.stopPropagation();
      if (timeouts.length > 0) {
        var fn = timeouts.shift();
        fn();
      }
    }
  }

  window.addEventListener("message", handleMessage, true);

  // 把 API 添加到 window 对象上
  window.setZeroTimeout = setZeroTimeout;
})();
```

由于 `postMessage` 的回调函数的执行时机和 `setTimeout` 类似，都属于宏任务，所以可以简单利用 `postMessage` 和 `addEventListener('message')` 的消息通知组合，来实现模拟定时器的功能。

再利用上面的嵌套定时器的例子来跑一下测试：

```js
// 0.3850003704428673
// 0.23999996483325958
// 0.15999982133507729
// 0.3349999897181988
// 0.169999897480011
// 0.135000329464674
```

全部在 0.1 ~ 0.3 毫秒级别，而且不会随着嵌套层数的增多而增加延迟。

## 测试

从理论上来说，由于 `postMessage` 的实现没有被浏览器引擎限制速度，一定是比 `setTimeout` 要快的。但空口无凭，咱们用数据说话。

作者设计了一个实验方法，就是分别用 `postMessage` 版定时器和传统定时器做一个递归执行计数函数的操作，看看同样计数到 100 分别需要花多少时间。读者也可以在这里自己跑一下测试[4]。

```js
function runtest() {
  var output = document.getElementById("output");
  var outputText = document.createTextNode("");
  output.appendChild(outputText);
  function printOutput(line) {
    outputText.data += line + "\n";
  }

  var i = 0;
  var startTime = Date.now();
  // 通过递归 setZeroTimeout 达到 100 计数
  // 达到 100 后切换成 setTimeout 来实验
  function test1() {
    if (++i == 100) {
      var endTime = Date.now();
      printOutput(
        "100 iterations of setZeroTimeout took " +
          (endTime - startTime) +
          " milliseconds."
      );
      i = 0;
      startTime = Date.now();
      setTimeout(test2, 0);
    } else {
      setZeroTimeout(test1);
    }
  }

  setZeroTimeout(test1);

  // 通过递归 setTimeout 达到 100 计数
  function test2() {
    if (++i == 100) {
      var endTime = Date.now();
      printOutput(
        "100 iterations of setTimeout(0) took " +
          (endTime - startTime) +
          " milliseconds."
      );
    } else {
      setTimeout(test2, 0);
    }
  }
}
```

直接放结论，这个差距不固定，在我的 mac 上用无痕模式排除插件等因素的干扰后，以计数到 100 为例，大概有 80 ~ 100 倍的时间差距。在我硬件更好的台式机上，甚至能到 200 倍以上。

## Performance 面板

只是看冷冰冰的数字还不够过瘾，我们打开 Performance 面板，看看更直观的可视化界面中，postMessage 版的定时器和 setTimeout 版的定时器是如何分布的。

![image.png](https://upload-images.jianshu.io/upload_images/12877063-0b174575c681001e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这张分布图非常直观的体现出了我们上面所说的所有现象，左边的 postMessage 版本的定时器分布非常密集，大概在 5ms 以内就执行完了所有的计数任务。

而右边的 setTimeout 版本相比较下分布的就很稀疏了，而且通过上方的时间轴可以看出，前四次的执行间隔大概在 1ms 左右，到了第五次就拉开到 4ms 以上。

## 总结

通过本文，你大概可以了解如下几个知识点：

1. setTimeout 的 4ms 延迟历史原因，具体表现。
2. 如何通过 postMessage 实现一个真正 0 延迟的定时器。

> 原文链接：[如何实现比 setTimeout 快 80 倍的定时器？](https://mp.weixin.qq.com/s/NqzWkeOhqAU85XPkJu_wCA)
