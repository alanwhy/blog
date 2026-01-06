<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:58:39
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/Vue/Vue2-0生命周期--补习.md
-->
######说明
因为自己对 Vue 生命周期老忘，对有些钩子不是很常用，所以特意再温习一遍，顺便更新文章~借鉴了一位兄台的总结。 ###一张图
![vue生命周期.png](https://upload-images.jianshu.io/upload_images/12877063-b47f4db19cd7d849.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###一段代码

```
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/vue/2.1.3/vue.js"></script>
</head>
<body>

<div id="app">
     <p>{{ message }}</p>
</div>

<script type="text/javascript">

  var app = new Vue({
      el: '#app',
      data: {
          message : "xuxiao is boy"
      },
       beforeCreate: function () {
                console.group('beforeCreate 创建前状态===============》');
               console.log("%c%s", "color:red" , "el     : " + this.$el); //undefined
               console.log("%c%s", "color:red","data   : " + this.$data); //undefined
               console.log("%c%s", "color:red","message: " + this.message)
        },
        created: function () {
            console.group('created 创建完毕状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el); //undefined
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化
        },
        beforeMount: function () {
            console.group('beforeMount 挂载前状态===============》');
            console.log("%c%s", "color:red","el     : " + (this.$el)); //已被初始化
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化
        },
        mounted: function () {
            console.group('mounted 挂载结束状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el); //已被初始化
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data); //已被初始化
               console.log("%c%s", "color:red","message: " + this.message); //已被初始化
        },
        beforeUpdate: function () {
            console.group('beforeUpdate 更新前状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data);
               console.log("%c%s", "color:red","message: " + this.message);
        },
        updated: function () {
            console.group('updated 更新完成状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data);
               console.log("%c%s", "color:red","message: " + this.message);
        },
        beforeDestroy: function () {
            console.group('beforeDestroy 销毁前状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data);
               console.log("%c%s", "color:red","message: " + this.message);
        },
        destroyed: function () {
            console.group('destroyed 销毁完成状态===============》');
            console.log("%c%s", "color:red","el     : " + this.$el);
            console.log(this.$el);
               console.log("%c%s", "color:red","data   : " + this.$data);
               console.log("%c%s", "color:red","message: " + this.message)
        }
    })
</script>
</body>
</html>
```

###一些说明

- `beforecreated`：el 和 data 并未初始化
- `created`:完成了 data 数据的初始化，el 没有 ，可以进行和后台数据的请求，之后一起渲染 DOM，如果请求的数据跟 DOM 没啥关系，可以放到`mounted`中（但是请求是异步，所以体验可能也还好）
- `beforeMount`：完成了 el 和 data 初始化，未挂载
- `mounted` ：完成挂载
- `beforeDestroy`：整个 Vue 实例都在，可以进行正常的操作，但是函数执行完，就将全部销毁
- `destroyed`：vue 实例销毁，什么都干不了了

> 原文链接：[Vue2.0 探索之路——生命周期和钩子函数的一些理解](https://segmentfault.com/a/1190000008010666)
