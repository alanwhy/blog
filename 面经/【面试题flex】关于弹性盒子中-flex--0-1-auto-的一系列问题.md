### 第一问 弹性盒子中 flex: 0 1 auto 表示什么意思

三个参数分别对应的是 `flex-grow`, `flex-shrink` 和 `flex-basis`，默认值为 0 1 auto。

1.`flex-grow` 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。

2.`flex-shrink` 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

3.`flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。

### 第二问 求最终 left、right 的宽度

```
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 500px;
    background: red;
  }
  .right {
    flex: 2 1 400px;
    background: blue;
  }
</style>
```

样式说明

1. 父元素 container 的 width 为 600px

2. left 元素 `flex-grow` 为 1，`flex-shrink` 为 2，`flex-basis` 为 500px

3. right 元素 `flex-grow` 为 2，`flex-shrink` 为 1，`flex-basis` 为 400px

解题

left 和 right 的主轴空间和大于父元素的宽度 超了 300px

> 500 + 400 = 900 - 600 = 300

总权重为

> 2 * 500 + 1 * 400 = 1400

超出了 所以是收缩 则分别的收缩长度

> left：300 * 2 * 500 / 1400 = 214.28
right: 300 * 1 * 400 / 1400 = 85.72

最终宽度

> leftWidth：500 - 214.28 = 285.72
rightWidth：400 - 85.72 = 314.28

### 第三问 求最终 left、right 的宽度（变形）

```
<div class="container">
    <div class="left"></div>
    <div class="right"></div>
</div>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  .container {
    width: 600px;
    height: 300px;
    display: flex;
  }
  .left {
    flex: 1 2 300px;
    background: red;
  }
  .right {
    flex: 2 1 200px;
    background: blue;
  }
</style>
```

样式说明

1. 父元素 container 的 width 为 600px

2. left 元素 `flex-grow` 为 1，`flex-shrink` 为 2，`flex-basis` 为 300px

3. right 元素 `flex-grow` 为 2，`flex-shrink` 为 1，`flex-basis` 为 200px

剩余空间，是超出的情况

> 600 - 300 - 200 = 100

所以多出来的均分则是用 flex-grow

> 100 / (1 + 2) = 33.33

所以最后宽度

> leftWidth：300 + 1 * 33.33 = 333.33
rightWidth：200 + 2 * 33.33 = 266.67



> 原文链接：
[弹性盒子中 flex: 0 1 auto 表示什么意思](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/380)
[求最终 left、right 的宽度](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/381)
[求最终 left、right 的宽度（变形）](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/382)
