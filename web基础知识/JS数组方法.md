> 原文链接：[JS 数组方法总览及遍历方法耗时统计](https://juejin.im/post/5bb753bd6fb9a05d2272b673)
> 荐读：[那些被忽略的 JavaScript 数组方法细节](https://segmentfault.com/a/1190000018325040)
> ####01、`push(value)`将 value 添加到数组的最后，返回数组长度(改变原数组)
> ####02、`unshift()`添加元素到数组的开头，返回数组的长度(改变原数组)
> ####03、`pop()`删除数组中最后一个元素，返回被删除元素(改变原数组)
> ####04、`shift()`删除数组第一个元素，返回删除的元素(改变原数组)
> ####05、`join(value)`将数组用 value 连接为字符串(不改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.join(',')
console.log(result)   // '1,2,3,4,5'
console.log(a)        // [1, 2, 3, 4, 5]

// More
let obj = {
  toString() {
    console.log('调用了toString()方法！')
    return 'a'
  },
  toValue() {
    console.log('toValue()方法！')
    return 'b'
  }
}
result = a.join(obj) // 使用对象时会调用对象自身的toString方法转化为字符串，我们这里重写了toString，从而覆盖了原型链上的toString
// 调用了toString()方法！
console.log(result)   // 1a2a3a4a5
console.log(a)        // [1, 2, 3, 4, 5]

// join的一个相对的方法是字符串的split方法
console.log('1a2a3a4a5'.split('a')) // [1, 2, 3, 4, 5]
```

####06、`reverse()`反转数组(改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.reverse()
console.log(result)   // [5, 4, 3, 2, 1]
console.log(a)        // [5, 4, 3, 2, 1]

// More
a = [1, [2, 3], [4, 5]]
result = a.reverse()
console.log(result)   // [[4, 5], [2, 3], 1]
console.log(a)        // [[4, 5], [2, 3], 1]
// 可以看到这里的反转只是基于数组的第一层，属于浅反转。

// 一个简单的深反转，使用递归实现
const deepReverse = (array) => {
  let temp = array.reverse()
  temp.forEach(v => {
    if(Object.prototype.toString.call(v) === '[object Array]') {
      deepReverse(v)
    }
  })
  return temp
}
a = [1, [2, 3], [4, 5]]
result = deepReverse(a)
console.log(result)    // [[5, 4], [3, 2], 1]
```

####07、`slice(start, end)`返回新数组，包含原数组索引 start 的值到索引 end 的值，不包含 end(不改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.slice(2, 4)
console.log(result)   // [3, 4]
console.log(a)        // [1, 2, 3, 4, 5]

// More
console.log(a.slice(1))         // [2, 3, 4, 5]   只有一个参数且不小于0，则从此索引开始截取到数组的末位
console.log(a.slice(-1))        // [5]            只有一个参数且小于0，则从倒数|start|位截取到数组的末位
console.log(a.slice(-1, 1))     // []             反向截取，不合法返回空数组
console.log(a.slice(1, -1))     // [2, 3, 4]      从第一位截取到倒数第一位，不包含倒数第一位
console.log(a.slice(-1, -2))    // []             反向截取，不合法返回空数组
console.log(a.slice(-2, -1))    // [4]            倒数第二位截取到倒数第一位
```

####08、`splice(index, count, value)`从索引为 index 处删除 count 个元素，插入 value(改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.splice(1, 2, 0)
console.log(result)   // [2, 3]
console.log(a)        // [1, 0, 4, 5]

// More
a = [1, 2, 3, 4, 5]
console.log(a.splice(-2))                   // [4. 5]
console.log(a)                              // [1, 2, 3]

a = [1, 2, 3, 4, 5]
console.log(a.splice(-1))                   // [5]
console.log(a)                              // [1, 2, 3, 4]               当参数为单个且小于0时，将从数组的倒数|index|位截取到数组的末位

a = [1, 2, 3, 4, 5]
console.log(a.splice(0))                    // [1, 2, 3, 4, 5]
console.log(a)                              // []

a = [1, 2, 3, 4, 5]
console.log(a.splice(1))                    // [2, 3, 4, 5]
console.log(a)                              // [1]                        当参数为单个且不小于0时，将从当前数代表的索引位开始截取到数组的末位

a = [1, 2, 3, 4, 5]
console.log(a.splice(-1, 2))                // [5]
console.log(a)                              // [1, 2, 3, 4]               从倒数第一位开始截取两个元素，元素不够，只返回存在的元素

a = [1, 2, 3, 4, 5]
console.log(a.splice(0, 2, 'a', 'b', 'c'))  // [1, 2]
console.log(a)                              // ["a", "b", "c", 3, 4, 5]   截取后将value一次填充到数组被截取的位置，value的数量大于截取的数量时，数组中剩余的元素后移
```

####09、`sort()`对数组元素进行排序(改变原数组)

```
// Base
let a = [31, 22, 27, 1, 9]
let result = a.sort()
console.log(result)   // [1, 22, 27, 31, 9]
console.log(a)        // [1, 22, 27, 31, 9]

// More
a = ['c', 'ac', 'ab', '1c', 13, 12, '13', '12', '3', '2', '1b', '1a', 1, 'aa', 'a', 3, 'b', 2]
a.sort()
console.log(a) // [1, 12, "12", 13, "13", "1a", "1b", "1c", "2", 2, "3", 3, "a", "aa", "ab", "ac", "b", "c"]
                      // 可以看出sort排序是根据位来进行排序，而非值的大小，先比较第一位数字在前，字母在后，若相同则比较后面位(实际是比较各个值转化为字符串后的各个位点的unicode位点)
a = [31, 22, 27, 1, 9]
a.sort((a, b)=>{
  return a - b
})
console.log(a)        // [1, 9, 22, 27, 31]  按数值大小正序排列

a = [31, 22, 27, 1, 9]
a.sort((a, b)=>{
  return b - a
})
console.log(a)        // [31, 27, 22, 9, 1]  按数值大小倒序排列
```

####10、`toString()`将数组中的元素用逗号拼接成字符串(不改变原数组)
####11、`indexOf(value)`从索引为 0 开始，检查数组是否包含 value，有则返回匹配到的第一个索引，没有返回-1(不改变原数组)
####12、`lastIndexOf(value)`从最后的索引开始，检查数组是否包含 value，有则返回匹配到的第一个索引，没有返回-1(不改变原数组)
####13、`concat(value)`将数组和/或值连接成新数组(不改变原数组)
####14、`fill(value, start, end)`使用给定 value 填充数组，从索引 start 开始 end 结束，不包含 end(改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.fill(0, 2, 3)
console.log(result)             // [1, 2, 0, 4, 5]
console.log(a)                  // [1, 2, 0, 4, 5]

// More
a = [1, 2, 3, 4, 5]
console.log(a.fill(1))          // [1, 1, 1, 1, 1]  参数一个时，将该参数覆盖填充到数组每一项
a = [1, 2, 3, 4, 5]
console.log(a.fill(1, 2))       // [1, 2, 1, 1, 1]  只有start时，从索引start开始填充到数组末位
a = [1, 2, 3, 4, 5]
console.log(a.fill(1, -2))      // [1, 2, 3, 1, 1]  只有start且为负数时，从倒数|start|位开始填充到数组末位
```

####15、`flat()`将二维数组变为一维数组(不改变原数组)

```
// Base
let a = [1, 2, 3, [4, 5]]
let result = a.flat()
console.log(result)   // [1, 2, 3, 4, 5]
console.log(a)        // [1, 2, 3, [4, 5]]

let a = [1, 2, 3, [4, 5, [6, 7, [8, 9]]]]
let result = a.flat()
console.log(result)   // [1, 2, 3, 4, 5, [6, 7, [8, 9]]] 很显然只能将第二层嵌套数组“拉平”
console.log(a)        // [1, 2, 3, [4, 5, [6, 7, [8, 9]]]]
```

####16、`flatMap()`相当于 map 与 flat 的结合(不改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.flatMap((currentValue)=>{
  return [currentValue, currentValue * 2]
})
console.log(result)   // [1, 2, 2, 4, 3, 6, 4, 8, 5, 10]
console.log(a)        // [1, 2, 3, 4, 5]
```

####17、`copyWithin(target, start, end)`将数组从 start 到 end 索引的元素(不包含 end)复制到 target 开始的索引位置(改变原数组)

```
// Base
let a = [1, 2, 3, 4, 5]
let result = a.copyWithin(0, 3, 5)
console.log(result)                 // [4, 5, 3, 4, 5]
console.log(a)                      // [4, 5, 3, 4, 5]  索引3到5的元素为4和5，复制到从0开始的位置，替换掉了1和2

// More
a = [1, 2, 3, 4, 5]
console.log(a.copyWithin(2))        // [1, 2, 1, 2, 3]  参数只有一个时，start默认为0，end默认为数组长度-1
```

####18、`entries()`返回一个新的 Array 迭代器对象,可用 for...of 遍历(不改变原数组)
####19、`keys()`返回一个新的 Array 迭代器对象,可用 for...of 遍历(不改变原数组)
####20、`values()`返回一个新的迭代器(不改变原数组)
####21、`forEach()`遍历数组(不改变原数组)

```
let a = [1, 2, 3, 4, 5]
let result = a.forEach((v, i)=>{
  console.log(v, i)
  // 1 0
  // 2 1
  // 3 2
  // 4 3
  // 5 4
})
console.log(result)   // undefined
console.log(a)        // [1, 2, 3, 4, 5]

// Time
a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.forEach(v=>{})
let dateEnd = Date.now()
console.log(dateEnd - dateStart)  // 运行三次，三次的耗时数 182ms 188ms 180ms
```

####22、`every(fn)`判断数组中是否所有元素都满足 fn 函数中的条件(不改变原数组)

```
let a = [1, 2, 3, 4, 5]
let result = a.every((currentValue)=>{
  return currentValue > 0
})
console.log(result)   // true  显然所有元素都大于0

result = a.every((currentValue)=>{
  return currentValue > 1
})
console.log(result)   // false  1并不大于1
console.log(a)        // [1, 2, 3, 4, 5]

// Time
a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.every(v=> v > -1 )
let dateEnd = Date.now()
console.log(dateEnd - dateStart) // 运行三次，三次的耗时数 176ms 200ms 186ms

dateStart = Date.now()
a.every(v=> v > 8 )
dateEnd = Date.now()
console.log(dateEnd - dateStart) // 0ms 0ms 0ms 不超过1ms，可见every的判断是在识别到不满足的条件时，立刻停止
```

####23、`filter(fn)`返回数组中满足 fn 函数中条件的集合(不改变原数组)

```
let a = [1, 2, 3, 4, 5]
let result = a.filter((currentValue)=>{
  return currentValue > 4
})
console.log(result)   // [5] 只有5满足条件
console.log(a)        // [1, 2, 3, 4, 5]

// Time
a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.filter(v=> v > -1 )
let dateEnd = Date.now()
console.log(dateEnd - dateStart) // 运行三次，三次的耗时数 584ms 660ms 552ms 全部值都满足条件的情况

a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.filter(v=> v < 0 )
let dateEnd = Date.now()
console.log(dateEnd - dateStart) // 200ms 194ms 183ms 这个时候才个forEach接近，这也是与forEach本身只有遍历的功能，没有执行其他逻辑相关
```

####24、`find(fn)`返回数组中第一个匹配 fn 函数中条件的值没有则返回 undefined(不改变原数组)
####25、`findIndex(fn)`返回数组中第一个匹配 fn 函数中条件的索引没有则返回 undefined(不改变原数组)
####26、`includes()`返回一个布尔值，表示某个数组是否包含给定的值(不改变原数组)
####27、`map(fn)`以 fn 函数中返回值组成新的数组返回(不改变原数组)
####28、`reduce()`累计器(不改变原数组)

```
let a = [1, 2, 3, 4, 5]
let result = a.reduce((accumulator, currentValue, currentIndex, array)=>{
  console.log(accumulator, currentValue, currentIndex, array)
  return accumulator + currentValue
  // 5  1 0 [1, 2, 3, 4, 5]  第一次accumulator的值为reduce第二个参数5, currentValue为数组第一个元素
  // 6  2 1 [1, 2, 3, 4, 5]  第二次accumulator的值为5加上数组a中的第一个值，即是第一次循环时return的值
  // 8  3 2 [1, 2, 3, 4, 5]  同上
  // 11 4 3 [1, 2, 3, 4, 5]  同上
  // 15 5 4 [1, 2, 3, 4, 5]  同上
}, 5)
console.log(result)   // 20 为最终累计的和
console.log(a)        // [1, 2, 3, 4, 5]

// 无初始值时，accumulator的初始值为数组的第一个元素，currentValue为数组第二个元素
result = a.reduce((accumulator, currentValue, currentIndex, array)=>{
  console.log(accumulator, currentValue, currentIndex, array)
  return accumulator + currentValue
  // 1  2 1 [1, 2, 3, 4, 5]
  // 3  3 2 [1, 2, 3, 4, 5]
  // 6  4 3 [1, 2, 3, 4, 5]
  // 10 5 4 [1, 2, 3, 4, 5]
})
console.log(result)   // 15 为最终累计的和
console.log(a)        // [1, 2, 3, 4, 5]

// Time
a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.reduce((accumulator, currentValue, currentIndex, array)=>{
  return accumulator + currentValue
})
let dateEnd = Date.now()
console.log(dateEnd - dateStart) // 200ms 258ms 257ms 效率与forEach相差也不多，而且比forEach多个累计的功能
```

####29、`reduceRight()`与 reduce 功能一样，只是从数组末尾开始进行累计(不改变原数组)
####30、`some(fn)`检查数组中是否含有满足 fn 函数条件的值(不改变原数组)

```
let a = [1, 2, 3, 4, 5]
let result = a.some((v)=>{
  return v > 2
})
console.log(result)   // true
console.log(a)        // [1, 2, 3, 4, 5]

result = a.some((v)=>{
  return v > 6
})
console.log(result)   // false
console.log(a)        // [1, 2, 3, 4, 5]

// Time
a = []
for(let i = 0; i < 10000000; i++) {
  a.push(i)
}
let dateStart = Date.now()
a.some(v=>{
  return v < 0
})
let dateEnd = Date.now()
console.log(dateEnd - dateStart)  // 171ms 176ms 188ms 全部不满足的情况下效率与forEach相当
```

####31、`toLocaleString()`将数组中的每个元素使用各自的 toLocaleString()转换后用,拼接(不改变原数组)

```
let a = [1, new Date(), 'a', {m: 1}]
let result = a.toLocaleString()
console.log(result)   // '1,2018/10/3 下午9:23:59,a,[object Object]'
console.log(a)        // [1, Wed Oct 03 2018 21:23:59 GMT+0800 (中国标准时间), "a", {m: 1}]
```

####32、`[@@iterator]()`数组自带的迭代器方法(不改变原数组)
