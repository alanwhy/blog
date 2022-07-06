### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [React setState 笔试题，下面的代码输出什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/18)

### 题目内容

```js
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0,
    };
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 1 次 log

    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val); // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 3 次 log

      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val); // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
}
```

### 正文回答

1. 第一次和第二次都是在 react 自身生命周期内，触发时 `isBatchingUpdates` 为 true，所以并不会直接执行更新 state，而是加入了 `dirtyComponents`，所以打印时获取的都是更新前的状态 0。

2. 两次 setState 时，获取到 this.state.val 都是 0，所以执行时都是将 0 设置成 1，在 react 内部会被合并掉，只执行一次。设置完成后 state.val 值为 1。

3. setTimeout 中的代码，触发时 `isBatchingUpdates` 为 false，所以能够直接进行更新，所以连着输出 2，3。

输出： 0 0 2 3

#### isBatchingUpdates 的判断条件

isBatchingUpdates 默认值为 false，当 react 自身的事件处理函数或 react 生命周期触发时，isBatchingUpdates 会被赋值为 true，当更新完成时又会被复原为 false
