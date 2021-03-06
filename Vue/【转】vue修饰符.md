##目录

- 表单修饰符
- 事件修饰符
- 鼠标按键修饰符
- 键值修饰符
- v-bind 修饰符（实在不知道叫啥名字） ##一、表单修饰符
  ###.lazy

```
<div>
   <input type="text" v-model="value">
   <p>{{value}}</p>
</div>
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-28229f3c4fea6de6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
从这里我们可以看到，我们还在输入的时候，光标还在的时候，下面的值就已经出来了，可以说是非常地实时。
但是有时候我们希望，在我们输入完所有东西，光标离开才更新视图。

```
<div>
   <input type="text" v-model.lazy="value">
   <p>{{value}}</p>
</div>
```

这样即可~这样只有当我们光标离开输入框的时候，它才会更新视图，相当于在`onchange`事件触发更新。
###.trim
在我们的输入框中，我们经常需要过滤一下一些输入完密码不小心多敲了一下空格的兄弟输入的内容。

```
<input type="text" v-model.trim="value">
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-be16dcb9eede9ff0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
为了让你更清楚的看到，我改了一下样式，不过问题不大，相信你已经清楚看到这个大大的 hello 左右两边没有空格，尽管你在 input 框里敲烂了空格键。
需要注意的是，它只能**过滤首尾的空格**！首尾，中间的是不会过滤的
###.number
![image.png](https://upload-images.jianshu.io/upload_images/12877063-37cac8440333e046.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12877063-8f37a761548d10d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如果你先输入数字，那它就会限制你输入的只能是数字。
如果你先输入字符串，那它就相当于没有加.number ##二、事件修饰符
###.stop
由于事件冒泡的机制，我们给元素绑定点击事件的时候，也会触发父级的点击事件。

```
<div @click="shout(2)">
  <button @click="shout(1)">ok</button>
</div>

//js
shout(e){
  console.log(e)
}
//1
//2
```

一键阻止事件冒泡，简直方便得不行。相当于调用了`event.stopPropagation()`方法。

```
<div @click="shout(2)">
  <button @click.stop="shout(1)">ok</button>
</div>
//只输出1
```

###.prevent
用于阻止事件的默认行为，例如，当点击提交按钮时阻止对表单的提交。相当于调用了`event.preventDefault()`方法。

```
<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>
```

注意：修饰符可以同时使用多个,但是可能会因为顺序而有所不同。
用 `v-on:click.prevent.self `会阻止所有的点击，而 `v-on:click.self.prevent `只会阻止对元素自身的点击。
也就是**从左往右**判断~
###.self
只当事件是从事件绑定的元素本身触发时才触发回调。像下面所示，刚刚我们从`.stop`时候知道子元素会冒泡到父元素导致触发父元素的点击事件，当我们加了这个`.self`以后，我们点击`button`不会触发父元素的点击事件`shout`，只有当点击到父元素的时候（蓝色背景）才会`shout`~从这个 self 的英文翻译过来就是‘自己，本身’可以看出这个修饰符的用法

```
<div class="blue" @click.self="shout(2)">
  <button @click="shout(1)">ok</button>
</div>
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-0082ea8f0c2f854d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
###.once
只能用一次，绑定了事件以后只能触发一次，第二次就不会触发。

```
//键盘按坏都只能shout一次
<button @click.once="shout(1)">ok</button>
```

###.capture
从上面我们知道了事件的冒泡，其实完整的事件机制是：**捕获阶段--目标阶段--冒泡阶段**。
默认的呢，是事件触发是从目标开始往上冒泡。
当我们加了这个.capture 以后呢，我们就反过来了，事件触发从包含这个元素的**顶层开始往下**触发。

```
   <div @click.capture="shout(1)">
      obj1
      <div @click.capture="shout(2)">
        obj2
        <div @click="shout(3)">
          obj3
          <div @click="shout(4)">
            obj4
          </div>
        </div>
      </div>
    </div>
    // 1 2 4 3
```

从上面这个例子我们点击 obj4 的时候，就可以清楚地看出区别，obj1，obj2 在捕获阶段就触发了事件，因此是先 1 后 2，后面的 obj3，obj4 是默认的冒泡阶段触发，因此是先 4 然后冒泡到 3~
###.passive
当我们在监听元素滚动事件的时候，会一直触发 onscroll 事件，在 pc 端是没啥问题的，但是在移动端，会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给 onscroll 事件整了一个`.lazy`修饰符

```
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

###.native
我们经常会写很多的小组件，有些小组件可能会绑定一些事件，但是，像下面这样绑定事件是不会触发的

```
<My-component @click="shout(3)"></My-component>
```

必须使用`.native`来修饰这个 click 事件，即

```
<My-component @click.native="shout(3)"></My-component>
```

可以理解为该修饰符的作用就是把一个 vue 组件转化为一个普通的 HTML 标签
注意：**使用.native 修饰符来操作普通 HTML 标签是会令事件失效的** ##三、鼠标按钮修饰符
###.left
左键点击
###.right
右键点击
###.middle
中键点击

```
<button @click.right="shout(1)">ok</button>
```

##四、键值修饰符
其实这个也算是事件修饰符的一种，因为它都是用来修饰键盘事件的。
###.keyCode
如果不用 keyCode 修饰符，那我们每次按下键盘都会触发 shout，当我们想指定按下某一个键才触发这个 shout 的时候，这个修饰符就有用了
具体键码查看[键码对应表](https://zhidao.baidu.com/question/266291349.html)

```
<input type="text" @keyup.keyCode="shout(4)">
```

为了方便我们使用，vue 给一些常用的键提供了别名

```
//普通键
.enter
.tab
.delete //(捕获“删除”和“退格”键)
.space
.esc
.up
.down
.left
.right
```

```
// 系统修饰键
.ctrl
.alt
.meta
.shift
```

可以通过全局`config.keyCodes`对象自定义按键修饰符别名：

```
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

我们从上面看到，键分成了普通常用的键和系统修饰键，区别是什么呢？
当我们写如下代码的时候,我们会发现如果仅仅使用系统修饰键是无法触发 keyup 事件的。

```
<input type="text" @keyup.ctrl="shout(4)">
```

那该如何呢？我们需要将系统修饰键和其他键码链接起来使用，比如

```
<input type="text" @keyup.ctrl.67="shout(4)">
```

这样当我们同时按下 ctrl+c 时，就会触发 keyup 事件。
另，如果是鼠标事件，那就可以单独使用系统修饰符。

```
<button @mouseover.ctrl="shout(1)">ok</button>
<button @mousedown.ctrl="shout(1)">ok</button>
<button @click.ctrl.67="shout(1)">ok</button>
```

大概是什么意思呢，就是你不能单手指使用系统修饰键的修饰符（最少两个手指，可以多个）。你可以一个手指按住系统修饰键一个手指按住另外一个键来实现键盘事件。也可以用一个手指按住系统修饰键，另一只手按住鼠标来实现鼠标事件。
###.exact (2.5 新增)
我们上面说了这个系统修饰键，当我们像这样`<button type="text" @click.ctrl="shout(4)"></button>`绑定了 click 键按下的事件，惊奇的是，我们同时按下几个系统修饰键，比如 ctrl shift 点击，也能触发，可能有些场景我们只需要或者只能按一个系统修饰键来触发（像制作一些快捷键的时候），而当我们按下 ctrl 和其他键的时候则无法触发。那就这样写。
注意：这个只是限制系统修饰键的，像下面这样书写以后你还是可以按下`ctrl + c`，`ctrl+v`或者`ctrl+普通键` 来触发，但是不能按下 ctrl + shift +普通键来触发。

```
<button type="text" @click.ctrl.exact="shout(4)">ok</button>
```

然后下面这个你可以同时按下 enter+普通键来触发，但是不能按下系统修饰键+enter 来触发。

```
<input type="text" @keydown.enter.exact="shout('我被触发了')">
```

##v-bind 修饰符
###.sync(2.3.0+ 新增)
在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以修改父组件，且在父组件和子组件都没有明显的改动来源。我们通常的做法是

```
//父亲组件
<comp :myMessage="bar" @update:myMessage="func"></comp>
//js
func(e){
 this.bar = e;
}
```

```
//子组件js
func2(){
  this.$emit('update:myMessage',params);
}
```

现在这个.sync 修饰符就是简化了上面的步骤

```
//父组件
<comp :myMessage.sync="bar"></comp>
//子组件
this.$emit('update:myMessage',params);
```

这样确实会方便很多，但是也有很多需要注意的点

> 1.使用 sync 的时候，子组件传递的事件名必须为 update:value，其中 value 必须与子组件中 props 中声明的名称完全一致(如上例中的 myMessage，不能使用 my-message) 2.注意带有 .sync 修饰符的 v-bind 不能和表达式一起使用 (例如 v-bind:title.sync=”doc.title + ‘!’” 是无效的)。取而代之的是，你只能提供你想要绑定的属性名，类似 v-model。 3.将 v-bind.sync 用在一个字面量的对象上，例如 v-bind.sync=”{ title: doc.title }”，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。

###.prop
要学习这个修饰符，我们首先要搞懂两个东西的区别。

> **Property**：节点对象在内存中存储的属性，可以访问和设置。
> **Attribute**：节点对象的其中一个属性( property )，值是一个对象。
> 可以通过点访问法 document.getElementById('xx').attributes 或者 document.getElementById('xx').getAttributes('xx') 读取，通过 document.getElementById('xx').setAttribute('xx',value) 新增和修改。
> 在标签里定义的所有属性包括 HTML 属性和自定义属性都会在 attributes 对象里以键值对的方式存在。

其实 attribute 和 property 两个单词，翻译出来都是属性，但是《javascript 高级程序设计》将它们翻译为特性和属性，以示区分

```
//这里的id,value,style都属于property
//index属于attribute
//id、title等既是属性，也是特性。修改属性，其对应的特性会发生改变；修改特性，属性也会改变
<input id="uid" title="title1" value="1" :index="index">
//input.index === undefined
//input.attributes.index === this.index
```

从上面我们可以看到如果直接使用 v-bind 绑定，则默认会绑定到 dom 节点的 attribute。
为了**通过自定义属性存储变量，避免暴露数据**和**防止污染 HTML 结构**
我们可以使用这个修饰符，如下

```
<input id="uid" title="title1" value="1" :index.prop="index">
//input.index === this.index
//input.attributes.index === undefined
```

###.camel
由于 HTML 特性是不区分大小写的。

```
<svg :viewBox="viewBox"></svg>
```

实际上会渲染为

```
<svg viewbox="viewBox"></svg>
```

这将导致渲染失败，因为 SVG 标签只认 viewBox，却不知道 viewbox 是什么。
如果我们使用`.camel`修饰符，那它就会被渲染为驼峰名。
另，如果你使用字符串模版，则没有这些限制。

```
new Vue({
  template: '<svg :viewBox="viewBox"></svg>'
})
```

原文链接 [vue 修饰符--可能是东半球最详细的文档（滑稽）](https://segmentfault.com/a/1190000016786254)
