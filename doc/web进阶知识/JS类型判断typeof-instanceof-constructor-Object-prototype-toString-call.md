<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 10:00:23
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/web进阶知识/JS类型判断typeof、instanceof、constructor、Object-prototype-toString-call().md
-->

### 一、JavaScript 数据类型

JavaScript 数据类型有两种，分别是基本数据类型和引用数据类型。

**基本数据类型**

- Number
- String
- Boolean
- Undefined
- Null
- Symbol (ES6 新增，表示独一无二的值)

**引用数据类型**

- Object
- Function
- Array

### 二、检验数据类型

![image.png](https://upload-images.jianshu.io/upload_images/12877063-e2ade0bebcbd8797.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 1.typeof

这应该初学者首次接触的类型判断方法了，它返回一个表示数据类型的字符串，返回结果包括：

```js
typeof Symbol();
// symbol  正确
typeof "";
// string 正确
typeof 1;
// number正确
typeof true;
//boolean 正确
typeof undefined;
//undefined 正确
typeof new Function();
// function 正确
typeof null;
//object 无效
typeof [];
//object 无效
typeof new Date();
//object 无效
typeof new RegExp();
//object 无效
```

不能判断 array 和 null

**typeof 缺点**
可以看到 `Date` 和 `RegExp` 对象都只是被是被成了 `object` 对象，也就是说除 `function` 以外的对象都会被识别成 `object` ，这样显然是不合理的，这时就需要 `instanceof` 来进行判断。

###### 2.instanceof

`instanceof`运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。简单来说就是 `instanceof` 是用来判断 A 是否为 B 的实例，表达式为

> A (object) instanceof B (constructor)

如果 A 是 B 的实例，则返回 true,否则返回 false。

```javascript
// 定义构造函数
function C() {}
function D() {}

var o = new C();

o instanceof C; // true，因为 Object.getPrototypeOf(o) === C.prototype

o instanceof D; // false，因为 D.prototype 不在 o 的原型链上

o instanceof Object; // true，因为 Object.prototype.isPrototypeOf(o) 返回 true

C.prototype instanceof Object; // true，同上

C.prototype = {};

var o2 = new C();

o2 instanceof C; // true

o instanceof C; // false，C.prototype 指向了一个空对象,这个空对象不在 o 的原型链上.

D.prototype = new C(); // 继承
var o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true 因为 C.prototype 现在在 o3 的原型链上
```

现在就可以判断不同类别的对象了

```js
[] instanceof Array; //true
{} instanceof Object;//true
new Date() instanceof Date;//true
new RegExp() instanceof RegExp//true
```

**instanceof 的缺点**

- 是否处于原型链上的判断方法不严谨

instanceof 方法判断的是是否处于原型链上，而不是是不是处于原型链最后一位，所以会出现下面这种情况：

```javascript
var arr = [1, 2, 3];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true
function fn() {}
console.log(fn instanceof Function); // true
console.log(fn instanceof Object); // true
```

因为所有原型链的尽头都是 object，所以就造成了这种状况。当你自定义了一个类 A，并且继承了一个原生类 B，这个时候检测结果未必准确：

```js
A instanceof A; // true
A instanceof B; // true
A instanceof Object; //true
```

- 无法判断字面量方式创建的基本数据类型

对于基本数据类型来说，字面量方式创建出来的结果和实例方式创建的是有一定区别的

```js
console.log(1 instanceof Number); //false
console.log(new Number(1) instanceof Number); //true
```

从严格意义上来讲，只有实例创建出来的结果才是标准的对象数据类型值，也是标准的 Number 这个类的一个实例；对于字面量方式创建出来的结果是基本的数据类型值，不是严谨的实例，但是由于 JS 的松散特点，导致了可以使用 Number.prototype 上提供的方法。

- 无法检测 null 和 undefined

对于特殊的数据类型 `null` 和 `undefined`，他们的所属类是 `Null` 和 `Undefined`，但是浏览器把这两个类保护起来了，不允许我们在外面访问使用。

![image.png](https://upload-images.jianshu.io/upload_images/12877063-efd5a44cc57e15f1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 3.constructor

`constructor` 作用和 `instanceof` 非常相似。但 `constructor` 检测 `Object` 与 `instanceof` 不一样，还可以处理基本数据类型的检测。

```js
var aa = [1, 2];
console.log(aa.constructor === Array); //true
console.log(aa.constructor === RegExp); //false
console.log((1).constructor === Number); //true
var reg = /^$/;
console.log(reg.constructor === RegExp); //true
console.log(reg.constructor === Object); //false
```

**constructor 的缺点**

- 无法检测 null 和 undefined

null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。

- 不稳定

函数的 `constructor` 是不稳定的，这个主要体现在把类的原型进行重写，在重写的过程中很有可能出现把之前的 `constructor` 给覆盖了，这样检测出来的结果就是不准确的，由此可知 `instanceof` 同样也存在这个问题。

```js
function Fn() {}
Fn.prototype = new Array();
var f = new Fn();
console.log(f.constructor); //Array
```

###### 4.Object.prototype.toString.call()

这就是大名鼎鼎的全能方法，最准确最常用，据 MDN 描述

> 每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString() 方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中 type 是对象的类型。

在 `Number`、`String`，`Boolean`，`Array`，`RegExp`、`Date`、`Function` 等对象上 `toString()` 方法都是被重写过了的，会按照一定的规则返回字符串。但是在 `object` 对象上，这个方式是返回当前方法执行的主体（方法中的`this`）所属类的详细信息即`[object Object]`,其中第一个 object 代表当前实例是对象数据类型的(这个是固定的 `object`)，第二个 `Object` 代表的是 `this` 所属的类型。

为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数，称为 `thisArg`。

```javascript
Object.prototype.toString.call(""); // [object String]
Object.prototype.toString.call(1); // [object Number]
Object.prototype.toString.call(true); // [object Boolean]
Object.prototype.toString.call(undefined); // [object Undefined]
Object.prototype.toString.call(null); // [object Null]
Object.prototype.toString.call(new Function()); // [object Function]
Object.prototype.toString.call(new Date()); // [object Date]
Object.prototype.toString.call([]); // [object Array]
Object.prototype.toString.call(new RegExp()); // [object RegExp]
Object.prototype.toString.call(new Error()); // [object Error]
Object.prototype.toString.call(document); // [object HTMLDocument]
Object.prototype.toString.call(window); //[object global] window是全局对象global的引用
```

> 原文链接：[JavaScript 数据类型与类型判断详解](https://mp.weixin.qq.com/s/4BwD64yx2bMng5nd9aDafw)
