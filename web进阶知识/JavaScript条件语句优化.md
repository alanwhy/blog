> 原文链接：[微信公众号：前端大学](https://mp.weixin.qq.com/s/BESZtabG3faeZ7QDgWxPBQ)

##一、使用 Array.includes 来处理多重条件
举个例子：
```
// 条件语句
function test(fruit) {
  if (fruit == 'apple' || fruit == 'strawberry') {
    console.log('red');
  }
}
```
如果我们想要匹配更多的红色水果呢，比方说『樱桃』和『蔓越莓』？我们是不是得用更多的`||`来扩展这条语句？
利用`Array.includes(Array.includes)`重写
```
function test(fruit) {
  // 把条件提取到数组中
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];

  if (redFruits.includes(fruit)) {
    console.log('red');
  }
}
```
##二、少写嵌套，尽早返回
为之前的例子添加两个条件：
- 如果没有提供水果，抛出错误。
- 如果该水果的数量大于 10，将其打印出来。
```
function test(fruit, quantity) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];

  // 条件 1：fruit 必须有值
  if (fruit) {
    // 条件 2：必须为红色
    if (redFruits.includes(fruit)) {
      console.log('red');

      // 条件 3：必须是大量存在
      if (quantity > 10) {
        console.log('big quantity');
      }
    }
  } else {
    throw new Error('No fruit!');
  }
}

// 测试结果
test(null); // 报错：No fruits
test('apple'); // 打印：red
test('apple', 20); // 打印：red，big quantity
```
从嵌套来看，一共是有3层的判断，我们应该遵循**当发现无效条件时尽早返回**
```
function test(fruit, quantity) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];

  // 条件 1：尽早抛出错误
  if (!fruit) throw new Error('No fruit!');

  // 条件2：必须为红色
  if (redFruits.includes(fruit)) {
    console.log('red');

    // 条件 3：必须是大量存在
    if (quantity > 10) {
      console.log('big quantity');
    }
  }
}
```
这是种很好的代码风格，尤其是在 if 语句很长的时候
如果反转一下条件，我们还可以进一步地减少嵌套层级。
```
function test(fruit, quantity) {
  const redFruits = ['apple', 'strawberry', 'cherry', 'cranberries'];

  if (!fruit) throw new Error('No fruit!'); // 条件 1：尽早抛出错误
  if (!redFruits.includes(fruit)) return; // 条件 2：当 fruit 不是红色的时候，直接返回

  console.log('red');

  // 条件 3：必须是大量存在
  if (quantity > 10) {
    console.log('big quantity');
  }
}
```
然而，并没有任何硬性规则要求你这么做。试想一个问题：这个版本的代码（没有嵌套）是否要比之前那个版本（条件 2 有嵌套）的更好、可读性更强？
我觉得：我会选择前一个版本（条件 2 有嵌套）。原因在于：这样的代码比较简短和直白，一个嵌套的 if 使得结构更加清晰。条件反转会导致更多的思考过程（增加认知负担）。
##三、使用函数默认参数和解构
在 JavaScript 中我们经常需要检查 null / undefined 并赋予默认值
```
function test(fruit, quantity) {
  if (!fruit) return;
  const q = quantity || 1; // 如果没有提供 quantity，默认为 1

  console.log(`We have ${q} ${fruit}!`);
}

//测试结果
test('banana'); // We have 1 banana!
test('apple', 2); // We have 2 apple!
```
我们可以通过函数的默认参数来去掉变量 q
```
function test(fruit, quantity = 1) { // 如果没有提供 quantity，默认为 1
  if (!fruit) return;
  console.log(`We have ${quantity} ${fruit}!`);
}

//测试结果
test('banana'); // We have 1 banana!
test('apple', 2); // We have 2 apple!
```
请注意，所有的函数参数都可以有其默认值。举例来说，我们同样可以为 fruit 赋予一个默认值：`function test(fruit = 'unknown', quantity = 1)`。
那么如果 fruit 是一个对象（Object）呢？我们还可以使用默认参数吗？
```
function test(fruit) { 
  // 如果有值，则打印出来
  if (fruit && fruit.name)  {
    console.log (fruit.name);
  } else {
    console.log('unknown');
  }
}

//测试结果
test(undefined); // unknown
test({ }); // unknown
test({ name: 'apple', color: 'red' }); // apple
```
观察上面的例子，当水果名称属性存在时，我们希望将其打印出来，否则打印`unknown`。我们可以通过默认参数和解构赋值的方法来避免写出` fruit && fruit.name `这种条件。
既然我们只需要 fruit 的 name 属性，我们可以使用 {name} 来将其解构出来，之后我们就可以在代码中使用 name 变量来取代 fruit.name。
我们还使用 {} 作为其默认值。如果我们不这么做的话，在执行 test(undefined) 时，你会得到一个错误 `Cannot destructure property name of 'undefined' or 'null'.`，因为 undefined 上并没有 name 属性。
如果你不介意使用第三方库的话，有一些方法可以帮助减少空值（null）检查
- [Lodash get](https://lodash.com/docs/4.17.11#get) 函数
- Facebook 开源的 [idx 库](https://github.com/facebookincubator/idx)（需搭配 Babeljs）

一个使用 Lodash 的例子：
```
//  使用 lodash 库提供的 _ 方法
function test(fruit) {
  console.log(_.get(fruit, 'name', 'unknown'); // 获取属性 name 的值，如果没有，设为默认值 unknown
}

//测试结果
test(undefined); // unknown
test({ }); // unknown
test({ name: 'apple', color: 'red' }); // apple
```
##四、相较于 Switch，Map / Object 也许是更好的选择
```
function test(color) {
  // 使用 switch case 来找到对应颜色的水果
  switch (color) {
    case 'red':
      return ['apple', 'strawberry'];
    case 'yellow':
      return ['banana', 'pineapple'];
    case 'purple':
      return ['grape', 'plum'];
    default:
      return [];
  }
}

//测试结果
test(null); // []
test('yellow'); // ['banana', 'pineapple']
```
上面的代码看上去并没有错，但它看上去很冗长。我们可以这样写：
```
// 使用对象字面量来找到对应颜色的水果
  const fruitColor = {
    red: ['apple', 'strawberry'],
    yellow: ['banana', 'pineapple'],
    purple: ['grape', 'plum']
  };

function test(color) {
  return fruitColor[color] || [];
}
```
也可以使用`Map`来实现同样的效果（`Map`是 ES2015 引入的新的对象类型，允许你存放键值对。）
```
// 使用 Map 来找到对应颜色的水果
  const fruitColor = new Map()
    .set('red', ['apple', 'strawberry'])
    .set('yellow', ['banana', 'pineapple'])
    .set('purple', ['grape', 'plum']);

function test(color) {
  return fruitColor.get(color) || [];
}
```
```
// 懒人版：重构语法
// 使用 Array.filter 实现同样的效果
 const fruits = [
    { name: 'apple', color: 'red' }, 
    { name: 'strawberry', color: 'red' }, 
    { name: 'banana', color: 'yellow' }, 
    { name: 'pineapple', color: 'yellow' }, 
    { name: 'grape', color: 'purple' }, 
    { name: 'plum', color: 'purple' }
];

function test(color) {
  // 使用 Array filter 来找到对应颜色的水果

  return fruits.filter(f => f.color == color);
}
```
##五、使用 Array.every 和 Array.some 来处理全部/部分满足条件
观察以下的代码，我们想要检查是否所有的水果都是红色的：
```
const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
  ];

function test() {
  let isAllRed = true;

  // 条件：所有的水果都必须是红色
  for (let f of fruits) {
    if (!isAllRed) break;
    isAllRed = (f.color == 'red');
  }

  console.log(isAllRed); // false
}
```
通过`Array.every`来缩减代码
```
const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
  ];

function test() {
  // 条件：（简短形式）所有的水果都必须是红色
  const isAllRed = fruits.every(f => f.color == 'red');

  console.log(isAllRed); // false
}
```
如果我们想要检查是否有至少一个水果是红色的，我们可以使用`Array.some`
```
const fruits = [
    { name: 'apple', color: 'red' },
    { name: 'banana', color: 'yellow' },
    { name: 'grape', color: 'purple' }
];

function test() {
  // 条件：至少一个水果是红色的
  const isAnyRed = fruits.some(f => f.color == 'red');

  console.log(isAnyRed); // true
}
```
