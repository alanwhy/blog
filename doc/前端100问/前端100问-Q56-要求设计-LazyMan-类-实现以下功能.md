### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [要求设计 LazyMan 类，实现以下功能。](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/98)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

##### 题目

```js
LazyMan("Tony");
// Hi I am Tony

LazyMan("Tony").sleep(10).eat("lunch");
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan("Tony").eat("lunch").sleep(10).eat("dinner");
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan("Tony")
  .eat("lunch")
  .eat("dinner")
  .sleepFirst(5)
  .sleep(10)
  .eat("junk food");
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

##### 回答

```js
class LazyManClass {
  constructor(name) {
    this.taskList = [];
    this.name = name;
    console.log(`Hi I am ${this.name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  eat(name) {
    var that = this;
    var fn = (function (n) {
      return function () {
        console.log(`I am eating ${n}`);
        that.next();
      };
    })(name);
    this.taskList.push(fn);
    return this;
  }
  sleepFirst(time) {
    var that = this;
    var fn = (function (t) {
      return function () {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.unshift(fn);
    return this;
  }
  sleep(time) {
    var that = this;
    var fn = (function (t) {
      return function () {
        setTimeout(() => {
          console.log(`等待了${t}秒...`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.push(fn);
    return this;
  }
  next() {
    var fn = this.taskList.shift();
    fn && fn();
  }
}
function LazyMan(name) {
  return new LazyManClass(name);
}
```

```js
function LazyMan(name) {
  class Man {
    constructor(name) {
      this._queues = [];
      console.log(`Hi I am ${name}`);
      Promise.resolve().then(() => {
        this.next();
      });
      return this;
    }

    _sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time * 1000));
    };

    eat(type) {
      this._queues.push(() => {
        console.log(`I am eating ${type}`);
        this.next();
      });
      return this;
    }
    sleepFirst(time) {
      this._queues.unshift(() => {
        this._sleep(time).then(() => {
          console.log(`等待了${time}秒`);
          this.next();
        });
      });
      return this;
    }

    sleep(time) {
      this._queues.push(() => {
        this._sleep(time).then(() => {
          console.log(`等待了${time}秒`);
          this.next();
        });
      });
      return this;
    }

    next() {
      const fn = this._queues.shift();
      fn && fn();
    }
  }

  return new Man(name);
}
```

```js
function LazyMan(username) {
  console.log(" Hi I am " + username);

  var temp = {
    taskList: [],
    sleepFirst(timeout) {
      return () => {
        setTimeout(() => {
          console.log(`等待了${timeout}秒...`);
          this.next();
        }, timeout * 1000);
      };
    },
    sleep(timeout) {
      return () => {
        setTimeout(() => {
          console.log(`等待了${timeout}秒...`);
          this.next();
        }, timeout * 1000);
      };
    },
    eat(type) {
      return () => {
        console.log(`I am eating ${type}`);
        this.next();
      };
    },
    next() {
      var fn = this.taskList.shift();
      fn && fn();
    },
  };

  var proxy = new Proxy(temp, {
    get(target, key, receiver) {
      return function (...rest) {
        if (key === "sleepFirst") {
          target.taskList.unshift(target[key](rest));
        } else {
          target.taskList.push(target[key](rest));
        }
        return receiver;
      };
    },
  });

  setTimeout(() => {
    temp.next();
  }, 0);
  return proxy;
}
```
