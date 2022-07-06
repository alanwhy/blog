原文链接：[小邵教你玩转 ES6](https://juejin.im/post/5b7b95206fb9a019bd2463d8) #解构赋值
解构赋值主要分为对象的解构和数组的解构，在没有解构赋值的时候，我们赋值是这样的

```
let arr = [0,1,2]
let a = arr[0]
let b = arr[1]
let c = arr[2]
```

这样写很繁琐，那么我们有没办法既声明，又赋值，更优雅的写法呢？肯定是有的，那就是**解构赋值**，解构赋值，简单理解就是等号的左边和右边相等。 ##一、数组的解构赋值

```
let arr = [0,1,2]
let [a,b,c] = arr
console.log(a) // 0
console.log(b) // 1
console.log(c) // 2
```

但是很多时候，数据并非一一对应的，并且我们希望得到一个默认值

```
let arr = [,1,2]
let [a='我是默认值',b,c] = arr
console.log(a) // '我是默认值'
console.log(b) // 1
console.log(c) // 2
```

从这个例子可以看出，在解构赋值的过程中，a=undefined 时，会使用默认值
那么当 a=null 时呢？当 a=null 时，那么 a 就不会使用默认值，而是使用 null

```
// 数组的拼接
let a = [0,1,2]
let b = [3,4,5]
let c = a.concat(b)
console.log(c) // [0,1,2,3,4,5]

let d = [...a,...b]
console.log(d) // [0,1,2,3,4,5]
```

```
// 数组的克隆
// 假如我们简单地把一个数组赋值给另外一个变量
let a = [0,1,2,3]
let b = a
b.push(4)
console.log(a) // [0,1,2,3,4]
console.log(b) // [0,1,2,3,4]
```

因为这只是简单的把引用地址赋值给 b，而不是**重新开辟一个内存地址**，所以
a 和 b 共享了同一个内存地址，该内存地址的更改，会影响到所有引用该地址的变量
那么用下面的方法，把数组进行克隆一份，互不影响

```
let a = [0,1,2,3]
let b = [...a]
b.push(4)
console.log(a) // [0,1,2,3]
console.log(b) // [0,1,2,3,4]
```

##二、对象的解构赋值
对象的解构赋值和数组的解构赋值其实类似，但是数组的数组成员是有序的
而对象的属性则是无序的，所以对象的解构赋值简单理解是等号的左边和右边的结构相同

```
let {name,age} = {name:"swr",age:28}
console.log(name) // 'swr'
console.log(age) // 28
```

对象的解构赋值是根据 key 值进行匹配

```
// 这里可以看出，左侧的name和右侧的name，是互相匹配的key值
// 而左侧的name匹配完成后，再赋值给真正需要赋值的Name
let { name:Name,age } = { name:'swr',age:28 }
console.log(Name) // 'swr'
console.log(age) // 28
```

那么当变量已经被声明了呢？

```
let name,age
// 需要用圆括号，包裹起来
({name,age} = {name:"swr",age:28})
console.log(name) // 'swr'
console.log(age) // 28
```

变量能否也设置默认值？

```
let {name="swr",age} = {age:28}
console.log(name) // 'swr'
console.log(age) // 28
// 这里规则和数组的解构赋值一样，当name = undefined时，则会使用默认值
```

```
let [a] = [{name:"swr",age:28}]
console.log(a) // {name:"swr",age:28}

let { length } = "hello swr"
console.log(length) // 9
```

```
function ajax({method,url,type='params'}){
    console.log(method) // 'get'
    console.log(url) // '/'
    console.log(type) // 'params'
}

ajax({method:"get",url:"/"})
```

##三、扩展运算符
我们先看下代码，在以往，我们给函数传不确定参数数量时，是通过 arguments 来获取的

```
function sum() {
  console.log(arguments) // { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6 }
                         // 我们可以看出，arguments不是一个数组，而是一个伪数组
  let total = 0
  let { length } = arguments
  for(let i = 0;i < length;i++){
    total += arguments[i]
  }
  return total
}

console.log(sum(1,2,3,4,5,6)) // 21
```

接下来我们用扩展运算符看看

```
function sum(...args){ // 使用...扩展运算符
    console.log(args) // [ 1, 2, 3, 4, 5, 6 ] args是一个数组
    return eval(args.join('+'))
}

console.log(sum(1,2,3,4,5,6)) // 21
```

得到的 args 是一个数组，直接对数组进行操作会比对伪数组进行操作更加方便，还有一些注意点需要注意

```
// 正确的写法 扩展运算符只能放在最后一个参数
function sum(a,b,...args){
    console.log(a) // 1
    console.log(b) // 2
    console.log(args) // [ 3, 4, 5, 6 ]
}

sum(1,2,3,4,5,6)

// 错误的写法 扩展运算符只能放在最后一个参数
function sum(...args,a,b){
    // 报错
}

sum(1,2,3,4,5,6)
```

我们可以对比下扩展运算符的方便之处

```
// 以往我们是这样拼接数组的
let arr1 = [1,2,3]
let arr2 = [4,5,6]
let arr3 = arr1.concat(arr2)
console.log(arr3) // [ 1, 2, 3, 4, 5, 6 ]

// 现在我们用扩展运算符看看
let arr1 = [1,2,3]
let arr2 = [4,5,6]
let arr3 = [...arr1,...arr2]
console.log(arr3) // [ 1, 2, 3, 4, 5, 6 ]
```

```
// 以往我们这样来取数组中最大的值
function max(...args){
    return Math.max.apply(null,args)
}
console.log(max(1,2,3,4,5,6)) // 6

// 现在我们用扩展运算符看看
function max(...args){
    return Math.max(...args) // 把args [1,2,3,4,5,6]展开为1,2,3,4,5,6
}
console.log(max(1,2,3,4,5,6)) // 6
```

```
// 扩展运算符可以把argument转为数组
function max(){
    console.log(arguments) // { '0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6 }
    let arr = [...arguments]
    console.log(arr) // [1,2,3,4,5,6]
}

max(1,2,3,4,5,6)

// 但是扩展运算符不能把伪数组转为数组（除了有迭代器iterator的伪数组，如arguments）
let likeArr = { "0":1,"1":2,"length":2 }
let arr = [...likeArr] // 报错 TypeError: likeArr is not iterable

// 但是可以用Array.from把伪数组转为数组
let likeArr = { "0":1,"1":2,"length":2 }
let arr = Array.from(likeArr)
console.log(arr) // [1,2]
```

####对象也可以使用扩展运算符

```
// 以往我们这样合并对象
let name = { name:"邵威儒" }
let age = { age:28 }
let person = {}
Object.assign(person,name,age)
console.log(person) // { name: '邵威儒', age: 28 }

// 使用扩展运算符
let name = { name:"邵威儒" }
let age = { age:28 }
let person = {...name,...age}
console.log(person) // { name: '邵威儒', age: 28 }
```

需要注意的是，通过扩展运算符和 Object.assign 对对象进行合并的行为，是属于**浅拷贝**，那么我们在开发当中，经常需要对对象进行**深拷贝**，接下来我们看看如何进行**深拷贝**。 #####方法一：利用 JSON.stringify 和 JSON.parse

```
let swr = {
    name:"邵威儒",
    age:28,
    pets:['小黄']
}

let swrcopy = JSON.parse(JSON.stringify(swr))
console.log(swrcopy) // { name: '邵威儒', age: 28, pets: [ '小黄' ] }
// 此时我们新增swr的属性
swr.pets.push('旺财')
console.log(swr) // { name: '邵威儒', age: 28, pets: [ '小黄', '旺财' ] }
// 但是swrcopy却不会受swr影响
console.log(swrcopy) // { name: '邵威儒', age: 28, pets: [ '小黄' ] }
```

这种方式进行深拷贝，只针对 json 数据这样的键值对有效
对于函数等等反而无效，不好用，接着继续看方法二、三。 #####方法二

```
function deepCopy(fromObj,toObj) { // 深拷贝函数
  // 容错
  if(fromObj === null) return null // 当fromObj为null
  if(fromObj instanceof RegExp) return new RegExp(fromObj) // 当fromObj为正则
  if(fromObj instanceof Date) return new Date(fromObj) // 当fromObj为Date

  toObj = toObj || {}

  for(let key in fromObj){ // 遍历
    if(typeof fromObj[key] !== 'object'){ // 是否为对象
      toObj[key] = fromObj[key] // 如果为普通值，则直接赋值
    }else{
      if(fromObj[key] === null){
        toObj[key] = null
      }else{
        toObj[key] = new fromObj[key].constructor // 如果为object，则new这个object指向的构造函数
        deepCopy(fromObj[key],toObj[key]) // 递归
      }
    }
  }
  return toObj
}

let dog = {
  name:"小白",
  sex:"公",
  firends:[
    {
      name:"小黄",
      sex:"母"
    }
  ]
}

let dogcopy = deepCopy(dog)
// 此时我们把dog的属性进行增加
dog.firends.push({name:"小红",sex:"母"})
console.log(dog) // { name: '小白',
                      sex: '公',
                      firends: [ { name: '小黄', sex: '母' }, { name: '小红', sex: '母' } ] }
// 当我们打印dogcopy，会发现dogcopy不会受dog的影响
console.log(dogcopy) // { name: '小白',
                          sex: '公',
                          firends: [ { name: '小黄', sex: '母' } ] }
```

#####方法三

```
let dog = {
  name:"小白",
  sex:"公",
  firends:[
    {
      name:"小黄",
      sex:"母"
    }
  ]
}

function deepCopy(obj) {
  if(obj === null) return null
  if(typeof obj !== 'object') return obj
  if(obj instanceof RegExp) return new RegExp(obj)
  if(obj instanceof Date) return new Date(obj)
  let newObj = new obj.constructor
  for(let key in obj){
    newObj[key] = deepCopy(obj[key])
  }
  return newObj
}

let dogcopy = deepCopy(dog)
dog.firends.push({name:"小红",sex:"母"})
console.log(dogcopy)
```
