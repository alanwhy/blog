###1.创建局部指令
```
var app = new Vue({
    el: '#app',
    data: {    
    },
    // 创建指令(可以多个)
    directives: {
        // 指令名称
        dir1: {
            inserted(el) {
                // 指令中第一个参数是当前使用指令的DOM
                console.log(el);
                console.log(arguments);
                // 对DOM进行操作
                el.style.width = '200px';
                el.style.height = '200px';
                el.style.background = '#000';
            }
        }
    }
})
```
###2.全局指令
```
Vue.directive('dir2', {
    inserted(el) {
        console.log(el);
    }
})
```
###3.指令的使用
```
<div id="app">
    <div v-dir1></div>
    <div v-dir2></div>
</div>
```
