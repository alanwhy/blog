###定义
告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。————《MDN Web Docs》

就是在用这个可以一直重绘动画，然后让人看起来是个动画，重绘的这个过程是个很频繁的操作，所以如果我们自己写，不加以干涉，在性能和资源上会造成严重的浪费，所以我们可以使用requestAnimationFrame来使用我们的动画看起来很流畅，又不会频繁调用

rAF：也算是一种节流手段，原生api，旨在使动画在尽量少占用资源的情况下使动画流畅

lodash中相对应的_.throttle和_.debounce挺好的实现了防抖和节流
具体的防抖和节流知识点，戳：[js防抖&节流](https://www.jianshu.com/p/8ed93e9bc00d)
###优缺点
######优点
- 目标是60fps（16毫秒的一帧），浏览器将决定如何安排渲染的最佳时间。
- 相对简单和标准的API，未来不会改变，减少维护成本。
######缺点
- rAF是内部api，所以我们并不方便修改
- 如果浏览器选项卡没有激活，就用不了
- 兼容性不好，在IE9，Opera Mini和旧Android中仍然不支持
- node中不能使用
###代码demo
实现一个小黑块的移动
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>rAF使用</title>
  <style>
    #SomeElementYouWantToAnimate {
      width: 100px;
      height: 100px;
      background-color: #000;
    }
  </style>
</head>
<body>
  <div id="SomeElementYouWantToAnimate"></div>
  <script>
    var start = null;
    var element = document.getElementById('SomeElementYouWantToAnimate');
    element.style.position = 'absolute';
    /**
     * @method 移动我们的小黑方块
     */
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      element.style.left = Math.min(progress / 10, 200) + 'px';
      if (progress < 2000) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  </script>
</body>
</html>
```
> 原文链接：[前端战五渣学JavaScript——防抖、节流和rAF](https://juejin.im/post/5cce5380f265da03826129bf)
