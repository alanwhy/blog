> 相关文章：[【阿里面试】有关 symbol 的一些知识(1)-基础知识](https://www.jianshu.com/p/28917f8e1e38)
> [【阿里面试】有关 symbol 的一些知识(2)-实例](https://www.jianshu.com/p/222eb18862ff)
> [【阿里面试】有关 symbol 的一些知识(3)-内置方法](https://www.jianshu.com/p/e98c9dba7d83)

### 实例：消除魔术字符串

魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。

```js
function getArea(shape, options) {
  let area = 0;

  switch (shape) {
    // 字符串Triangle就是一个魔术字符串。
    // 它多次出现，与代码形成“强耦合”，不利于将来的修改和维护。
    case "Triangle":
      area = 0.5 * options.width * options.height;
      break;
    /* ... more code ... */
  }

  return area;
}

getArea("Triangle", { width: 100, height: 100 }); // 魔术字符串
```

常用的消除魔术字符串的方法，就是把它写成一个变量。

```js
// 把Triangle写成shapeType对象的triangle属性，这样就消除了强耦合。
const shapeType = {
  triangle: "Triangle",
};

function getArea(shape, options) {
  let area = 0;
  switch (shape) {
    case shapeType.triangle:
      area = 0.5 * options.width * options.height;
      break;
  }
  return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });
```

如果仔细分析，可以发现 `shapeType.triangle` 等于哪个值并不重要，只要确保不会跟其他 `shapeType` 属性的值冲突即可。因此，这里就很适合改用 `Symbol` 值。

```js
const shapeType = {
  triangle: Symbol(),
};
```

### 实例：模块的 Singleton 模式

Singleton 模式指的是调用一个类，任何时候返回的都是同一个实例。

对于 Node 来说，模块文件可以看成是一个类。怎么保证每次执行这个模块文件，返回的都是同一个实例呢？

很容易想到，可以把实例放到顶层对象 `global`。

```js
// mod.js
function A() {
  this.foo = "hello";
}

if (!global._foo) {
  global._foo = new A();
}

module.exports = global._foo;
```

```js
// 变量a任何时候加载的都是A的同一个实例。
const a = require("./mod.js");
console.log(a.foo);
```

但是，这里有一个问题，全局变量 `global._foo` 是可写的，任何文件都可以修改。

```js
// 会使得加载mod.js的脚本都失真
global._foo = { foo: "world" };

const a = require("./mod.js");
console.log(a.foo);
```

为了防止这种情况出现，我们就可以使用 `Symbol`。

```js
// mod.js
const FOO_KEY = Symbol.for("foo");

function A() {
  this.foo = "hello";
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];
```

上面代码中，可以保证 `global[FOO_KEY]` 不会被无意间覆盖，但还是可以被改写。

```js
global[Symbol.for("foo")] = { foo: "world" };

const a = require("./mod.js");
```

如果键名使用 `Symbol` 方法生成，那么外部将无法引用这个值，当然也就无法改写。

```js
// mod.js
const FOO_KEY = Symbol("foo");

// 后面代码相同 ……
```

上面代码将导致其他脚本都无法引用 `FOO_KEY`。但这样也有一个问题，就是如果多次执行这个脚本，每次得到的 `FOO_KEY` 都是不一样的。虽然 Node 会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是绝对可靠。

> 原文：[# [ECMAScript 6 入门](https://es6.ruanyifeng.com/)
> ](https://es6.ruanyifeng.com/#docs/symbol)
