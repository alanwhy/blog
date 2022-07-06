> 原文链接：[JavaScript 骚操作之遍历、枚举与迭代（上篇）](https://juejin.im/post/5bfbbe2df265da61407e95a3)
> [JavaScript 骚操作之遍历、枚举与迭代（下篇）](https://juejin.im/post/5c07b764e51d450c457199f9) ##一、基本操作
> ###1、标准 for 循环

```
    var arr = ['element1', 'element2', 'element3'];

    for (var i = 0, len = arr.length; i < len; i++) {
        console.log(arr[i]);
    }

    // element1
    // element2
    // element3
```

存在的缺点：

- 无法只关注元素本身，需要花费精力去维护变量 i 以及边界 len；
- 当存在着多重嵌套时，将需要跟踪维护多个变量 i，代码会非常复杂；
- 需要花费精力去处理越界问题，一些编译型语言在遇到数组索引越界时会报错，而 JavaScript 引擎将不会告诉你任何错误信息，错误定位成本会比较高
  ###2、数组方法 forEach()

```
    var arr = ['element1', 'element2', 'element3'];

    arr.forEach(function(value, index, arr) {
        console.log(value);
    });

    // element1
    // element2
    // element3
```

优点：

- 不需要花费精力去追踪索引
- 无需担心越界问题

缺点：

```
    var arr = ['element1', 'element2', 'element3'];

    arr.forEach(function(value, index, arr) {
        if (index === 1) {
            break;
        } else {
            console.log(value);
        }
    });

    // Uncaught SyntaxError: Illegal break statement
```

- break、continue 等语句跨越了函数边界，没办法通过提前终止遍历来节省资源
  ###3、for in 循环

```
    var arr = ['element1', 'element2', 'element3'];

    for (var i in arr) {
        console.log(arr[i]);
    }

    // element1
    // element2
    // element3
```

优点：

- 解决花费时间防止数组越界的问题
- 精准的迭代语句
- 可以枚举对象的所有可枚举属性，可以使用`Object.getOwnPropertyDescriptor(targetObj, attrName)`方法来查看对象的某个属性是否可枚举

```
    var obj = {
        a: 1,
        b: 1,
        c: 1
    };

    for (let attr in obj) {
        console.log(attr, obj[attr]);
    }

    // a 1
    // b 1
    // c 1
```

- 还可兼职遍历字符串

```
    var str = 'I am a handsome boy!';

    for (var i in str) {
        console.log(str[i]);
    }

  //结果太长，不做输出
```

- 支持 break、continue 的操作

缺点：

- for in 循环会将对象的原型属性也一并列举出来（在操作数组上也是有同样的问题）

```
    var father = {
        fatherAttr: 1
    };

    // 以father为原型创建对象实例instance
    var instance = Object.create(father);

    instance.a = 1;
    instance.b = 1;
    instance.c = 1;

    for (var attr in instance) {
        console.log(attr, instance[attr]);
    }

    // a 1
    // b 1
    // c 1
    // fatherAttr 1

    // 获取instance实例的自有属性名
    console.log(Object.getOwnPropertyNames(instance));

    // ["a", "b", "c"]
```

通过查看`instance`的自有属性可以发现，`fatherAttr`并不是`instance`的属性，而是其原型`father`的属性
故使用此方法去遍历对象属性的时候，需要加多一层判断：

```
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
            // 是对象的自有属性，可以尽情的玩耍了
        }
    }
```

一般情况下，使用 for in 遍历数组还是比较保险的；毕竟数组的原型是 JavaScript 内建对象 Array，Array 对象的默认属性都是**不可枚举**的

- 无法给世界上所有的字符编码

```
    var str = 'a𠮷c';

    for (let index in str) {
        console.log(str[index]);
    }

    // a
    // 无法用言语描述的字符
    // 无法用言语描述的字符
    // c
```

ES5 及之前处理字符串时，是以 16 位编码单位为基础的；16 位编码显然无法给世界上所有的字符编码，所以某些字符就需要使用 32 位进行编码了，例如’𠮷‘字
###4、for of 循环
首先看个示例：

```
    let str = 'a 𠮷 c';

    for (let char of str) {
        if (char === ' ') {
            continue;
        } else {
            console.log(char);
        }
    }

    // a
    // 𠮷
    // c
```

上面的例子很 nice，索引去掉了，边界去掉了，想继续就继续，想退出就退出，还能顺便解决一下字符串的编码问题
优点：

- 一种依赖对象迭代器的遍历方法，每一次执行都会执行迭代器的 next 方法，返回正确的值
- 无需花费精力去追踪复杂的条件
- 一些 DOM 标准的类型如 NodeList 也可以使用 for of 循环进行遍历

```
    let containers = document.querySelectorAll('.container');

    for (let node of containers) {
        // 搞事情专用注释
    }
```

缺点：

- 运行环境为 ES6 及以上版本，所以兼容性没有 for in 循环以及传统的操作好
- 只能用于遍历可迭代对象，即存在生成器方法（用于产生迭代器）的对象（可以通过检测对象的 Symbol.iterator 方法是否为函数来判断对象是否可迭代）

```
    let arr = ['a', 'b', 'c'];

    // 判断其Symbol.iterator属性是否为函数
    if ((typeof arr[Symbol.iterator]).toUpperCase() === 'FUNCTION') {
        for (let element of arr) {
            console.log(element);
        }
    } else {
        console.log('此对象不可迭代');
    }

    // a
    // b
    // c
```

大多数 JavaScript 的内置对象都支持迭代，例如：Array、Set、Map、String 等，当使用 for of 循环遍历上述对象时，会使用其默认的生成器生成的迭代器

```
    let map = new Map([['a', 1], ['b', 1], ['c', 1], ['d', 1]]);

    // 正经操作
    for (let item of map) {
        console.log(item);
    }

    // ["a", 1]
    // ["b", 1]
    // ["c", 1]
    // ["d", 1]

    // 使用解构，方便读取值
    for (let [key, value] of map) {
        console.log(key, value);
    }

    // a 1
    // b 1
    // c 1
    // d 1
```

例子中，迭代对象为 Map 类型的默认生成器生成的迭代器，像 Array、Set、Map 类型还提供了一些特殊的生成器

> entries() 返回一个迭代器，其返回值为键值对数组（Map 集合的默认迭代器；对于 Set 集合，返回值数组的元素相同，即 value）
> keys() 返回一个迭代器，其返回值为集合的键名（对于 Set 集合，此迭代器跟 values 迭代器返回值相同;对于数组，此迭代器返回值为索引）
> values() 返回一个迭代器，其返回值为集合的值（Array、Set 集合的默认迭代器）

```
    let arr = ['a', 'b', 'c', 'd']
    let set = new Set(arr);

    for (let item of set.entries()) {
        console.log(item);
    }
    for (let item of arr.entries()) {
        console.log(item);
    }

    // ["a", "a"]
    // ["b", "b"]
    // ["c", "c"]
    // ["d", "d"]
    // [0, "a"]
    // [1, "b"]
    // [2, "c"]
    // [3, "d"]

    for (let item of set.keys()) {
        console.log(item);
    }
    for (let item of arr.keys()) {
        console.log(item);
    }

    // a
    // b
    // c
    // d
    // 0
    // 1
    // 2
    // 3

    for (let item of set.values()) {
        console.log(item);
    }
    for (let item of arr.values()) {
        console.log(item);
    }

    // a
    // b
    // c
    // d
    // a
    // b
    // c
    // d
```

- 不支持自定义对象的遍历 ##二、炫技操作
  ###1、遍历对象的转弯操作
  ####a、Object.keys()获取键名数组
  使用`Object.keys()`可以获取到对象实例的所有可枚举属性，其返回值为一个数组，数组元素为对象的键名

```
    let father = {
        fatherAttr: 1
    };

    // 以father为原型创建对象实例instance
    let instance = Object.create(father);

    instance.a = 1;
    instance.b = 1;
    instance.c = 1;

    Object.defineProperty(instance, 'd', {
        writable: true,
        value: 1,
        enumerable: false,
        configurable: true
    });

    for (let key of Object.keys(instance)) {
        console.log(key);
    }

    // a
    // b
    // c
```

`Object.keys()`方法并不会获取对象的原型属性以及自身不可枚举属性
这个是 ES5 的特性，兼容性还是比较好的
但是如果往这个方法传入非对象参数(如字符串)，其在 ES5 环境和 ES6 环境的表现是不一样的

```
    console.log(Object.keys('I am a handsome boy!'));

    // ES5 直接报错，但说不定是浏览器嫉妒我的帅气才会报错的

    // ES6 估计见多了大风大浪，没啥感觉了
    // ["0", "1", "2", "3", "4", "5", ...]
```

另外，需要注意的一点，ES 标准没有规定这个枚举顺序，也就是说此方法的返回值的顺序是不确定的（包括下面的各种方法），如果对顺序有要求，可以尽量使用`map`或者`set`集合进行操作。
####b、Object.getOwnPropertyNames()获取键名数组
此方法跟 keys 方法表现一样，所不同的是，其返回的数组包含了对象的不可枚举属性：

```
    let father = {
        fatherAttr: 1
    };

    let instance = Object.create(father);

    instance.a = 1;
    instance.b = 1;
    instance.c = 1;

    Object.defineProperty(instance, 'd', {
        writable: true,
        value: 1,
        enumerable: false,
        configurable: true
    });

    for (let key of Object.getOwnPropertyNames(instance)) {
        console.log(key);
    }

    // a
    // b
    // c
    // d
```

####c、Object.entries()获取键值对数组

```
    let father = {
        fatherAttr: 1
    };

    let instance = Object.create(father);

    instance.a = 1;
    instance.b = 1;
    instance.c = 1;

    Object.defineProperty(instance, 'd', {
        writable: true,
        value: 1,
        enumerable: false,
        configurable: true
    });

    for (let key of Object.entries(instance)) {
        console.log(key);
    }

    // ["a", 1]
    // ["b", 1]
    // ["c", 1]
```

当使用一个对象初始化一个 Map 实例时，可以使用这个方法：

```
    let obj = { a: 1, b: 1, c: 1 },
        map = new Map(Object.entries(obj));

    console.log(map.get('a'));
    console.log(map.get('b'));
    console.log(map.get('c'));

    // 1
    // 1
    // 1
```

####d、Object.values()获取对象的属性值数组
####e、Object.getOwnPropertySymbols()获取 Symbol 属性名

```
    let father = {
        fatherAttr: 1
    };

    let instance = Object.create(father);

    instance.a = 1;
    instance.b = 1;
    instance.c = 1;

    instance[Symbol('I am a handsome boy!')] = 1;

    for (let key of Object.keys(instance)) {
        console.log(key);
    }

    // a
    // b
    // c

    for (let key of Object.getOwnPropertySymbols(instance)) {
        console.log(key);
    }

    // Symbol(I am a handsome boy!)
```

###2、ES6 迭代器（iterator）、生成器（generator）
for of 循环是依靠对象的迭代器工作的，如果用 for of 循环遍历一个非可迭代对象（即无默认迭代器的对象），for of 循环就会报错。那迭代器到底是何方神圣？

**迭代器**是一种特殊的对象，其有一个 next 方法，每一次枚举（for of 每循环一次）都会调用此方法一次，且返回一个对象，此对象包含两个值：

- value 属性，表示此次调用的返回值（for of 循环只返回此值）;
- done 属性，Boolean 值类型，标志此次调用是否已结束。

**生成器**是返回**迭代器**的特殊函数，迭代器由生成器生成。
生成器声明方式跟普通函数相似，仅在函数名前面加一个*号（*号左右有空格也是可以正确运行的，但为了代码可读性，建议左边留空格，右边不留）；函数内部使用 yield 关键字指定每次迭代返回值。

```
    // 生成器
    function *iteratorMother() {
        yield 'we';
        yield 'are';
        yield 'the BlackGold team!';
    }

    // 迭代器
    let iterator = iteratorMother();

    console.log(iterator.next());  // { value: "we", done: false }
    console.log(iterator.next());  // { value: "are", done: false }
    console.log(iterator.next());  // { value: "the BlackGold team!", done: false }

    console.log(iterator.next());  // { value: undefined, done: false }
    console.log(iterator.next());  // { value: undefined, done: false }
```

`yield`是 ES6 中的关键字，它指定了 iterator 对象每一次调用 next 方法时返回的值。
当`yield`语句执行完毕后，调用`iterator.next()`会一直返回`{ value: undefined, done: true }`，so，别用 for of 循环遍历同一个迭代器两次

```
    function *iteratorMother() {
        yield 'we';
        yield 'are';
        yield 'the BlackGold team!';
    }

    let iterator = iteratorMother();

    for (let element of iterator) {
        console.log(element);
    }

    // we
    // are
    // the BlackGold team!

    for (let element of iterator) {
        console.log(element);
    }

    // nothing to be printed
    // 这个时候迭代器iterator已经完成他的使命，如果想要再次迭代，应该生成另一个迭代器对象以进行遍历操作
```

#转贴至此，接下来的操作请参看原帖，太骚看不懂了。。。
