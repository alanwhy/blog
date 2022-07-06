###题目
写一个js方法，传入一个嵌套数组如：
```
[1, 2, [3, [4, 5], 6], [3, 4]]
```
返回数组的深度，返回值为3

###思路一
深度递归
```
var getArrayDeepin = function (array, deepin = 0) {
  if (!Array.isArray(array)) {
    return deepin
  }
  let max = 0
  for (let item of array) {
    let itemDeepin = getArrayDeepin(item, deepin + 1)
    max = max < itemDeepin ? itemDeepin : max
  }
  return max
}
```

###思路二
转字符串，遍历字符串，找到 `[` 字符深度加一，找到 `]` 字符深度减一
```
var getArrayDeepin= function (arr) {
  let str = JSON.stringify(arr)
  let max = 0
  let cur = 0
  for (let key in str) {
    if (str[key] == "[") {
      cur++
    }
    if (str[key] == "]") {
      cur--
    }
    if (max < cur) {
      max = cur
    }
  }
  return max
}
``` 

ps 因为够菜，一面挂彩。
关于数组的扁平化，其实也是属于此类问题，放一些代码
> 原文链接：[JavaScript 专题之数组扁平化](https://juejin.im/post/59716f15f265da6c4c500fc7)

```
// 递归
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
        }
        else {
            result.push(arr[i])
        }
    }
    return result;
}


console.log(flatten(arr))
```

```
// toString 如果数组的元素都是数字，那么我们可以考虑使用 toString 方法

var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.toString().split(',').map(function(item){
        return +item
    })
}

console.log(flatten(arr))
```

```
// reduce
var arr = [1, [2, [3, 4]]];

function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}

console.log(flatten(arr))
```

```
// ES6 增加了扩展运算符，用于取出参数对象的所有可遍历属性，拷贝到当前对象之中
var arr = [1, [2, [3, 4]]];

function flatten(arr) {

    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }

    return arr;
}

console.log(flatten(arr))
```

```
// Array.prototype.flat()
var arr1 = [1, 2, [3, 4]];
arr1.flat(); 
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

arr1.flat(Infinity) 
// [1, 2, 3, 4]
```
