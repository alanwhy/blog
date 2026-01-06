### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [react-router 里的 <Link> 标签和 <a> 标签有什么区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/135)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```js
// 先看Link点击事件handleClick部分源码
if (_this.props.onClick) _this.props.onClick(event);

if (
  !event.defaultPrevented && // onClick prevented default
  event.button === 0 && // ignore everything but left clicks
  !_this.props.target && // let browser handle "target=_blank" etc.
  !isModifiedEvent(event) // ignore clicks with modifier keys
) {
  event.preventDefault();

  var history = _this.context.router.history;
  var _this$props = _this.props,
    replace = _this$props.replace,
    to = _this$props.to;

  if (replace) {
    history.replace(to);
  } else {
    history.push(to);
  }
}
```

Link 做了 3 件事情：

1. 有 onclick 那就执行 onclick
2. click 的时候阻止 a 标签默认事件（这样子点击<a href="/abc">123</a>就不会跳转和刷新页面）
3. 再取得跳转 href（即是 to），用 history（前端路由两种方式之一，history & hash）跳转，此时只是链接变了，并没有刷新页面

##### 一个 bug 记录

之前遇到过一个 bug, 在一个 SPA 里点击一个链接按钮后，redux 里的数据都丢了。后来才发现，不知道谁写了一个 a,没有用 Link。相当于重新打开了一个 SPA。
