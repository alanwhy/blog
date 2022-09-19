<!--
 * @Author: wuhaoyuan
 * @Date: 2022-09-19 09:39:54
 * @LastEditTime: 2022-09-19 10:14:33
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/web功能代码/盘点一些好用的JS单行代码.md
-->

# 盘点一些好用的 JS 单行代码

## DOM

检查一个元素是否被聚焦

```JS
const hasFocus = (ele) => ele === document.activeElement
```

获取一个元素的所有兄弟元素

```JS
const siblings = (ele) =>
  .slice.call(ele.parentNode.children).filter((child) => child !== ele);
```

获取选中文本

```JS
const getSelectedText = () => window.getSelection().toString();
```

回到上一页

```js
history.back();
// Or
history.go(-1);
```

将 cookie 转换为对象

```js
const cookies = document.cookie
  .split(";")
  .map((item) => item.split("="))
  .reduce((acc, [k, v]) => (acc[k.trim().replace('"', "")] = v) && acc, {});
```

## 数组

比较两个数组

```js
// `a` 和 `b` 都是数组
const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 或者
const isEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

// 事例
isEqual([1, 2, 3], [1, 2, 3]); // true
isEqual([1, 2, 3], [1, "2", 3]); // false
```

将对象数组转换为单个对象

```js
const toObject = (arr, key) =>
  arr.reduce((a, b) => ({ ...a, [b[key]]: b }), {});
// Or
const toObject = (arr, key) =>
  Object.fromEntries(arr.map((it) => [it[key], it]));

// 事例
toObject(
  [
    { id: "1", name: "Alpha", gender: "Male" },
    { id: "2", name: "Bravo", gender: "Male" },
    { id: "3", name: "Charlie", gender: "Female" },
  ],
  "id"
);
/*
{
'1': { id: '1', name: 'Alpha', gender: 'Male' },
'2': { id: '2', name: 'Bravo', gender: 'Male' },
'3': { id: '3', name: 'Charlie', gender: 'Female' }
}
*/
```

根据对象数组的属性进行计数

```js
const countBy = (arr, prop) =>
  arr.reduce(
    (prev, curr) => ((prev[curr[prop]] = ++prev[curr[prop]] || 1), prev),
    {}
  );

// 事例
countBy(
  [
    { branch: "audi", model: "q8", year: "2019" },
    { branch: "audi", model: "rs7", year: "2020" },
    { branch: "ford", model: "mustang", year: "2019" },
    { branch: "ford", model: "explorer", year: "2020" },
    { branch: "bmw", model: "x7", year: "2020" },
  ],
  "branch"
);

// { 'audi': 2, 'ford': 2, 'bmw': 1 }
```

检查数组是否为空

```js
const isNotEmpty = (arr) => Array.isArray(arr) && Object.keys(arr).length > 0;

// 事例
isNotEmpty([]); // false
isNotEmpty([1, 2, 3]); // true
```

## 对象

检查多个对象是否相等

```js
const isEqual = (...objects) =>
  objects.every((obj) => JSON.stringify(obj) === JSON.stringify(objects[0]));
// 事例

console.log(isEqual({ foo: "bar" }, { foo: "bar" })); // true
console.log(isEqual({ foo: "bar" }, { bar: "foo" })); // false
```

从对象数组中提取指定属性的值

```js
const pluck = (objs, property) => objs.map((obj) => obj[property]);
// Example
const aa = pluck(
  [
    { name: "小智", age: 20 },
    { name: "大志", age: 25 },
    { name: "王大志", age: 30 },
  ],
  "name"
);
// [ '小智', '大志', '王大志' ]
```

反转对象的键和值

```js
const invert = (obj) =>
  Object.keys(obj).reduce((res, k) => Object.assign(res, { [obj[k]]: k }), {});
// 或
const invert = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
// 事例
invert({ a: "1", b: "2", c: "3" }); // { 1: 'a', 2: 'b', 3: 'c' }
```

从对象中删除所有 `null` 和 `undefined` 的属性

```js
const removeNullUndefined = (obj) =>
  Object.entries(obj).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

// 或

const removeNullUndefined = (obj) =>
  Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

// 或

const removeNullUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

// 例子
removeNullUndefined({
  foo: null,
  bar: undefined,
  fuzz: 42,
});
// { fuzz: 42 }
```

根据对象的属性对其进行排序

```js
Object.keys(obj)
  .sort()
  .reduce((p, c) => ((p[c] = obj[c]), p), {});

// 事例
const colors = {
  white: "#ffffff",
  black: "#000000",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
};

sort(colors);

/*
{
  black: '#000000',
  blue: '#0000ff',
  green: '#008000',
  red: '#ff0000',
  white: '#ffffff',
}
*/
```

检查一个对象是否是 `Promise`

```js
const isPromise = (obj) =>
  !!obj &&
  (typeof obj === "object" || typeof obj === "function") &&
  typeof obj.then === "function";
```

## 字符串

检查路径是否是相对路径

```js
const isRelative = (path) => !/^([a-z]+:)?[\\/]/i.test(path);

// 例子
isRelative("/foo/bar/baz"); // false
isRelative("C:\\foo\\bar\\baz"); // false
isRelative("foo/bar/baz.txt"); // true
isRelative("foo.md"); // true
```

将字符串的第一个字符改为小写

```js
const lowercaseFirst = (str) => `${str.charAt(0).toLowerCase()}${str.slice(1)}`;

// 例子
lowercaseFirst("Hello World"); // 'hello World'
```

重复一个字符串

```js
const repeat = (str, numberOfTimes) => str.repeat(numberOfTimes);

// 例子
repeat("ab", 3);
// ababab
```

## 其它

检查代码是否在 Node.js 中运行

```js
const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;
```

检查代码是否在浏览器中运行

```js
const isBrowser = typeof window === "object" && typeof document === "object";
```

将 URL 参数转换为对象

```js
const getUrlParams = (query) =>
  Array.from(new URLSearchParams(query)).reduce(
    (p, [k, v]) =>
      Object.assign({}, p, {
        [k]: p[k] ? (Array.isArray(p[k]) ? p[k] : [p[k]]).concat(v) : v,
      }),
    {}
  );

// 例子
getUrlParams(location.search); // Get the parameters of the current URL
getUrlParams("foo=Foo&bar=Bar"); // { foo: "Foo", bar: "Bar" }

// Duplicate key
getUrlParams("foo=Foo&foo=Fuzz&bar=Bar"); // { foo: ["Foo", "Fuzz"], bar: "Bar" }
```

黑暗检测模式

```js
const isDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
```

拷贝到剪切板

```js
const copyToClipboard = (text) => navigator.clipboard.writeText(text);

// 例子
copyToClipboard("Hello World");
```

将 RGB 转换为十六进制

```js
const rgbToHex = (r, g, b) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

// 例子
rgbToHex(0, 51, 255); // #0033ff
```

生成随机 IP 地址

```js
const randomIp = () =>
  Array(4)
    .fill(0)
    .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
    .join(".");

// 例子
randomIp(); // 175.89.174.131
```

使用 Node crypto 模块生成随机字符串

```js
const randomStr = () => require("crypto").randomBytes(32).toString("hex");
```
