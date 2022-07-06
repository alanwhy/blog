### reduce 定义和用法

```js
array.reduce(function(prev, cur, index, arr), init)
```

- prev （上一次调用回调返回的值，或者是提供的初始值（initialValue））
- cur （数组中当前被处理的元素）
- index （当前元素在数组中的索引)
- arr （调用的数组）
- init （传递给函数的初始值）

### 一些操作

#### 1. reduce 累加

带初始值

```js
var arr = [1, 2, 3, 4];
var sum = arr.reduce((pre, item) => {
  return pre + item;
}, 10);
console.log(sum); // 20
```

不带初始值

```js
var arr = [1, 2, 3, 4];
var sum = arr.reduce((pre, item) => {
  return pre + item;
});
console.log(sum); // 10
```

#### 2. reduce 数组去重

```js
var arr = [1, 2, 3, 3, 2, 1, 4];
arr.reduce((acc, cur) => {
  if (!acc.includes(cur)) {
    acc.push(cur);
  }
  return acc;
}, []);
// [1, 2, 3, 4]
```

#### 3. reduce 求数组项最大值

```js
var arr = [1, 2, 3, 4];
arr.reduce((prev, cur) => {
  return Math.max(prev, cur);
});
//4
```

#### 4. reduce 将二维数组转为一维数组

```js
var arr = [
  [1, 2],
  [3, 4],
  [5, 6],
];
arr.reduce((acc, cur) => {
  return acc.concat(cur);
}, []);
// [1,2,3,4,5,6]
```

#### 5. reduce 对象里的属性求和

```js
var arr = [
  { subject: "Math", score: 90 },
  { subject: "Chinese", score: 90 },
  { subject: "English", score: 100 },
];
arr.reduce((pre, cur) => {
  return cur.score + pre;
}, 0);
//280
```

#### 6. reduce 计算数组中每个元素出现的个数

```js
var arr = [1, 2, 3, 3, 2, 1, 2, 1];
arr.reduce((acc, cur) => {
  if (!(cur in acc)) {
    acc[cur] = 1;
  } else {
    acc[cur] += 1;
  }
  return acc;
}, {});
//{1: 3, 2: 3, 3: 2}
```

#### 7. reduce 按属性给数组分类

```js
var arr = [
  { subject: "Math", score: 90 },
  { subject: "Chinese", score: 90 },
  { subject: "English", score: 100 },
  { subject: "Math", score: 80 },
  { subject: "Chinese", score: 95 },
];
arr.reduce((acc, cur) => {
  if (!acc[cur.type]) {
    acc[cur.type] = [];
  }
  acc[cur.type].push(cur);
  return acc;
}, {});
```

### 实现其他数组方法

#### 1. reduce 实现 map

```js
var arr = [1, 2, 3, 4];
Array.prototype.reduceMap = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    const item = callback(cur, index, array);
    acc.push(item);
    return acc;
  }, []);
};
arr.reduceMap((item, index) => {
  return item + index;
});
// [1, 3, 5, 7]
```

#### 2. reduce 实现 forEach

```js
var arr = [1, 2, 3, 4];
Array.prototype.reduceForEach = function (callback) {
  this.reduce((acc, cur, index, array) => {
    callback(cur, index, array);
  }, []);
};

arr.reduceForEach((item, index, array) => {
  console.log(item, index);
});
// 1234
// 0123
```

#### 3. reduce 实现 filter

```js
var arr = [1, 2, 3, 4];
Array.prototype.reduceFilter = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      acc.push(cur);
    }
    return acc;
  }, []);
};
arr.reduceFilter((item) => item % 2 == 0); // 过滤出偶数项。
// [2, 4]
```

#### 4. reduce 实现 find

```js
var arr = [1, 2, 3, 4];
var obj = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
Array.prototype.reduceFind = function (callback) {
  return this.reduce((acc, cur, index, array) => {
    if (callback(cur, index, array)) {
      if (acc instanceof Array && acc.length == 0) {
        acc = cur;
      }
    }
    if (index == array.length - 1 && acc instanceof Array && acc.length == 0) {
      acc = undefined;
    }
    return acc;
  }, []);
};
arr.reduceFind((item) => item % 2 == 0); // 2
obj.reduceFind((item) => item.a % 2 == 0); // {a: 2}
obj.reduceFind((item) => item.a % 9 == 0); // undefined
```

> 原文链接：[JavaScript: 数组 reduce 实例方法](https://mp.weixin.qq.com/s/ZAqX_X5SY08iEuFzdfmx2A)
