### 说明

element-ui 版本 2.13.0 ###需求
树为一颗异步树，该需求为通过其他按钮来触发树的选中状态，即 checkbox 的状态从 false 到 true，但是不需要执行选中 checkbox 的事件 ###实现方式

##### 1、初始化一颗异步树

```html
<el-tree
  ref="tree"
  :props="props"
  :load="loadNode"
  node-key="id"
  lazy
  check-strictly
  show-checkbox
  @check="handleCheck"
>
</el-tree>
```

此处的树一定要设置`node-key`属性和`ref`属性，以及选中的事件是`check`，而不是`check-change`
![api说明.png](https://upload-images.jianshu.io/upload_images/12877063-7d6fec64e443060b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 2、通过按钮来触发设置选中的节点

```html
<el-button @click="handleRegion">选中节点</el-button> ... handleRegion (data) { // 通过node去选中节点
this.$refs.tree.setChecked(data) // 通过key去选中节点 // this.$refs.tree.setCheckedKeys(data) } ...
```

通过上面代码的任意一行，传对参数，去选中节点
![api说明.png](https://upload-images.jianshu.io/upload_images/12877063-e6f11b94a5432582.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 参考 api：[element-ui tree 组件](https://element.eleme.cn/#/zh-CN/component/tree)
