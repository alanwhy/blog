##此为转载文章，原文链接在底部~
我们在控制台打印一下 console，看看它还有哪些神奇的方法：
![console.png](https://upload-images.jianshu.io/upload_images/12877063-8804c59bc67632b0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
下面我们从最简单的 console.log 方法开始，逐个分析其他方法以及所涉及到的调试技巧。 #一、console.log()打印内容。
此处：主要聊一聊`console.log()`的占位符。其共有五种占位符

- %s 字符串
- %d 或 %i 整数
- %f 浮点数
- %o 对象的链接
- %c CSS 格式字符串
  如果方法的第一个参数中使用了占位符，那么就依次使用后面的参数进行替换。

```
const name = 'chinaBerg';
const age = 88;
const money = 12.88;
const obj = {
    status: '很积极'
}

console.log('我叫%s，%d岁，有%f元，状态：%o', name, age, money, obj.status, '又打印一句话')
```

![谷歌打印结果.png](https://upload-images.jianshu.io/upload_images/12877063-65ba353cc39e6eff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到我们后面使用的参数对前面的占位符进行了替换，有点像我们字符串拼接的简化操作。比如我们 es5 中的字符串拼接：

```
console.log('我叫' +  name + ' ,' + age +'岁，有' + money + '元')
```

es6 已经有了更强悍的字符串模板：

```
console.log(`我叫${name}，${age}岁, 有${money}元`);
```

es6 的字符串模板中，只能使用%c 占位符，其他占位符是没有效果的。

```
// 注意这里字符串模板的最后插入了%f
console.log(`我叫${name}，${age}岁, 有%f元`, 12.88);
```

![%f没有效果.png](https://upload-images.jianshu.io/upload_images/12877063-d134f8497f17e819.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`%c`占位符还是略有趣味的：

```
const css1 = 'font-size: 22px;font-weight: bold';
const css2 = 'border: 1px solid green';
const css3 = 'color: #fff;background: #f00';

// 占位符填入
console.log('%c %s + %s = %s', css1, 1, 2, 3);
// 字符串拼接形式中插入%c占位符
console.log('%c我的名字叫' + name + ', 今年' + age + '岁', css2);
// es6字符串模板中插入%c占位符
console.log(`%c我叫${name}，${age}岁, 有%f元`, css3);
```

![谷歌打印效果.png](https://upload-images.jianshu.io/upload_images/12877063-2bb404219d2cc9b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到这些打印的内容已经被添加了我们的样式。

#二、console.info()和 console.debug()
和`console.log()`很像的还有俩，一个是`console.info()`，一个是`console.debug()`。其实这个三个功能都是一样的，只不过有些区别，下面就具体介绍一下这三个方法。

```
console.log('我是console.log()打印出来的');
console.info('我是console.info()打印出来的');
console.debug('console.debug()打印出来的')
```

![谷歌浏览器.png](https://upload-images.jianshu.io/upload_images/12877063-d91f30310fb107ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![火狐.png](https://upload-images.jianshu.io/upload_images/12877063-32daec36e29f86f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![ie.png](https://upload-images.jianshu.io/upload_images/12877063-7a72a4823ba3a298.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- `console.log()`方法，无论哪个浏览器，打印出的效果都是一样的。
- `console.info()`方法，ie 没有打印出来，即不支持这个属性。但是在谷歌和火狐上又略有区别：打印的结果是一样的，但是火狐控制台上，会在打印的结果前面添加一个类似 i 的小符号。
- `console.debug()`方法，谷歌和 opera 是不支持的，ie 和火狐是支持的。
  所以呢，既然三个方法功能是基本一样的，我们如果只想打印一些内容的话，还是老老实实的使用`console.log()`稳一点。当然了，这也抵不住你就使用火狐来 debug 呢！可是，考虑到如果你的代码库的某些打印信息需要给别的开发者看的话，还是用兼容性更好的稳一些。
  > 补充修正：chrome 并不是不支持 console.debug，只是默认日志级别不打印调试信息，把 verbose 勾上就好了 #三、console.clear()
  > 清除控制台打印的内容，并将光标回归到第一行
  > ![image.png](https://upload-images.jianshu.io/upload_images/12877063-bce23ac1897f5a67.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
  > 和我们点击控制台的这个清除按钮的效果一样 #四、console.assert(表达式 [,arg1, arg2……argn])打印断言
  > 第一个参数是用来判断是否打印断言的表达式，只有当表达式的值为 false 的时候，才会打印后续的参数：

```
const arr = [1, 2, 3];

// 打印断言，如果arr[0]的值不等于2，则打印提示信息
console.assert(arr[0] === 2, 'arr[0]的值不等于2');
```

![谷歌控制台.png](https://upload-images.jianshu.io/upload_images/12877063-47cfce0252e295bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![没有参数，打印字符串.png](https://upload-images.jianshu.io/upload_images/12877063-747740647ccf461e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 客户端的`console.assert()`打印断言，并不会阻塞后续代码的执行，只是在断言的表达式为 false 的时候，向控制台打印你的内容。
- 而在`node.js`中，值为假的断言将会导致一个`AssertionError`被抛出，使得代码执行被打断。这两者是有区别的。 #五、console.count() 打印计数
  输出他被调用了多少次。
  传递一个参数作为计数提示:

```
for (let i = 0; i < 10; i++) {
    console.count('我被调用了');
}
```

![谷歌控制台.png](https://upload-images.jianshu.io/upload_images/12877063-74a4a5c48eb4e72b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
简单修改一下：

```
for (let i = 0; i < 10; i++) {
    console.count(`我是${i}我被调用了`);
}
```

![打印效果.png](https://upload-images.jianshu.io/upload_images/12877063-a8d853db3b380b0c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 这个方法意思就是：向控制台写入在同一行使用相同标签调用 `count()` 的次数。
> 就是如果你给`count()`传递的参数值不一样，那么是分开计数的。
> 再看一个简单的示例：

```
function fun (name) {
    console.count(name)
}
fun('小米');
fun('小刚');
fun('小米');
```

![效果.png](https://upload-images.jianshu.io/upload_images/12877063-158e9454cfe1ff3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如果不传递参数，默认的计数提示标签是 default 字符串:

```
for (let i = 0; i < 10; i++) {
    // count()没传递提示标签
    console.count();
}
```

![效果.png](https://upload-images.jianshu.io/upload_images/12877063-9c22fb2fea8c9404.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
一般在某些循环中，如果我们想知道一个函数或者变量被执行或者调用了多少次的时候，可以使用`console.count()`方法，而通过传递提示标签，我们更可以清晰的知道一个函数分别被不同的情况调用了几次，从而帮助我们定位错误信息。 #六、console.time()和 console.timeEnd()打印计时
用来跟踪某一个操作的占用时长。
每一个计时器必须拥有唯一的名字，`time()`的参数名和`timeEnd()`的参数名要一样。
可以没有参数，默认计时提示为 default

```
// 立即启动计时器
console.time()

// 某些操作
for (let i = 0; i < 10000; i++) {
    // 某些操作
}

// 立即结束计时器，并输出计时结果
console.timeEnd()
```

![控制台打印效果.png](https://upload-images.jianshu.io/upload_images/12877063-cf75b6b42e1d1846.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
传递计时器提示：

```
// 立即启动计时器
console.time('time')

// 某些操作
for (let i = 0; i < 10000; i++) {
    // 某些操作
}

// 立即结束计时器，并输出计时结果
console.timeEnd('time')
```

![控制台打印效果.png](https://upload-images.jianshu.io/upload_images/12877063-40b6a7ea3e81176a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 页面中最多能同时运行 10,000 个计时器
- 该方法并不会将结算结果返回到 js 中，而只是能打印在控制台上。所以不能使用此方法在 js 中来作为普通计时器使用或者进行性能收集器的一部分。 #七、console.dir() 输出以 JavaScript 形式表示的指定对象
  如果正在记录的对象是 HTML 元素，将输出其以 DOM 形式表示的属性。
  打印一个对象：

```
// 一个对象
const obj = {
    name: '某某渣',
    age: 22,
    sex: '男'
}

// dir打印
console.dir(obj);

// log打印
console.log(obj);
```

![谷歌控制台效果.png](https://upload-images.jianshu.io/upload_images/12877063-8e9f0768439f94f3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
对于对象或者 json 等，console.log()和 console.dir()效果基本一样。
但是如果打印的是一个 dom 元素：

```
// dir打印
console.dir(document.body);

// log打印
console.log(document.body)
```

`console.dir()`会将 dom 的所有属性和事件都被打印出来：
![console.dir().png](https://upload-images.jianshu.io/upload_images/12877063-cee4e29c8e5dcfb6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
`console.log()`打印的就是 dom：
![console.log().png](https://upload-images.jianshu.io/upload_images/12877063-b7450982d9ea5b63.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) #八、console.dirxml(object)
如果可以，输出 object 子级元素的 XML 表示形式，否则输出其 JavaScript 表示形式。
在 HTML 和 XML 元素上调用 `console.dirxml()` 等同于调用` console.log()`。 #九、console.group() + console.groupEnd()

> 将控制台输出的内容进行分组
> 将打印的信息归类分组打印，并且可以展开、折叠。
> 这在输出大量数据的或许有用。

```
// console.groupCollapsed() + console.groupEnd()的形式，默认是折叠的
console.group('分第一组');
console.log('html')
console.dir({ type: '前端'}),
console.groupEnd('分第一组')

// console.group() + console.groupEnd() 默认是展开的
console.group('分第2组');
console.log('php')
console.dir({ type: '后台'}),
console.groupEnd('分第2组')
```

![谷歌打印效果.png](https://upload-images.jianshu.io/upload_images/12877063-b38e8cfa34fb8d78.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) #十、console.table()
可以将数组、对象等复杂类型的数据打印成表格的形式
打印简单的数组：

```
const arr = ['a', 'b'];
console.table(arr)
```

![效果.png](https://upload-images.jianshu.io/upload_images/12877063-9dca8971227f2310.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
打印复杂的数组：

```
const arr = [
   {
       name: '小明',
       age: 22,
       likes: ['跳舞', '上网']
   },
   {
       name: '小刚',
       age: 23,
       likes: ['撸码', '计算机']
   }
];

console.table(arr)
```

![效果.png](https://upload-images.jianshu.io/upload_images/12877063-aec5543711eb5dad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
打印对象：

```
const obj = {
    name: '小明',
    age: 22,
    likes: [
        {
            a: 1,
            b: 2
        },
        {
            a: 3,
            b: 4
        },
    ]
}

console.table(obj)
```

![对象效果.png](https://upload-images.jianshu.io/upload_images/12877063-d7af01b580f677bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) #十一、console.trace()
堆栈中调用此方法的路径
如果想要清楚地知道一个函数的调用轨迹，可以将此方法写在函数内部，便可以跟踪函数的调用轨迹，代码实现如下：

```
function test(name) {
    console.trace(`此处调用了${name}`)
}

function doSome (name) {
    test(name);
}

doSome('翠花');
```

![谷歌控制台打印.png](https://upload-images.jianshu.io/upload_images/12877063-91af81fa82d743eb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
此处打印出了 js 中调用 test()的所有堆栈位置。从上到下依次为最里层的调用一直到最外层调用。平时我们使用第三方库的时候，如果写法不对，经常可以在控制台看到我们的报错信息，并且像这样打印出了错误位置的堆栈信息。 #十二、console.warn()
打印一条警告信息

```
console.warn('我是一条警告')
```

![谷歌打印结果.png](https://upload-images.jianshu.io/upload_images/12877063-c78c5d19f1fbc862.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) #十三、console.error()打印错误

```
console.error('我这里出现了错误，我来告知用户')
```

![谷歌打印结果.png](https://upload-images.jianshu.io/upload_images/12877063-2eaa3caa438b6fe4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
该方法主要用来打印错误，打印结果的样式如上图。也没什么好说的，不过如果你开发第三方库的时候，可以用到。但是`throw`抛出错误的方式也会用到不少。 #十四、console.profile() 和 console.profileEnd()
新建一个性能分析器(基于 cpu 的使用情况)。用于函数性能分析的利器。
相对于复杂逻辑的 JavaScript 程序调优，console.profile() 和 console.profileEnd()新建性能分析器便派上用场

用法和 time 的一样，console.profile()开始，console.profileEnd()结束，需要传递一个参数作为标签使用，说俗了点就是为这个性能分析器起个名字。看下如下代码，我们测试几种不同 for 循环书写方式的耗时情况：

```
// 简单新建一个数组吧，新建一个一千万个成员为1的数组
let arr = new Array(10000000).fill(1);

// 第一种for循环书写方式
function fun1 () {
    for (let i = 0, len = arr.length; i < len; i++) {}
}

// 第二种for循环书写方式
function fun2 () {
    for (let i = arr.length; i --; ) {}
    fun1();
}

// 第三种for循环书写方式
function fun3 () {
    for (let i = 0, item; item = arr[i++]; ) {}
}

// 执行三个函数
function fun () {
    fun1();
    fun2();
    fun3();
}

// 立即开始一个性能分析器
console.profile('测试for循环');
fun();
//
console.profileEnd('测试for循环');
```

![谷歌控制台.png](https://upload-images.jianshu.io/upload_images/12877063-8186db0fffc31292.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在 javascript Profiler 面板中，打开性能分析器
![打开性能分析器.png](https://upload-images.jianshu.io/upload_images/12877063-815fabcd7e436208.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如果你没有上面红框标识的面板，那么点击右边的三个点，在下拉菜单中依次选择 More tools -> JavaScript Profiler 选项，就可以将该选项添加到上面的红框位置。然后点击该面板，进入对应内容：
![性能分析器.png](https://upload-images.jianshu.io/upload_images/12877063-db709a53c4141041.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后我们点开每一个函数看下具体的情况：
![函数具体的情况.png](https://upload-images.jianshu.io/upload_images/12877063-4f9eeb5b8d06e1ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 1 处，`Self Time`表示当前函数自身运行耗时，什么意思？就是说当前函数自身执行耗时，不包括当前函数中调用的其他函数运行耗时。
- 2 处，`Total Time`表示当前函数运行总耗时，包括了自身运行耗时+函数内部调用的其他函数的执行耗时。
- `Function`那一列，我们通过上图打开的`fun1`那一栏说明，`fun1`展开后的结果包括`fun`和`fun2`，这指的是函数`fun1`在函数`fun`和`fun2`中被调用执行的耗时。通过代码我们知道，`fun1`函数确实在`fun`函数和`fun2`个被调用过 1 次，所以这里展示了`fun`在这两处被调用执行的耗时时间。
- 每个函数行最右边还有会堆栈位置，点击即可进入`resouce`面板中该函数所在的文件位置。

如果你关注 fun1 函数的执行时间，你可以点击选中 fun1 这一行，然后点击上面的眼睛图标，将自动只为你展现 fun1 函数的信息：
![眼睛图标.png](https://upload-images.jianshu.io/upload_images/12877063-1a50c7c4f6fc6752.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 选中函数行，点击眼睛即针对性的展示当前函数。
- 选中函数和，如果点击 × 号，将会删除当前函数行。
- 选中函数行点击眼睛进入后，如果想返回到上述全部函数行的面板，可以点击上图刷新按钮。或者删除了函数行后也可以恢复如上图。
- 上图三个按钮只有在颜色变深的时候才可点击，眼睛和 × 号只有在选中函数行的情况下可点，刷新按钮在进入或者删除函数行之后可以点。

还有一点没介绍，就是该这种数据展示方式，是默认的方式：`Heavy(Bottom Up)`，即将所有执行的函数，按照耗时长度，从上到下降序排列，耗时的在最上面，不耗时的在最下面。但是他还有另外两种方式（`Chart `和 `Tree`），如下图：
![数据展示方式.png](https://upload-images.jianshu.io/upload_images/12877063-3a68bbb389168d8d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Tree型.png](https://upload-images.jianshu.io/upload_images/12877063-598bdd30c03853d3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
将每个函数行打开后，显示了该函数所调用的函数。这种数据分析的展示方式其实是，先展示最外层的函数，展开后，显示该函数所调用的所有函数，依次往里类推。每一行都展示该函数执行的耗时。其他操作同上。
![Chart.png](https://upload-images.jianshu.io/upload_images/12877063-0f0edec5930cc2b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 上部分蓝色区域为 cpu 占用的大体走势图，可以清晰地看到每个时间节点的 cpu 占用情况，是高是低一目了然。
- 下半部分为每个函数开始运行的时间节点。

如果点击上部分蓝色区域，还可以更细粒度查看当前事件的函数运行情况（在当前时间节点划分为更细的力度），如下图：
![点击上部分蓝色区域.png](https://upload-images.jianshu.io/upload_images/12877063-f9cbb4171a421f76.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
鼠标移入某个函数，还可以看到当前函数所运行的耗时情况，如下图：
![当前函数所运行的耗时情况.png](https://upload-images.jianshu.io/upload_images/12877063-b4673a8c55a2ffbb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
console.profile() 和 console.profileEnd()函数性能分析器的建立，给我们分析函数性能带来的非常大的便利，这对于我们检测程序运行瓶颈非常有帮助。 #十五、console.timeStamp('事件信息')

> 在 Performance(以前叫 Timeline)性能面板中的会话录制期间插入一条添加一个事件。
> 说到这个 console.timeStamp()方法，这个方法在我们进行性能调试的时候会用到。说到这个方法首先要提到 Performance 性能面板，因为该方法打印出来的结果需要在这个调试面板中查看，准确的来说，该方法是配合性能面板来调试的：

> 在 Perdormance 面板中，我们可以分析当前页面的性能，可以得知页面加载和用户交互相关的事件分析结果。关于 Performance 这块的内容，如果仔细说起来，内容是比较多的。这里暂且只介绍和 console.timeStamp 方法相关的内容。以后可以单独把这块拿出来细细分析和记录。

console.timeStamp 可以在时间轴上写入一个事件：

```
// 一些其他操作
for (let i = 0; i < 10000; i ++) {}

// 在录制会话期间插入的第一个事件
console.timeStamp('第一个循环完了')

// 一些其他操作
for (let i = 0; i < 10000; i ++) {}

// 在录制会话起价插入的第二个事件
console.timeStamp('第2个循环完了')
```

录制完会话后，我们输入移入下图红框左上方的黄色竖线上可以看到弹出一个提示框，上面标注了 Timestamp 提示：‘第一个循环完了’，并且还有该事件插入时的时间节点。
![Timestamp.png](https://upload-images.jianshu.io/upload_images/12877063-e07ee5904e4a94ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) #十六、console.markTimeline()
效果等同于`console.timeStamp()`，是`console.timeStamp()`以前的写法，已经淘汰了。 #十七、console.timeLine('标签参数')配合 console.timeLineEnd('标签参数')
录制一段时间的时间轴。
在 Performance 面板中，我们可以录制当前页面的会话信息，而通过 console.timeline 和 console.timelineEnd 可以只录制某一段时间的会话信息。

```
// 录制第一段时间的会话信息
console.timeline('测试循环100万相关的性能分析')
for (let i = 0; i < 1000000; i ++) {}
console.timelineEnd('测试循环100万相关的性能分析')


// 录制第二段时间的会话信息
console.timeline('测试循环1000万相关的性能分析')
for (let i = 0; i < 10000000; i ++) {}
console.timelineEnd('测试循环1000万相关的性能分析')
```

在我们的 Performance 面板中，点击开始录制当前页面，然后查看录制后的结果：
![Performance.png](https://upload-images.jianshu.io/upload_images/12877063-ff6d10c201e5d813.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Performance.png](https://upload-images.jianshu.io/upload_images/12877063-79144ad9a2e21fc8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
`console.timeline('参数标签')`和`console.timelineEnd('参数标签')`，两个方法需要接收相同的一个参数标签，就是一个标识而已。

这里会了这个用法之后，更多的是怎样在 Performance 中进行性能的分析，然后找出影响程序性能的瓶颈，这才是重要的。

> 原文链接：[调试第一步：让强大的 console 家族助你一臂之力](https://juejin.im/post/5b586ec06fb9a04fc436c9b3?tdsourcetag=s_pcqq_aiomsg)
