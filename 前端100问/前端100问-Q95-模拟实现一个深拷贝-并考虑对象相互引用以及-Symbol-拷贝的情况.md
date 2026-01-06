### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [模拟实现一个深拷贝，并考虑对象相互引用以及 Symbol 拷贝的情况](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/148)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

主要问题是

1. `symbol` 作为 key，不会被遍历到，所以 stringify 和 parse 是不行的
2. 有环引用，stringify 和 parse 也会报错

我们另外用 `getOwnPropertySymbols` 可以获取 symbol key 可以解决问题 1，用集合记忆曾经遍历过的对象可以解决问题 2。当然，还有很多数据类型要独立去拷贝。比如拷贝一个 `RegExp`，lodash 是最全的数据类型拷贝了，有空可以研究一下

```js
function deepCopy(target, cache = new Set()) {
  if (typeof target !== "object" || cache.has(target)) {
    return target;
  }
  if (Array.isArray(target)) {
    target.map((t) => {
      cache.add(t);
      return t;
    });
  } else {
    return [
      ...Object.keys(target),
      ...Object.getOwnPropertySymbols(target),
    ].reduce(
      (res, key) => {
        cache.add(target[key]);
        res[key] = deepCopy(target[key], cache);
        return res;
      },
      target.constructor !== Object
        ? Object.create(target.constructor.prototype)
        : {}
    );
  }
}
```

另外，如果不考虑用 symbol 做 key，还有两种黑科技深拷贝，可以解决环引用的问题，比 stringify 和 parse 优雅强一些

```js
function deepCopyByHistory(target) {
  const prev = history.state;
  history.replaceState(target, document.title);
  const res = history.state;
  history.replaceState(prev, document.title);
  return res;
}

async function deepCopyByMessageChannel(target) {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port2.onmessage = (ev) => resolve(ev.data);
    channel.port1.postMessage(target);
  }).then((data) => data);
}
```

无论哪种方法，它们都有一个共性：**失去了继承关系**，所以剩下的需要我们手动补上去了，故有 `Object.create(target.constructor.prototype)`的操作

##### 方法二

```js
const symbolName = Symbol();
const obj = {
  objNumber: new Number(1),
  number: 1,
  objString: new String("ss"),
  string: "stirng",
  objRegexp: new RegExp("\\w"),
  regexp: /w+/g,
  date: new Date(),
  function: function () {},
  array: [{ a: 1 }, 2],
  [symbolName]: 111,
};
obj.d = obj;

const isObject = (obj) =>
  obj !== null && (typeof obj === "object" || typeof obj === "function");
const isFunction = (obj) => typeof obj === "function";
function deepClone(obj, hash = new WeakMap()) {
  if (hash.get(obj)) {
    // 环处理
    return hash.get(obj);
  }
  if (!isObject(obj)) {
    return obj;
  }

  if (isFunction(obj)) {
    // function返回原引用
    return obj;
  }

  let cloneObj;

  const Constructor = obj.constructor;

  switch (Constructor) {
    case Boolean:
    case Date:
      return new Date(+obj);
    case Number:
    case String:
    case RegExp:
      return new Constructor(obj);
    default:
      cloneObj = new Constructor();
      hash.set(obj, cloneObj);
  }

  [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ].forEach((k) => {
    cloneObj[k] = deepClone(obj[k], hash);
  });
  return cloneObj;
}

const o = deepClone(obj);
console.log(o.objNumber === obj.objNumber);
console.log(o.number === obj.number);
console.log(o.objString === obj.objString);
console.log(o.string === obj.string);
console.log(o.objRegexp === obj.objRegexp);
console.log(o.regexp === obj.regexp);
console.log(o.date === obj.date);
console.log(o.function === obj.function);
console.log(o.array[0] === obj.array[0]);
console.log(o[symbolName] === obj[symbolName]);
```
