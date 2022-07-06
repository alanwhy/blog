### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [如何解决移动端 Retina 屏 1px 像素问题](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/115)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

问题是 现在已经没有 1px 的问题了啊。17 以前的 BUG 了吧？

**造成边框变粗的原因**

其实这个原因很简单，因为 css 中的 1px 并不等于移动设备的 1px，这些由于不同的手机有不同的像素密度。在 window 对象中有一个`devicePixelRatio`属性，他可以反应 css 中的像素与设备的像素比。

> `devicePixelRatio`的官方的定义为：设备物理像素和设备独立像素的比例，也就是 `devicePixelRatio` = 物理像素 / 独立像素。

1、0.5px 边框

解决方案是通过 JavaScript 检测浏览器能否处理 0.5px 的边框，如果可以，给 html 标签元素添加个 class。

```js
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  var testElem = document.createElement("div");
  testElem.style.border = ".5px solid transparent";
  document.body.appendChild(testElem);
  if (testElem.offsetHeight == 1) {
    document.querySelector("html").classList.add("hairlines");
  }
  document.body.removeChild(testElem);
}
// 脚本应该放在内，如果在里面运行，需要包装 $(document).ready(function() {})
```

```css
div {
  border: 1px solid #bbb;
}
.hairlines div {
  border-width: 0.5px;
}
```

2、使用`border-image`实现

```css
.border-bottom-1px {
  border-width: 0 0 1px 0;
  -webkit-border-image: url(linenew.png) 0 0 2 0 stretch;
  border-image: url(linenew.png) 0 0 2 0 stretch;
}
```

3、使用`background-image`实现

```css
.background-image-1px {
  background: url(../img/line.png) repeat-x left bottom;
  -webkit-background-size: 100% 1px;
  background-size: 100% 1px;
}
```

4、多背景渐变实现

```css
.background-gradient-1px {
  background: linear-gradient(180deg, black, black 50%, transparent 50%) top left /
      100% 1px no-repeat, linear-gradient(
        90deg,
        black,
        black 50%,
        transparent 50%
      ) top right / 1px 100% no-repeat,
    linear-gradient(0, black, black 50%, transparent 50%) bottom right / 100% 1px
      no-repeat, linear-gradient(-90deg, black, black 50%, transparent 50%) bottom
      left / 1px 100% no-repeat;
}
/* 或者 */
.background-gradient-1px {
  background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0.5, transparent),
      color-stop(0.5, #c8c7cc),
      to(#c8c7cc)
    ) left bottom repeat-x;
  background-size: 100% 1px;
}
```

5、使用`box-shadow`模拟边框

```css
.box-shadow-1px {
  box-shadow: inset 0px -1px 1px -1px #c8c7cc;
}
```

6、viewport + rem 实现

7、伪类 + transform 实现

```css
/* 单条border样式设置 */
.scale-1px {
  position: relative;
  border: none;
}
.scale-1px:after {
  content: "";
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}

/* 四条boder样式设置 */
.scale-1px {
  position: relative;
  margin-bottom: 20px;
  border: none;
}
.scale-1px:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}
```

```js
// 判断是否 Retina 屏
if (window.devicePixelRatio && devicePixelRatio >= 2) {
  document.querySelector("ul").className = "scale-1px";
}
```

> 参考原文 [7 种方法解决移动端 Retina 屏幕 1px 边框问题](https://juejin.cn/post/6844903456717668359)
