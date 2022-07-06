`slice()`, `substring()`, `substr()`;这三个方法都是返回被操作字符串的一个子字符串，就是返回一个新的字符串。
1. 都是接受一个参数或者两个参数
2. 第一个参数是指定字符串的开始位置
3. 第二次参数（在指定的情况下）表示字符串到哪里结束
4. 如果没有第二个参数，则将字符串结束的未位作为结束位置

存异：

- `slice()`和`substring()`第二次参数指定的是字符串最后一个字符后面的位置；
- `substr()`第二个参数指定返回的字符串个数；

```js
   var string = 'hello world';
   console.log(string.slice(3));  //lo world
   console.log(string.substring(3));  //lo world
   console.log(string.substr(3));  //lo world
   console.log(string.slice(3, 7));  //lo w
   console.log(string.substring(3, 7)); //lo w
   console.log(string.substr(3, 7)); //lo worl
```

```js
    var string = 'hello world';  // length = 11
    console.log(string.slice(-3));  // rld    slice(8)
    console.log(string.substring(-3));  //hello world  substring(0)
    console.log(string.substr(-3));  // rld  substr(8)
    console.log(string.slice(3, -4));  //lo w slice(3, 7)
    console.log(string.substring(3, -4)); //hel   substring(3, 0)
    console.log(string.substr(3, -4)); //  ''   substring(3, 0)
```

> 原文链接：[快速区分slice()、substring()、substr()](https://blog.csdn.net/qq_38209578/article/details/86086550)
