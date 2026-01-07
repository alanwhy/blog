效果如图
![image.png](https://upload-images.jianshu.io/upload_images/12877063-fe285ba80f89ffe7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 分析需求

看到这个效果，感觉这个跟随滚动动画，仅靠 CSS 是不可能完成的，因为这里涉及了页面滚动距离的计算
分析一下难点：

- 如何得知用户当前滚动页面的距离并且通知顶部进度条？

正常分析应该是这样的，但是这就陷入了传统的思维。进度条就只是进度条，接收页面滚动距离，改变宽度。如果页面滚动和进度条是一个整体呢？

### 实现

我们运用**线性渐变**来实现这个功能
假设我们的页面被包裹在 `<body>`中，可以滚动的是整个 body，给它添加这样一个从左下到到右上角的线性渐变

```css
body {
  background-image: linear-gradient(to right top, #ffcc00 50%, #eee 50%);
  background-repeat: no-repeat;
}
```

运用一个伪元素，把多出来的部分遮住：

```css
body::after {
  content: "";
  position: fixed;
  top: 5px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  z-index: -1;
}
```

这样之后，滑到底的时候，进度条并没有到底：
![image.png](https://upload-images.jianshu.io/upload_images/12877063-ea50e544f997c1a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

是因为 body 的线性渐变高度设置了整个 body 的大小，我们调整一下渐变的高度

```css
body {
  background-image: linear-gradient(to right top, #ffcc00 50%, #eee 50%);
  background-size: 100% calc(100% - 100vh + 5px);
  background-repeat: no-repeat;
}
```

这里使用了 `calc` 进行了运算，减去了 `100vh`，也就是减去一个屏幕的高度，这样渐变刚好在滑动到底部的时候与右上角贴合。

而 `+ 5px` 则是滚动进度条的高度，预留出 `5px` 的高度。

最后给个原作者的效果网页：[CodePen Demo -- 使用线性渐变实现滚动进度条](https://codepen.io/Chokcoco/pen/KbBXQM?editors=1100)

> 参考原文： [不可思议的纯 CSS 滚动进度条效果](https://segmentfault.com/a/1190000017830427)
