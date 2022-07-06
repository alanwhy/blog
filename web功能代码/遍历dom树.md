<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:58:54
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/web功能代码/遍历dom树.md
-->

```
function traversal(node) {
    //对node的处理
    if (node && node.nodeType === 1) {
        console.log(node.tagName);
    }
    var i = 0,
        childNodes = node.childNodes,
        item;
    for (; i < childNodes.length; i++) {
        item = childNodes[i];
        if (item.nodeType === 1) {
            //递归先序遍历子节点
            traversal(item);
        }
    }
}
```

> 原文链接：[如何遍历一个 dom 树](https://github.com/airuikun/Weekly-FE-Interview/issues/4)
