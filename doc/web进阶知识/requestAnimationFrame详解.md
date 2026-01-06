<!--
 * @Author: wuhaoyuan
 * @Date: 2022-09-22 15:18:13
 * @LastEditTime: 2022-09-22 15:26:52
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/web进阶知识/requestAnimationFrame详解.md
-->

# requestAnimationFrame 详解

> 原文链接: https://www.jianshu.com/p/fa5512dfb4f5
> 其他资料：[requestAnimationFrame-执行机制探索](./requestAnimationFrame-%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6%E6%8E%A2%E7%B4%A2.md)

源于看到的一道面试题，**问题是用 js 实现一个无限循环的动画**

首先想到的是定时器

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      #e {
        width: 100px;
        height: 100px;
        background: red;
        position: absolute;
        left: 0;
        top: 0;
        zoom: 1;
      }
    </style>
  </head>
  <body>
    <div id="e"></div>
    <script>
      var e = document.getElementById("e");
      var flag = true;
      var left = 0;

      function render() {
        if (flag == true) {
          if (left >= 100) {
            flag = false;
          }
          e.style.left = ` ${left++}px`;
        } else {
          if (left <= 0) {
            flag = true;
          }
          e.style.left = ` ${left--}px`;
        }
      }
      setInterval(function () {
        render();
      }, 1000 / 60);
    </script>
  </body>
</html>
```

可以说是完美实现！

至于时间间隔为什么是 1000/60,这是因为大多数屏幕渲染的时间间隔是每秒 60 帧。

既然 `setInterval` 可以搞定为啥还要用 `requestAnimationFrame` 呢？最直观的感觉就是，添加 api 的人是个大神级牛人，我只能怀疑自己。

所以搜索相关问题发现以下两点

`requestAnimationFrame` 比起 `setTimeout`、`setInterval` 的优势主要有两点：

1. `requestAnimationFrame` 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。
2. 在隐藏或不可见的元素中，`requestAnimationFrame` 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。

直接上代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      #e {
        width: 100px;
        height: 100px;
        background: red;
        position: absolute;
        left: 0;
        top: 0;
        zoom: 1;
      }
    </style>
  </head>
  <body>
    <div id="e"></div>
    <script>
      var e = document.getElementById("e");
      var flag = true;
      var left = 0;

      function render() {
        if (flag == true) {
          if (left >= 100) {
            flag = false;
          }
          e.style.left = ` ${left++}px`;
        } else {
          if (left <= 0) {
            flag = true;
          }
          e.style.left = ` ${left--}px`;
        }
      }

      //requestAnimationFrame效果
      (function animloop() {
        render();
        window.requestAnimationFrame(animloop);
      })();
    </script>
  </body>
</html>
```

我没有添加各个浏览器的兼容写法，这里只说用法。

效果是实现了，不过我想到两个问题。

1. 怎么停止 `requestAnimationFrame`？是否有类似 `clearInterval` 这样的类似方法？

第一个问题：答案是确定的 必须有：`cancelAnimationFrame()`接收一个参数 `requestAnimationFrame` 默认返回一个 id，`cancelAnimationFrame` 只需要传入这个 id 就可以停止了。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      #e {
        width: 100px;
        height: 100px;
        background: red;
        position: absolute;
        left: 0;
        top: 0;
        zoom: 1;
      }
    </style>
  </head>
  <body>
    <div id="e"></div>
    <script>
      var e = document.getElementById("e");
      var flag = true;
      var left = 0;
      var rafId = null;

      function render() {
        if (flag == true) {
          if (left >= 100) {
            flag = false;
          }
          e.style.left = ` ${left++}px`;
        } else {
          if (left <= 0) {
            flag = true;
          }
          e.style.left = ` ${left--}px`;
        }
      }

      //requestAnimationFrame效果
      (function animloop(time) {
        console.log(time, Date.now());
        render();
        rafId = requestAnimationFrame(animloop);
        //如果left等于50 停止动画
        if (left == 50) {
          cancelAnimationFrame(rafId);
        }
      })();

      //setInterval效果
      // setInterval(function(){
      //     render()
      // },1000/60)
    </script>
  </body>
</html>
```

![效果图](/img/15081804-df8b351c84ea0d64.gif)

2. 如果我想动画频率降低怎么做，为什么不考虑加快呵呵 当前刷新频率已经是屏幕的刷新频率了再快也没有意义了

这个略微麻烦点

默认情况下，`requestAnimationFrame` 执行频率是 1000/60,大概是 16ms 多执一次。

如果我们想每 50ms 执行一次怎么办呢？

`requestAnimationFrame` 执行条件类似递归调用 （说的是类似）别咬我，既然这样的话我们能否自定一个时间间隔再执行呢？当然定时器这么 low 的东西我们就不考虑了，都已经抛弃它用 rAF 了（都快结束了我才想起写简写太他妈长了）

这个思路来源于我几年前搞 IM 的一个项目，服务端推送消息为了减小包的大小不给时间戳，这个我们做前端的都知道，我们虽然很牛逼 不过用户更牛逼，万一改了时间就不好玩了。

解决方案是 当和服务端通信时 记录下一个时间差，（时间差等于服务端时间-本地时间）不管正负我们只要这个时间差。这样每当我们接受到消息 或者发送消息的时候我们就拿本地时间和是价差相加。这样就可以保证和服务端时间是一致的了，思路是不是很牛逼哈哈。

撤了半天我们通过以上思路来解决下 rAF 改变间隔的问题

上代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Document</title>
    <style>
      #e {
        width: 100px;
        height: 100px;
        background: red;
        position: absolute;
        left: 0;
        top: 0;
        zoom: 1;
      }
    </style>
  </head>
  <body>
    <div id="e"></div>
    <script>
      var e = document.getElementById("e");
      var flag = true;
      var left = 0;
      //当前执行时间
      var nowTime = 0;
      //记录每次动画执行结束的时间
      var lastTime = Date.now();
      //我们自己定义的动画时间差值
      var diffTime = 40;

      function render() {
        if (flag == true) {
          if (left >= 100) {
            flag = false;
          }
          e.style.left = ` ${left++}px`;
        } else {
          if (left <= 0) {
            flag = true;
          }
          e.style.left = ` ${left--}px`;
        }
      }

      //requestAnimationFrame效果
      (function animloop() {
        //记录当前时间
        nowTime = Date.now();
        // 当前时间-上次执行时间如果大于diffTime，那么执行动画，并更新上次执行时间
        if (nowTime - lastTime > diffTime) {
          lastTime = nowTime;
          render();
        }
        requestAnimationFrame(animloop);
      })();
    </script>
  </body>
</html>
```

![效果图](/img/15081804-bff3cfa4207dc7f6.gif)
