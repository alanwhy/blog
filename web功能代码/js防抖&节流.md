<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:59:21
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/web功能代码/js防抖&节流.md
-->
###防抖（debounce）
**思路**：在第一次触发事件时，不立即执行函数，而是给出一个期限值比如 200ms，然后：

- 如果在 200ms 内没有再次触发滚动事件，那么就执行函数
- 如果在 200ms 内再次触发滚动事件，那么当前的计时取消，重新开始计时

**效果**：如果短时间内大量触发同一事件，只会执行一次函数。
**实现**：既然前面都提到了计时，那实现的关键就在于 setTimeOut 这个函数，由于还需要一个变量来保存计时，考虑维护全局纯净，可以借助闭包来实现

```
function debounce(fn,delay){
    let timer = null //借助闭包
    return function() {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(fn,delay) // 简化写法
    }
}
// 然后是旧代码
function showTop  () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = debounce(showTop,1000)
```

####书《JavaScript 高级程序设计》中看到的样子

```
var processor = {
  timeoutId: null, // 相当于延时setTimeout的一个标记，方便清除的时候使用

  // 实际进行处理的方法
  // 连续触发停止以后需要触发的代码
  performProcessiong: function () {
    // 实际执行的代码
    // 这里实际就是需要在停止触发的时候执行的代码
  },

  // 初始处理调用的方法
  // 在实际需要触发的代码外面包一层延时clearTimeout方法，以便控制连续触发带来的无用调用
  process: function () {
    clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间

    var that = this; // 我们需要保存作用域，因为下面的setTimeout的作用域是在window，调用不要我们需要执行的this.performProcessiong方法
    this.timeoutId = setTimeout(function () { // 100毫秒以后执行performProcessiong方法
      that.performProcessiong();
    }, 100) // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
  }
};

// 尝试开始执行
processor.process(); // 需要重新绑定在一个触发条件里
```

###节流（throttle）
**思路**：设计一种类似控制阀门一样定期开放的函数，也就是让函数执行一次后，在某个时间段内暂时失效，过了这段时间后再重新激活（类似于技能冷却时间）
**效果**：如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。
**实现**：这里借助 setTimeout 来做一个简单的实现，加上一个状态位 valid 来表示当前函数是否处于工作状态：

```
function throttle(fn,delay){
    let valid = true
    return function() {
       if(!valid){
           //休息时间 暂不接客
           return false
       }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}
/* 请注意，节流函数并不止上面这种实现方案,
   例如可以完全不借助setTimeout，可以把状态位换成时间戳，然后利用时间戳差值是否大于指定间隔时间来做判定。
   也可以直接将setTimeout的返回的标记当做判断条件-判断当前定时器是否存在，如果存在表示还在冷却，并且在执行fn之后消除定时器表示激活，原理都一样
    */

// 以下照旧
function showTop  () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = throttle(showTop,1000)
```

如果一直拖着滚动条进行滚动，那么会以 1s 的时间间隔，持续输出当前位置和顶部的距离

###常用到的场景

- 返回顶部问题
- 搜索框 input 事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如 500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。
- 页面 resize 事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行 dom 渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）

> 原文链接：# [浅谈 js 防抖和节流](https://segmentfault.com/a/1190000018428170)
