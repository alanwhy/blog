###new 实现了哪些功能

- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

###代码

```
function create() {
    // 创建一个空的对象
    let obj = new Object()
    // 获得构造函数
    // 因为 arguments 类数组，所以我们可以用数组的 shift 来实现 arguments 的 ‘push’ 和 ‘pop’
    // 将 arguments 进数组，并将第一个元素移除并赋值给 Con (Constructor).
    let Con = [].shift.call(arguments)
    // 链接到原型
    obj.__proto__ = Con.prototype
    // 绑定this，并执行构造函数，就相当于 obj .constructor(arguments)
    let result = Con.apply(obj, arguments)
    // 确保 new 出来的是个对象
    return typeof result === 'object' ? result : obj
}
```

###测试

```
function Dog(name,age){
  this.name = name
  this.age = age
}
Dog.prototype.wang = function(){
  console.log(`i am ${this.name},${this.age}`)
}

function create() {
    let obj = new Object()
    let Con = [].shift.call(arguments)
    obj.__proto__ = Con.prototype
    let result = Con.apply(obj, arguments)
    return typeof result === 'object' ? result : obj
}

let dog1 = new Dog('小黄',3)
let dog2 = create(Dog,'小黄',3)

dog1.wang()   // i am 小黄,3
dog2.wang()   // i am 小黄,3
```

> 原文链接：[手写 new instanceof](https://xiaoheng21.github.io/2019/05/18/%E6%89%8B%E5%86%99new/)
