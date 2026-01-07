# 一、问题描述

将一个数组（或请求返回的 json 结果为数组），如

```js
a  = [0，1，2，3，4]
```

赋值给另一个空的数组

```js
b = [];
```

会出现如果修改 a 或 b 中的数据，a 和 b 都会发生改变，那么该怎么解决呢？ #二、错误原因
数组是一种引用数据类型，数组引用变量只是一个引用，数组元素和数组变量在内存里是分开存放的
实际的数组元素被存储在堆（heap）内存中；数组引用变量是一个引用类型的变量，被存储在栈（stack）内存中。

- 基本类型：基本的数据类型有：undefined，boolean，number，string，null。 基本类型存放在栈区，访问是按值访问的，就是说你可以操作保存在变量中的实际的值。
- 引用类型：引用类型指的是对象。可以拥有属性和方法，并且我们可以修改其属性和方法。引用对象存放的方式是：在栈中存放对象变量标示名称和该对象在堆中的存放地址，在堆中存放数据。

对象使用的是引用赋值。当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在堆中的地址，而不是堆中的数据。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。 #三、解决办法

### 3.1、push()

```js
for (let i = 0; i < a.length; i++) {
  b.push(a[i]);
}
```

貌似并不是很好用

### 3.2、concat()

```js
let b = [].concat(a);
```

貌似也不是很好用

### 3.3、JSON.parse & JSON.stringify

```javascript
let b = JSON.parse(JSON.stringify(a));
```

好用！就是他了！
原理：实现对象的深拷贝（利用`JSON.stringify` 将 js 对象序列化（JSON 字符串），再使用`JSON.parse`来反序列化(还原)js 对象）
戳：[JSON.parse()和 JSON.stringify()用法解析](https://blog.csdn.net/qq_24122593/article/details/53046525)

---

2018.12.09 更新
深拷贝存在的坑

> 原文链接：[关于 JSON.parse(JSON.stringify(obj))实现深拷贝应该注意的坑](https://www.jianshu.com/p/b084dfaad501)
> 荐读：[javaScript 中浅拷贝和深拷贝的实现](https://github.com/wengjq/Blog/issues/3)

- 如果 obj 里面有时间对象，则`JSON.stringify`后再`JSON.parse`的结果，时间将只是字符串的形式。而不是时间对象；
- 如果 obj 里有`RegExp`、`Error`对象，则序列化的结果将只得到空对象；
- 如果 obj 里有函数，`undefined`，则序列化的结果会把函数或 `undefined`丢失；
- 如果 obj 里有`NaN`、`Infinity`和`-Infinity`，则序列化的结果会变成`null`；
- `JSON.stringify()`只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用`JSON.parse(JSON.stringify(obj))`深拷贝后，会丢弃对象的`constructor`；
- 如果对象中存在循环引用的情况也无法正确实现深拷贝；
  可以通过封装方法来解决以上的坑，代码如下：

```js
function  deepClone(data) {
      const type = this.judgeType(data);
      let obj;
      if (type === 'array') {
        obj = [];
      } else if (type === 'object') {
        obj = {};
      } else {
    // 不再具有下一层次
        return data;
      }
      if (type === 'array') {
        // eslint-disable-next-line
        for (let i = 0, len = data.length; i < len; i++) {
          obj.push(this.deepClone(data[i]));
        }
      } else if (type === 'object') {
        // 对原型上的方法也拷贝了....
        // eslint-disable-next-line
        for (const key in data) {
          obj[key] = this.deepClone(data[key]);
        }
      }
      return obj;
    },


function  judgeType(obj) {
  // tostring会返回对应不同的标签的构造函数
      const toString = Object.prototype.toString;
      const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
      };
      if (obj instanceof Element) {
        return 'element';
      }
      return map[toString.call(obj)];
    },
```

---

2019.01.10 更新
使用第三方的库进行深拷贝：[lodash](https://www.lodashjs.com/)
该函数库也有提供`_.cloneDeep`用来做 Deep Copy

```js
var _ = require("lodash");
var obj1 = {
  a: 1,
  b: { f: { g: 1 } },
  c: [1, 2, 3],
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);
// false
```
