> 原文链接： [Javascript：call（），apply（）和 bind（）](https://segmentfault.com/a/1190000017462138)
> 官方文档：[this 的说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)、[bind()的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)、[call()的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)、[apply()的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) ##一、什么是 this

- 在面向对象的 JS 中，我们了解到在 JS 中，一切都是对象。
- 因为一切都是对象，我们开始明白我们可以为函数设置和访问其他属性。
- 而 this 提供了一种更优雅的方式隐式“传递”一个对象的引用。

###### 对于`this`我们经常会有这样的误区

- 认为 this 指向函数本身
- 认为 this 指向函数作用域

但是正确的定义是

- 函数的调用方式决定了 this 的值。即在运行时进行绑定的，并不是在编写时绑定，它的上下文也取决于函数调用时的各种条件。也就是说，**谁调用，谁负责**

bind（）、apply（）、call（）则是可以更改 this 指向的方法 ##二、call()、apply()、bind()
到目前为止，我们已将函数视为由名称（可选，也可以是匿名函数）组成的对象及其在调用时执行的代码。
但这不是全部真相，实际上函数看起来更接近下面的图像：
![函数.png](https://upload-images.jianshu.io/upload_images/12877063-83a569f03ce103ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1、bind()

`bind()`方法创建一个新函数，当调用时，将其关键字设置为提供的值。
code:

```javascript
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function () {
  console.log(this.getPokeName() + "I choose you!");
};

var logPokemon = pokemonName.bind(pokemon); // creates new object and binds pokemon. 'this' of pokemon === pokemon now

logPokemon(); // 'Pika Chu I choose you!'
```

让我们分解吧。当我们使用 bind（）方法时：
1.JS 引擎正在创建一个新的 pokemonName 实例，并将 pokemon 绑定为此变量。重要的是要理解它复制了 pokemonName 函数。 2.在创建了 pokemonName 函数的副本之后，它可以调用 logPokemon（），尽管它最初不在 pokemon 对象上。它现在将识别其属性（Pika 和 Chu）及其方法。

很酷的是，在我们 bind（）一个值后，我们可以像使用任何其他正常函数一样使用该函数。我们甚至可以更新函数来接受参数，并像这样传递它们：

```javascript
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function (snack, hobby) {
  console.log(this.getPokeName() + "I choose you!");
  console.log(this.getPokeName() + " loves " + snack + " and " + hobby);
};

var logPokemon = pokemonName.bind(pokemon); // creates new object and binds pokemon. 'this' of pokemon === pokemon now

logPokemon("sushi", "algorithms"); // Pika Chu  loves sushi and algorithms
```

### 2、call()、apply()

`call()`方法调用具有给定此值的函数和单独提供的参数。
`bind()`和`call()`之间的主要区别在于`call()`方法：

- 接受其他参数
- 执行它立即调用的函数。
- `call()`方法不会复制正在调用它的函数。

`call()`和`apply()`用于完全相同的目的。它们之间的唯一区别是`call()`期望所有参数都单独传递，而`apply()`需要一个数组。

```javascript
var pokemon = {
  firstname: "Pika",
  lastname: "Chu ",
  getPokeName: function () {
    var fullname = this.firstname + " " + this.lastname;
    return fullname;
  },
};

var pokemonName = function (snack, hobby) {
  console.log(this.getPokeName() + " loves " + snack + " and " + hobby);
};

pokemonName.call(pokemon, "sushi", "algorithms"); // Pika Chu  loves sushi and algorithms
pokemonName.apply(pokemon, ["sushi", "algorithms"]); // Pika Chu  loves sushi and algorithms
```
