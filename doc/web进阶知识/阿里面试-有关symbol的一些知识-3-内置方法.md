> 相关文章：[【阿里面试】有关 symbol 的一些知识(1)-基础知识](https://www.jianshu.com/p/28917f8e1e38)
> [【阿里面试】有关 symbol 的一些知识(2)-实例](https://www.jianshu.com/p/222eb18862ff)
> [【阿里面试】有关 symbol 的一些知识(3)-内置方法](https://www.jianshu.com/p/e98c9dba7d83)

### 内置的 Symbol 值

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 `Symbol` 值，指向语言内部使用的方法。

#### 1. `Symbol.hasInstance`

对象的 `Symbol.hasInstance` 属性，指向一个内部方法。当其他对象使用 `instanceof` 运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo` 在语言内部，实际调用的是 `Foo[Symbol.hasInstance](foo)`。

```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass(); // true
```

`MyClass` 是一个类，`new MyClass()`会返回一个实例。该实例的 `Symbol.hasInstance` 方法，会在进行 `instanceof` 运算时自动调用，判断左侧的运算子是否为 `Array` 的实例

```js
class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}

// 等同于
const Even = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  },
};

1 instanceof Even; // false
2 instanceof Even; // true
12345 instanceof Even; // false
```

#### 2. `Symbol.isConcatSpreadable`

对象的 `Symbol.isConcatSpreadable` 属性等于一个布尔值，表示该对象用于 `Array.prototype.concat()`时，是否可以展开。

```js
let arr1 = ["c", "d"];
["a", "b"].concat(arr1, "e"); // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable]; // undefined

let arr2 = ["c", "d"];
arr2[Symbol.isConcatSpreadable] = false;
["a", "b"].concat(arr2, "e"); // ['a', 'b', ['c','d'], 'e']
```

上面代码说明，数组的默认行为是可以展开，`Symbol.isConcatSpreadable` 默认等于 `undefined`。该属性等于 true 时，也有展开的效果。

**类似数组的对象**正好相反，默认不展开。它的 `Symbol.isConcatSpreadable` 属性设为 true，才可以展开。

```js
let obj = { length: 2, 0: "c", 1: "d" };
["a", "b"].concat(obj, "e"); // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
["a", "b"].concat(obj, "e"); // ['a', 'b', 'c', 'd', 'e']
```

`Symbol.isConcatSpreadable` 属性也可以定义在类里面。

```js
class A1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}
class A2 extends Array {
  constructor(args) {
    super(args);
  }
  get [Symbol.isConcatSpreadable]() {
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2);
// [1, 2, 3, 4, [5, 6]]
```

注意，`Symbol.isConcatSpreadable` 的位置差异，A1 是定义在实例上，A2 是定义在类本身，效果相同。

#### 3. `Symbol.species`

对象的 `Symbol.species` 属性，指向一个构造函数。创建衍生对象时，会使用该属性。

```js
class MyArray extends Array {}

const a = new MyArray(1, 2, 3);
const b = a.map((x) => x);
const c = a.filter((x) => x > 1);

b instanceof MyArray; // true
c instanceof MyArray; // true
```

`Symbol.species` 属性就是为了解决这个问题而提供的。现在，我们可以为 MyArray 设置 `Symbol.species` 属性。

```js
class MyArray extends Array {
  // 由于定义了Symbol.species属性，创建衍生对象时就会使用这个属性返回的函数，作为构造函数。
  static get [Symbol.species]() {
    return Array;
  }

  // 默认的Symbol.species属性等同于下面的写法
  // static get [Symbol.species]() {
  //   return this;
  // }
}
```

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}

const a = new MyArray();
const b = a.map((x) => x);

b instanceof MyArray; // false
b instanceof Array; // true
```

```js
class T1 extends Promise {}

class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}

new T1((r) => r()).then((v) => v) instanceof T1; // true
new T2((r) => r()).then((v) => v) instanceof T2; // false
```

总之，`Symbol.species` 的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数。

它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能希望返回基类的实例，而不是子类的实例。

#### 4. `Symbol.match`

对象的 `Symbol.match` 属性，指向一个函数。当执行 `str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值。

```js
String.prototype.match(regexp);
// 等同于
regexp[Symbol.match](this);

class MyMatcher {
  [Symbol.match](string) {
    return "hello world".indexOf(string);
  }
}

"e".match(new MyMatcher()); // 1
```

#### 5. `Symbol.replace`

对象的 `Symbol.replace` 属性，指向一个方法，当该对象被 `String.prototype.replace` 方法调用时，会返回该方法的返回值。

```js
String.prototype.replace(searchValue, replaceValue);
// 等同于
searchValue[Symbol.replace](this, replaceValue);
```

```js
const x = {};
x[Symbol.replace] = (...s) => console.log(s);

"Hello".replace(x, "World"); // ["Hello", "World"]
```

`Symbol.replace` 方法会收到两个参数，第一个参数是 `replace` 方法正在作用的对象，上面例子是 Hello，第二个参数是替换后的值，上面例子是 World。

#### 6. `Symbol.search`

对象的 `Symbol.search` 属性，指向一个方法，当该对象被 `String.prototype.search` 方法调用时，会返回该方法的返回值。

```js
String.prototype.search(regexp);
// 等同于
regexp[Symbol.search](this);

class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
"foobar".search(new MySearch("foo")); // 0
```

#### 7. `Symbol.split`

对象的 `Symbol.split` 属性，指向一个方法，当该对象被 `String.prototype.split` 方法调用时，会返回该方法的返回值。

```js
String.prototype.split(separator, limit);
// 等同于
separator[Symbol.split](this, limit);
```

```js
// 使用Symbol.split方法，重新定义了字符串对象的split方法的行为，
class MySplitter {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    let index = string.indexOf(this.value);
    if (index === -1) {
      return string;
    }
    return [string.substr(0, index), string.substr(index + this.value.length)];
  }
}

"foobar".split(new MySplitter("foo"));
// ['', 'bar']

"foobar".split(new MySplitter("bar"));
// ['foo', '']

"foobar".split(new MySplitter("baz"));
// 'foobar'
```

#### 8. `Symbol.iterator`

对象的 `Symbol.iterator` 属性，指向该对象的默认遍历器方法。

```js
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable]; // [1, 2, 3]
```

对象进行 `for...of` 循环时，会调用 `Symbol.iterator` 方法，返回该对象的默认遍历器

```js
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while (this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for (let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

#### 9. `Symbol.toPrimitive`

对象的 `Symbol.toPrimitive` 属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

`Symbol.toPrimitive` 被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。

- Number：该场合需要转成数值
- String：该场合需要转成字符串
- Default：该场合可以转成数值，也可以转成字符串

```js
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return 123;
      case "string":
        return "str";
      case "default":
        return "default";
      default:
        throw new Error();
    }
  },
};

2 * obj; // 246
3 + obj; // '3default'
obj == "default"; // true
String(obj); // 'str'
```

#### 10. `Symbol.toStringTag`

对象的 `Symbol.toStringTag` 属性，指向一个方法。在该对象上面调用 `Object.prototype.toString` 方法时，如果这个属性存在，它的返回值会出现在 `toString` 方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制`[object Object]`或`[object Array]`中 `object` 后面的那个字符串。

```js
// 例一
({ [Symbol.toStringTag]: "Foo" }.toString());
// "[object Foo]"

// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return "xxx";
  }
}
let x = new Collection();
Object.prototype.toString.call(x); // "[object xxx]"
```

ES6 新增内置对象的 `Symbol.toStringTag` 属性值如下。

- `JSON[Symbol.toStringTag]`：'JSON'
- `Math[Symbol.toStringTag]`：'Math'
- Module 对象`M[Symbol.toStringTag]`：'Module'
- `ArrayBuffer.prototype[Symbol.toStringTag]`：'ArrayBuffer'
- `DataView.prototype[Symbol.toStringTag]`：'DataView'
- `Map.prototype[Symbol.toStringTag]`：'Map'
- `Promise.prototype[Symbol.toStringTag]`：'Promise'
- `Set.prototype[Symbol.toStringTag]`：'Set'
- `%TypedArray%.prototype[Symbol.toStringTag]`：'Uint8Array'等
- `WeakMap.prototype[Symbol.toStringTag]`：'WeakMap'
- `WeakSet.prototype[Symbol.toStringTag]`：'WeakSet'
- `%MapIteratorPrototype%[Symbol.toStringTag]`：'Map Iterator'
- `%SetIteratorPrototype%[Symbol.toStringTag]`：'Set Iterator'
- `%StringIteratorPrototype%[Symbol.toStringTag]`：'String Iterator'
- `Symbol.prototype[Symbol.toStringTag]`：'Symbol'
- `Generator.prototype[Symbol.toStringTag]`：'Generator'
- `GeneratorFunction.prototype[Symbol.toStringTag]`：'GeneratorFunction'

#### 11. `Symbol.unscopables`

对象的 `Symbol.unscopables` 属性，指向一个对象。该对象指定了使用 `with` 关键字时，哪些属性会被 `with` 环境排除。

```js
Array.prototype[Symbol.unscopables];
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   includes: true,
//   keys: true
// }

Object.keys(Array.prototype[Symbol.unscopables]);
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']
```

```js
// 没有 unscopables 时
class MyClass {
  foo() {
    return 1;
  }
}

var foo = function () {
  return 2;
};

with (MyClass.prototype) {
  foo(); // 1
}

// 有 unscopables 时
class MyClass {
  foo() {
    return 1;
  }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () {
  return 2;
};

with (MyClass.prototype) {
  foo(); // 2
}
```

上面代码通过指定 `Symbol.unscopables` 属性，使得 `with` 语法块不会在当前作用域寻找 `foo` 属性，即 `foo` 将指向外层作用域的变量。

> [MDN with 关键字](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with)

> 原文：[# [ECMAScript 6 入门](https://es6.ruanyifeng.com/)
> ](<https://es6.ruanyifeng.com/#docs/symbol>)
