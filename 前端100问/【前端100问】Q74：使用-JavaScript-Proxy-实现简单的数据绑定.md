### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [使用 JavaScript Proxy 实现简单的数据绑定](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/123)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```html
<body>
  hello,world
  <input type="text" id="model" />
  <p id="word"></p>
</body>
<script>
  const model = document.getElementById("model");
  const word = document.getElementById("word");
  var obj = {};

  // Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  // const p = new Proxy(target, handler)
  const newObj = new Proxy(obj, {
    // 属性读取操作的捕捉器。
    get: function (target, key, receiver) {
      console.log(`getting ${key}!`);
      // Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。Reflect不是一个函数对象，因此它是不可构造的。
      // https://developer.mozilla.org/zh-cn/docs/web/javascript/reference/global_objects/reflect
      return Reflect.get(target, key, receiver);
    },
    // 属性设置操作的捕捉器。
    set: function (target, key, value, receiver) {
      console.log("setting", target, key, value, receiver);
      if (key === "text") {
        model.value = value;
        word.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });

  model.addEventListener("keyup", function (e) {
    newObj.text = e.target.value;
  });
</script>
```
