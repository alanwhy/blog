#Vue实现数据双向绑定的原理：Object.defineProperty（）
vue实现数据双向绑定主要是：采用**数据劫持**结合**发布者-订阅者模式**的方式，通过`Object.defineProperty（）`来劫持各个属性的`setter`，`getter`，在数据变动时发布消息给订阅者，触发相应监听回调。当把一个普通 Javascript 对象传给 Vue 实例来作为它的` data `选项时，Vue 将遍历它的属性，用 `Object.defineProperty` 将它们转为 `getter`/`setter`。用户看不到 `getter`/`setter`，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。

vue的数据双向绑定 将MVVM作为数据绑定的入口，整合`Observer`，`Compile`和`Watcher`三者，通过`Observer`来监听自己的`model`的数据变化，通过`Compile`来解析编译模板指令（vue中是用来解析 {{}}），最终利用`watcher`搭起`observer`和`Compile`之间的通信桥梁，达到数据变化 —>视图更新；视图交互变化（input）—>数据`model`变更双向绑定效果。

js实现简单的双向绑定
```
<body>
    <div id="app">
    <input type="text" id="txt">
    <p id="show"></p>
</div>
</body>
<script type="text/javascript">
    var obj = {}
    Object.defineProperty(obj, 'txt', {
        get: function () {
            return obj
        },
        set: function (newValue) {
            document.getElementById('txt').value = newValue
            document.getElementById('show').innerHTML = newValue
        }
    })
    document.addEventListener('keyup', function (e) {
        obj.txt = e.target.value
    })
</script>
```
###那么我们实现数据双向绑定呢？
原文链接：[小邵教你玩转ES6](https://juejin.im/post/5b7b95206fb9a019bd2463d8)
这个问题在面试当中，会经常问这个问题，但是面试官更希望听到的是具体底层的实现方式，那么接下来我们也实现一下吧~ （ 简陋版的……(#^.^#)
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>对象的数据双向绑定</title>
</head>

<body>
  <input id='input' type="" name="" value="">
  <script>
    let el = document.getElementById('input') // 1. 获取输入框的dom节点
    let obj = { // 2. 创建一个对象
      name: ""
    }

    function oberseve(obj) { // 3. 对对象进行观察
      if (typeof obj !== 'object') return // 3.1 判断参数是否为对象
      for (let key in obj) { // 3.2 对对象进行遍历，目的是为了把每个属性都设置get/set
        defineReactive(obj, key, obj[key])
        oberseve(obj[key]) // 3.3 obj[key] 有可能还是一个函数，需要递归，给obj[key]里的属性进行设置get/set
      }
    }

    function defineReactive(target, property, value) { // 4. 使用Object.defineProperty
      Object.defineProperty(target, property, {
        get() {
          el.value = value // 4.1 当读取时，把值赋值给input框
          return value
        },
        set(newVal) {
          el.value = newVal // 4.1 当设置时，把赋值给input框
          value = newVal
        }
      })
    }

    oberseve(obj) // 5.执行该函数，对obj对象里的属性进行设置get/set
    el.addEventListener('input', function () { // 6.给输入框绑定input事件
      obj.name = this.value // 7.当输入框输入内容时，我们会把输入框的
                            //   内容赋值给obj.name，触发obj.name的set方法
    })
  </script>
</body>
</html>
```
当我们在输入框输入内容时，再到控制台输入obj.name查看这个值时，会发现打印出"hello swr"
当我们在控制台，给obj.name赋值时，会发现输入框的内容也会作出相应更改

这样我们就实现了一个简陋版的数据双向绑定了，但是这也是有缺点的，这个只是针对对象进行了数据双向绑定,而尤大大的Vuejs就是基于`Object.defineProperty`实现的。

肯定是有其他方式可以实现的，利用es6的`proxy`代理也可以实现数据双向绑定，但是目前的框架还是比较少使用这种方式。
