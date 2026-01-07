### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

1. `display: none` (不占空间，不能点击)（场景，显示出原来这里不存在的结构）会回流操作 性能开销较大
2. `visibility: hidden`（占据空间，不能点击）（场景：显示不会导致页面结构发生变动，不会撑开）是重回操作 比回流操作性能高一些
3. `opacity: 0`（占据空间，可以点击）（场景：可以跟 transition 搭配）自定义图片上传按钮，重建图层，性能较高

补充：株连性
如果祖先元素遭遇某祸害，则其子孙无一例外也要遭殃，比如：
`opacity:0` 和 `display:none`，若父节点元素应用了 `opacity:0` 和 `display:none`，无论其子孙元素如何挣扎都不会再出现在大众视野；
而若父节点元素应用 `visibility:hidden`，子孙元素应用 `visibility:visible`，那么其就会毫无意外的显现出来。

##### 总结一下

结构：
`display:none`: 会让元素完全从渲染树中消失，渲染的时候不占据任何空间, 不能点击，
`visibility: hidden`:不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，不能点击
`opacity: 0`: 不会让元素从渲染树消失，渲染元素继续占据空间，只是内容不可见，可以点击

继承：
`display: none`和`opacity: 0`：是非继承属性，子孙节点消失由于元素从渲染树消失造成，通过修改子孙节点属性无法显示。
`visibility: hidden`：是继承属性，子孙节点消失由于继承了 hidden，通过设置 visibility: visible;可以让子孙节点显式。

性能：
`display: none` : 修改元素会造成文档回流,读屏器不会读取 display: none 元素内容，性能消耗较大
`visibility:hidden`: 修改元素只会造成本元素的重绘,性能消耗较少读屏器读取 visibility: hidden 元素内容
`opacity: 0`：修改元素会造成重绘，性能消耗较少

联系：它们都能让元素不可见
