### 拖拽的实现

在 HTML5 还未普及之前，实现元素的拖拽还算是一件比较麻烦的事，大概思路就是监听鼠标移动相关事件，下面是伪代码

```
oDiv.onmousedown = function(ev){
    //记录起始位置
}
document.onmousemove = function(ev){
    //移动目标元素
}
document.onmouseup = function(ev){
    //取消鼠标移动事件
}
```

HTML5 新增了拖放 draggable 标准，拖拽就变得简单了，只需要通过监听元素的拖放事件就能实现各种拖放功能。

```
<div draggable="true">drag me</div>
```

除了设置`draggable="true"`属性外，默认情况下 img、链接默认是可拖拽的

当然，设置`draggable="true"`元素仅仅是“可拖拽”，松手后就还原，如果需要拖拽到指定位置仅需要在 drop 记录一下就行了

```
dropbox.addEventListener('drop',function(ev){
    dragbox.style.left = XX;
    dragbox.style.top = XX;
})
```

### 自定义原生的拖拽

实现思路

- 去除默认的预览图
- 复制一份当前目标元素，cloneObj
- 监听拖拽事件，改变 cloneObj 的位置
- 拖拽结束移除 cloneObj

##### 1.去除默认的预览图

虽然`setDragImage`比较鸡肋，但是我们可以设置一张透明的图片就可以实现去除默认的预览图的效果了

```
dragbox.addEventListener('dragstart', function (ev) {
    var img = new Image();
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
    ev.dataTransfer.setDragImage(img, 0, 0);
}
```

普通元素设置`draggable="true"`后，Chrome 可以直接拖拽，FireFox 需要在`dragstart`设置`ev.dataTransfer.setData('text','任意值')`才行

##### 2.复制一份当前目标元素，cloneObj

复制一份当前目标元素，并且设置`position:fixed`等属性，可以悬浮在页面之上，然后添加到 body，如下

```
var cloneObj = this.cloneNode(true);
cloneObj.style = 'position:fixed;left:0;top:0;z-index:999;pointer-events:none;transform:translate3d( ' + left + 'px ,' + top + 'px,0);'
document.body.appendChild(cloneObj);
```

##### 3.监听拖拽事件，改变 cloneObj 的位置

拖拽元素时会触发`drag`事件，和鼠标移动事件类似，可以取到当前鼠标位置（在拖拽过程中并不触发`mousemove`事件），同时也能隐藏原目标

```
dragbox.addEventListener('drag', function (ev) {
    if(cloneObj){
        cloneObj.style.transform = 'translate3d( ' + left + 'px ,' + top + 'px,0)';
        dragbox.style.visibility = 'visible';
    }
})
```

Chrome 确实是这样，FireFox 虽然也能触发`drag`事件，然后里面却取不到鼠标位置信息（均为 0），所以，我们只能把监听放在`dragover`上，虽然不太完美，也是一个方法

```
document.addEventListener('dragover', function (ev) {
    if(cloneObj){
        cloneObj.style.transform = 'translate3d( ' + left + 'px ,' + top + 'px,0)';
    }
})
```

##### 4.拖拽结束移除 cloneObj

拖拽结束移除 cloneObj，并且还原原目标

```
oDiv.addEventListener('dragend', function (ev) {
    document.body.removeChild(cloneObj);
    cloneObj = null;
    dragbox.style.visibility = 'visible';
})
```

### 效果图

![效果.gif](https://upload-images.jianshu.io/upload_images/12877063-e0efbe54cae7f63c.gif?imageMogr2/auto-orient/strip)

### 原作者使用方式提供

1.直接引用

```
<script src="./lib/draggable-polyfill.js"></script>
```

2.工程项目

```
npm i draggable-polyfill

import draggable-polyfill;
```

需要注意的一点是：由于只是复制了当前节点，所以如果你的样式依赖于父级，那么复制出来的样式就会和原目标不一样

```
.parent .dragbox{
    background:red
}
/*改为*/
.dragbox{
    background:red
}
```

> 原文链接：# [实现一个美化原生拖拽的 draggable-polyfill](https://segmentfault.com/a/1190000020842646)
> 项目地址：[https://github.com/XboxYan/draggable-polyfill](https://github.com/XboxYan/draggable-polyfill)
> 更多示例：[http://xboxyan.codelabo.cn/draggable-polyfill/example/index.html](http://xboxyan.codelabo.cn/draggable-polyfill/example/index.html)
> 回收箱案例：[https://www.zhangxinxu.com/study/201102/html5-drag-and-drop.html](https://www.zhangxinxu.com/study/201102/html5-drag-and-drop.html)
