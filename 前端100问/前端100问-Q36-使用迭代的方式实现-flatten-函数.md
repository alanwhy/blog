### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [使用迭代的方式实现 flatten 函数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/54)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```js
let arr = [1, 2, [3, 4, 5, [6, 7], 8], 9, 10, [11, [12, 13]]];

// some() 方法用于检测数组中的元素是否满足指定条件（函数提供）
// some() 不会对空数组进行检测。
// some() 不会改变原始数组。
// array.some(function(currentValue,index,arr),thisValue)
const flatten = function (arr) {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};

console.log(flatten(arr));

// 递归的实现(ES6简写)
// reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
const flatten = (array) =>
  array.reduce(
    (acc, cur) =>
      Array.isArray(cur) ? [...acc, ...flatten(cur)] : [...acc, cur],
    []
  );
```

关于 reduce 的使用

```js
var aa = [1, 2, 3, 4, 5];

/**
 * @parmas total 必需。初始值, 或者计算结束后的返回值。
 * @parmas currentValue 必需。当前元素
 * @parmas currentIndex 可选。当前元素的索引
 * @parmas arr 可选。当前元素的索引
 * @parmas initialValue 可选。传递给函数的初始值
 */
array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

// first method

aa.reduce((total, currentValue, currentIndex, arr) => {
  console.log(total, currentValue, currentIndex, arr);
});

// 1 2 1 (5) [1, 2, 3, 4, 5]
// undefined 3 2 (5) [1, 2, 3, 4, 5]
// undefined 4 3 (5) [1, 2, 3, 4, 5]
// undefined 5 4 (5) [1, 2, 3, 4, 5]
// undefined

// second method
aa.reduce((total, currentValue, currentIndex, arr) => {
  console.log(total, currentValue, currentIndex, arr);
  return total + currentValue;
});

// 1 2 1 (5) [1, 2, 3, 4, 5]
// 1 3 3 2 (5) [1, 2, 3, 4, 5]
// 1 6 4 3 (5) [1, 2, 3, 4, 5]
// 1 10 5 4 (5) [1, 2, 3, 4, 5]
// 15

// third method
aa.reduce((total, currentValue, currentIndex, arr) => {
  console.log(total, currentValue, currentIndex, arr);
  return total + currentValue;
}, 10);

// 10 1 0 (5) [1, 2, 3, 4, 5]
// 1 11 2 1 (5) [1, 2, 3, 4, 5]
// 1 13 3 2 (5) [1, 2, 3, 4, 5]
// 1 16 4 3 (5) [1, 2, 3, 4, 5]
// 1 20 5 4 (5) [1, 2, 3, 4, 5]
// 25
```

```js
// 字符串转换
arr.join(',').split(',').map(item => Number(item)))
```
