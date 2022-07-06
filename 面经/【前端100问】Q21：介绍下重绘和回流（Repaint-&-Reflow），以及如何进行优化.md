### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [介绍下重绘和回流（Repaint & Reflow），以及如何进行优化](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

### 正文回答

#### 浏览器的渲染过程

![q21-1.png](https://upload-images.jianshu.io/upload_images/12877063-9a221a80b55408d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


从上面这个图上，我们可以看到，浏览器渲染过程如下：

1. 解析 HTML，生成 DOM 树，解析 CSS，生成 CSSOM 树
2. 将 DOM 树和 CSSOM 树结合，生成渲染树(Render Tree)
3. Layout(回流):根据生成的渲染树，进行回流(Layout)，得到节点的几何信息（位置，大小）
4. Painting(重绘):根据渲染树以及回流得到的几何信息，得到节点的绝对像素
5. Display:将像素发送给 GPU，展示在页面上。（这一步其实还有很多内容，比如会在 GPU 将多个合成层合并为同一个层，并展示在页面中。而 css3 硬件加速的原理则是新建合成层，这里我们不展开）

#### 生成渲染树

![q21-2.png](https://upload-images.jianshu.io/upload_images/12877063-548621a19025d2a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


为了构建渲染树，浏览器主要完成了以下工作：

1. 从 DOM 树的根节点开始遍历每个可见节点。
2. 对于每个可见的节点，找到 CSSOM 树中对应的规则，并应用它们。
3. 根据每个可见节点以及其对应的样式，组合生成渲染树。

第一步中，既然说到了要遍历可见的节点，那么我们得先知道，什么节点是不可见的。不可见的节点包括：

- 一些不会渲染输出的节点，比如 script、meta、link 等。
- 一些通过 css 进行隐藏的节点。比如 display:none。注意，利用 visibility 和 opacity 隐藏的节点，还是会显示在渲染树上的。只有 display:none 的节点才不会显示在渲染树上。
  从上面的例子来讲，我们可以看到 span 标签的样式有一个 display:none，因此，它最终并没有在渲染树上。

**注意：渲染树只包含可见的节点**

#### 回流

前面我们通过构造渲染树，我们将可见 DOM 节点以及它对应的样式结合起来，可是我们还需要计算它们在设备视口(viewport)内的确切位置和大小，这个计算的阶段就是回流。

#### 重绘

最终，我们通过构造渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息(位置、大小)，那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素，这个阶段就叫做重绘节点。

#### 何时发生回流重绘

回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化的时候，就需要回流。比如以下情况：

- 添加或删除可见的 DOM 元素
- 元素的位置发生变化
- 元素的尺寸发生变化（包括外边距、内边框、边框大小、高度和宽度等）
- 内容发生变化，比如文本变化或图片被另一个不同尺寸的图片所替代。
- 页面一开始渲染的时候（这肯定避免不了）
- 浏览器的窗口尺寸变化（因为回流是根据视口的大小来计算元素的位置和大小的）

**注意：回流一定会触发重绘，而重绘不一定会回流**

根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重排，比如，滚动条出现的时候或者修改了根节点。

#### 浏览器的优化机制

现代的浏览器都是很聪明的，由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程。浏览器会将修改操作放入到队列里，直到过了一段时间或者操作达到了一个阈值，才清空队列。但是！当你获取布局信息的操作的时候，会强制队列刷新，比如当你访问以下属性或者使用以下方法:

- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- getComputedStyle()
- getBoundingClientRect

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列。**如果要使用它们，最好将值缓存起来。

#### 减少回流和重绘

##### 最小化重绘和重排

可以合并多次对 DOM 和样式的修改，然后一次处理掉。

```js
const el = document.getElementById("test");
el.style.padding = "5px";
el.style.borderLeft = "1px";
el.style.borderRight = "2px";
```

例子中，有三个样式属性被修改了，每一个都会影响元素的几何结构，引起回流。当然，大部分现代浏览器都对其做了优化，因此，只会触发一次重排。

因此，我们可以合并所有的改变然后依次处理，比如我们可以采取以下的方式：

```js
// 使用cssText
const el = document.getElementById("test");
el.style.cssText += "border-left: 1px; border-right: 2px; padding: 5px;";

// 修改CSS的class
const el = document.getElementById("test");
el.className += " active";
```

##### 批量修改 DOM

当我们需要对 DOM 对一系列修改的时候，可以通过以下步骤减少回流重绘次数：

1. 使元素脱离文档流
   a、隐藏元素，应用修改，重新显示
   b、使用文档片段(document fragment)在当前 DOM 之外构建一个子树，再把它拷贝回文档。
   c、将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。
2. 对其进行多次修改
3. 将元素带回到文档中。

该过程的第一步和第三步可能会引起回流，但是经过第一步之后，对 DOM 的所有修改都不会引起回流重绘，因为它已经不在渲染树了。

考虑我们要执行一段批量插入节点的代码：

```js
// 如果我们直接这样执行的话，由于每次循环都会插入一个新的节点，会导致浏览器回流一次。
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement("li");
    li.textContent = "text";
    appendToElement.appendChild(li);
  }
}

const ul = document.getElementById("list");
appendDataToElement(ul, data);
```

我们可以使用这三种方式进行优化:

```js
// 这个会在展示和隐藏节点的时候，产生两次回流
function appendDataToElement(appendToElement, data) {
  let li;
  for (let i = 0; i < data.length; i++) {
    li = document.createElement("li");
    li.textContent = "text";
    appendToElement.appendChild(li);
  }
}
const ul = document.getElementById("list");
ul.style.display = "none";
appendDataToElement(ul, data);
ul.style.display = "block";

// 使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档
const ul = document.getElementById("list");
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment);

// 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。
const ul = document.getElementById("list");
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

对于上面这三种情况，我写了一个 demo 在 safari 和 chrome 上测试修改前和修改后的性能。然而实验结果不是很理想。

原因：原因其实上面也说过了，现代浏览器会使用队列来储存多次修改，进行优化，所以对这个优化方案，我们其实不用优先考虑。

#### 避免触发同步布局事件

上文我们说过，当我们访问元素的一些属性的时候，会导致浏览器强制清空队列，进行强制同步布局。举个例子，比如说我们想将一个 p 标签数组的宽度赋值为一个元素的宽度，我们可能写出这样的代码：

```js
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + "px";
  }
}
```

这段代码看上去是没有什么问题，可是其实会造成很大的性能问题。在每次循环的时候，都读取了 box 的一个 offsetWidth 属性值，然后利用它来更新 p 标签的 width 属性。这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列。我们可以优化为:

```js
const width = box.offsetWidth;
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = width + "px";
  }
}
```

同样，我也写了个 demo 来比较两者的性能差异。你可以自己点开这个 demo 体验下。这个对比的性能差距就比较明显。

#### 对于复杂动画效果,使用绝对定位让其脱离文档流

对于复杂动画效果，由于会经常的引起回流重绘，因此，我们可以使用绝对定位，让它脱离文档流。否则会引起父元素以及后续元素频繁的回流。这个我们就直接上个[例子](https://chenjigeng.github.io/example/share/%E9%81%BF%E5%85%8D%E5%9B%9E%E6%B5%81%E9%87%8D%E7%BB%98/%E5%B0%86%E5%A4%8D%E6%9D%82%E5%8A%A8%E7%94%BB%E6%B5%AE%E5%8A%A8%E5%8C%96.html)。

我们可以看到，帧数一直都没到 60。这个时候，只要我们点击一下那个按钮，把这个元素设置为绝对定位，帧数就可以稳定 60。

#### css3 硬件加速（GPU 加速）

划重点：

1. 使用 css3 硬件加速，可以让 transform、opacity、filters 这些动画不会引起回流重绘 。
2. 对于动画的其它属性，比如 background-color 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能。

css3 硬件加速的坑

1. 如果你为太多元素使用 css3 硬件加速，会导致内存占用较大，会有性能问题。
2. 在 GPU 渲染字体会导致抗锯齿无效。这是因为 GPU 和 CPU 的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊。
