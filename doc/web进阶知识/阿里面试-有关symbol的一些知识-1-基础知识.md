> 相关文章：[【阿里面试】有关 symbol 的一些知识(1)-基础知识](https://www.jianshu.com/p/28917f8e1e38)
> [【阿里面试】有关 symbol 的一些知识(2)-实例](https://www.jianshu.com/p/222eb18862ff)
> [【阿里面试】有关 symbol 的一些知识(3)-内置方法](https://www.jianshu.com/p/e98c9dba7d83)

### 作用

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入`Symbol`的原因。

### 简介

ES6 引入了一种新的原始数据类型`Symbol`，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：`undefined`、`null`、布尔值（`Boolean`）、字符串（`String`）、数值（`Number`）、对象（`Object`）。

```js
let s = Symbol();

typeof s;
// "symbol"
```

注意，`Symbol`函数前不能使用`new`命令，否则会报错。这是因为生成的 `Symbol` 是一个原始类型的值，不是对象。

也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

`Symbol` 函数可以接受一个字符串作为参数，表示对 `Symbol` 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```js
let s1 = Symbol("foo");
let s2 = Symbol("bar");

s1; // Symbol(foo)
s2; // Symbol(bar)

s1.toString(); // "Symbol(foo)"
s2.toString(); // "Symbol(bar)"
```

如果 `Symbol` 的参数是一个对象，就会调用该对象的 `toString` 方法，将其转为字符串，然后才生成一个 `Symbol` 值。

```js
const obj = {
  toString() {
    return "abc";
  },
};
const sym = Symbol(obj);
sym; // Symbol(abc)
```

注意，`Symbol` 函数的参数只是表示对当前 `Symbol` 值的描述，因此相同参数的 `Symbol` 函数的返回值是不相等的。

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2; // false

// 有参数的情况
let s1 = Symbol("foo");
let s2 = Symbol("foo");

s1 === s2; // false
```

`Symbol` 值不能与其他类型的值进行运算，会报错。

```js
let sym = Symbol("My symbol");

"your symbol is " + sym;
// TypeError: can't convert symbol to string
`your symbol is ${sym}`;
// TypeError: can't convert symbol to string
```

但是，`Symbol` 值可以显式转为字符串。

```js
let sym = Symbol("My symbol");

String(sym); // 'Symbol(My symbol)'
sym.toString(); // 'Symbol(My symbol)'
```

另外，`Symbol` 值也可以转为布尔值，但是不能转为数值。

```js
let sym = Symbol();
Boolean(sym); // true
!sym; // false

if (sym) {
  // ...
}

Number(sym); // TypeError
sym + 2; // TypeError
```

### `Symbol.prototype.description`

ES2019 提供了一个实例属性 `description`，直接返回 `Symbol` 的描述。

```js
const sym = Symbol("foo");

sym.description; // "foo"
```

### 作为属性名的 `Symbol`

由于每一个 `Symbol` 值都是不相等的，这意味着 `Symbol` 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，**能防止某一个键被不小心改写或覆盖**。

```js
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = "Hello!";

// 第二种写法
let a = {
  [mySymbol]: "Hello!",
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: "Hello!" });

// 以上写法都得到同样结果
a[mySymbol]; // "Hello!"
```

注意，`Symbol` 值作为对象属性名时，不能用点运算符

```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = "Hello!";
a[mySymbol]; // undefined
a["mySymbol"]; // "Hello!"
```

上面代码中，因为点运算符后面总是字符串，所以不会读取 mySymbol 作为标识名所指代的那个值，导致 a 的属性名实际上是一个字符串，而不是一个 Symbol 值。

在对象的内部，使用 `Symbol` 值定义属性时，`Symbol` 值必须放在方括号之中。

```js
let s = Symbol();

let obj = {
  [s]: function (arg) { ... }
};

obj[s](123);
```

上面代码中，如果 s 不放在方括号中，该属性的键名就是字符串 s，而不是 s 所代表的那个 `Symbol` 值。

采用增强的对象写法，上面代码的 obj 对象可以写得更简洁一些。

```js
let obj = {
  [s](arg) { ... }
};
```

`Symbol` 类型还可以用于定义一组常量，保证这组常量的值都是不相等的。

```js
const log = {};

log.levels = {
  DEBUG: Symbol("debug"),
  INFO: Symbol("info"),
  WARN: Symbol("warn"),
};
console.log(log.levels.DEBUG, "debug message"); // Symbol(debug) "debug message"
console.log(log.levels.INFO, "info message"); // Symbol(info) "info message"
```

```js
const COLOR_RED = Symbol();
const COLOR_GREEN = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error("Undefined color");
  }
}
```

常量使用 `Symbol` 值最大的好处，就是**其他任何值都不可能有相同的值**了，因此可以保证上面的 `switch` 语句会按设计的方式工作。

还有一点需要注意，`Symbol` 值作为属性名时，该属性还是公开属性，不是私有属性。

### 属性名的遍历

`Symbol` 作为属性名，遍历对象的时候，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。

但是，它也不是私有属性，有一个 `Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 `Symbol` 属性名。该方法返回一个**数组**，成员是当前对象的所有用作属性名的 `Symbol` 值。

```js
const obj = {};
let a = Symbol("a");
let b = Symbol("b");

obj[a] = "Hello";
obj[b] = "World";

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols;
// [Symbol(a), Symbol(b)]
```

```js
const obj = {};
const foo = Symbol("foo");

obj[foo] = "bar";

for (let i in obj) {
  console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj); // []
Object.getOwnPropertySymbols(obj); // [Symbol(foo)]
```

另一个新的 API，`Reflect.ownKeys()`方法可以返回所有类型的键名，包括常规键名和 `Symbol` 键名。

```js
let obj = {
  [Symbol("my_key")]: 1,
  enum: 2,
  nonEnum: 3,
};

Reflect.ownKeys(obj);
//  ["enum", "nonEnum", Symbol(my_key)]
```

由于以 `Symbol` 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

```js
let size = Symbol("size");

class Collection {
  constructor() {
    this[size] = 0;
  }

  add(item) {
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) {
    return instance[size];
  }
}

let x = new Collection();
Collection.sizeOf(x); // 0

x.add("foo");
Collection.sizeOf(x); // 1

Object.keys(x); // ['0']
Object.getOwnPropertyNames(x); // ['0']
Object.getOwnPropertySymbols(x); // [Symbol(size)]
```

对象 x 的 size 属性是一个 `Symbol` 值，所以 `Object.keys(x)`、`Object.getOwnPropertyNames(x)`都无法获取它。这就造成了一种非私有的内部方法的效果。

### `Symbol.for()`，`Symbol.keyFor()`

我们希望重新使用同一个 `Symbol` 值，`Symbol.for()`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 `Symbol` 值。如果有，就返回这个 `Symbol` 值，否则就新建一个以该字符串为名称的 `Symbol` 值，并将其注册到全局。

```js
let s1 = Symbol.for("foo");
let s2 = Symbol.for("foo");

s1 === s2; // true
```

`Symbol.for()`与 `Symbol()`这两种写法，都会生成新的 `Symbol`。

它们的区别是，前者**会被登记在全局环境中供搜索**，后者不会。`Symbol.for()`不会每次调用就返回一个新的 `Symbol` 类型的值，而是会先检查给定的 key 是否已经存在，如果不存在才会新建一个值。

比如，如果你调用 `Symbol.for("cat")`30 次，每次都会返回同一个 `Symbol` 值，但是调用 `Symbol("cat")`30 次，会返回 30 个不同的 `Symbol` 值。

`Symbol.keyFor()`方法返回一个**已登记**的 `Symbol` 类型值的 key。

```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1); // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2); // undefined
```

注意，`Symbol.for()`为 `Symbol` 值登记的名字，是全局环境的，不管有没有在全局环境运行

```js
function foo() {
  return Symbol.for("bar");
}

const x = foo();
const y = Symbol.for("bar");
console.log(x === y); // true
```

`Symbol.for()`的这个全局登记特性，可以用在不同的 iframe 或 service worker 中取到同一个值。

```js
iframe = document.createElement("iframe");
iframe.src = String(window.location);
document.body.appendChild(iframe);

// iframe 窗口生成的 Symbol 值，可以在主页面得到。
iframe.contentWindow.Symbol.for("foo") === Symbol.for("foo");
// true
```

> 原文：[# [ECMAScript 6 入门](https://es6.ruanyifeng.com/)
> ](https://es6.ruanyifeng.com/#docs/symbol)
