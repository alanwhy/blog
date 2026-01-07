> 原文链接：[浅谈 JS 复制](http://www.miaoqiyuan.cn/p/js-copy)

##需求
点击按钮实现复制 用户名的功能 ##问题分析
使用 window.clipboardData 实现了 IE 下的复制功能，但不支持 Chrome 等其他浏览器
百度发现了 Zepto.js，非常好用 ##解决思路
Chrome/Firefox 支持 Window.getSelection，做了简单的封装，替换掉 Zepto.js，有简化掉了很多代码 ##代码实现

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JS复制 演示/支持IE、Chrome，兼容电脑、手机 - miaoqiyuan.cn</title>
    <style type="text/css">
      html {
      }

      body {
        margin: 0;
        background: #eee;
      }

      h2 {
        text-align: center;
        font-family: "Microsoft Yahei";
      }

      button {
        float: right;
      }

      .demo-list {
        width: 300px;
        margin: 10px auto;
      }

      .demo-list-item {
        background: #fafafa;
        border: solid 5px #ddd;
        border-radius: 15px;
        padding: 15px;
        margin-top: 15px;
      }
    </style>
    <script type="text/javascript">
      function copy(domId) {
        if (copyDom(document.getElementById(domId))) {
          alert("复制成功");
        } else {
          alert("当前浏览器不支持");
        }
      }

      function copyDom(dom) {
        if ("clipboardData" in window) {
          window.clipboardData.setData("Text", dom.value || dom.innerText || dom.innerHTML);
        } else if ("execCommand" in document && "getSelection" in window) {
          var domType = "input";
          try {
            dom.select();
          } catch (e) {
            domType = "text";
            window.getSelection().selectAllChildren(dom);
          }
          document.execCommand("Copy");
          if (domType == "input") {
            dom.blur();
          } else {
            window.getSelection().empty();
          }
        } else {
          return false;
        }
        return true;
      }
    </script>
  </head>

  <body>
    <h2><a href="http://www.miaoqiyuan.cn/p/js-copy">JS复制 演示/支持IE、Chrome，兼容电脑、手机</a></h2>
    <div class="demo-list">
      <div class="demo-list-item">
        <button onclick="copy('demo_div');">复制</button>
        <div id="demo_div">DIV</div>
      </div>
      <div class="demo-list-item">
        <button onclick="copy('demo_input');">复制</button>
        <input id="demo_input" value="INPUT" /><br />(不支持iPhone)
      </div>
      <div class="demo-list-item">
        <button onclick="copy('demo_textarea');">复制</button>
        <textarea id="demo_textarea">TEXTAREA</textarea><br />(不支持iPhone)
      </div>
      <div class="demo-list-item">
        <button onclick="copy('demo_divs');">复制</button>
        <div id="demo_divs">
          <p>DIVS</p>
          <p>DIVS</p>
        </div>
      </div>
    </div>
  </body>
</html>
```

##测试地址
[http://www.miaoqiyuan.cn/products/copy.html](http://www.miaoqiyuan.cn/products/copy.html)
