为什么要清除浮动？
是为了解决 父元素因为子元素的浮动而导致高度变成0的情况

代码如下
```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .root {
      width: 500px;
      background: red;
    }

    /*  这是通用的万金油写法
    .clearfix:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    } */
    
    /* 这是不考虑兼容低版本浏览器的写法*/
    .clearfix:before,
    .clearfix:after {
      content: "";
      display: table;
    }
    .clearfix:after {
      clear: both;
      overflow: hidden;
    }
    .clearfix {
      zoom: 1;
    }

    .big {
      float: left;
      width: 100px;
      height: 100px;
      background: orange;
    }

    .small {
      float: left;
      width: 50px;
      height: 50px;
      background: palegreen;
    }
  </style>
</head>

<body>
  <div class="root clearfix">
    <div class="big"></div>
    <div class="small"></div>
  </div>
</body>

</html>
```
