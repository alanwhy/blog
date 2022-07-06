### v-for、v-if不要一起使用
（老生常谈的东西，主要是有个比较好的图片来解释）

`v-for` 的优先级其实是比 `v-if` 高的，所以当两个指令出现来一个DOM中，那么 `v-for` 渲染的当前列表，每一次都需要进行一次 `v-if` 的判断。而相应的列表也会重新变化，这个看起来是非常不合理的。因此当你需要进行同步指令的时候。尽量使用计算属性，先将 `v-if` 不需要的值先过滤掉。他看起像是下面这样的。
```
// 计算属性
computed: {
  filterList: function () {
  return this.showData.filter(function (data) {
    return data.isShow
  })
}
  
// DOM
  
<ul>
  <li v-for="item in filterList" :key="item.id">
  {{ item.name }}
  </li>
</ul>
```
![image.png](https://upload-images.jianshu.io/upload_images/12877063-dd77811e4eb4ce99.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### v-for key避免使用index作为标识

其实大家都知道 `v-for` 是不推荐使用 index 下标来作为 key 的值，这是一个非常好理解的知识点，可以从图中看到，当index作为标识的时候，插入一条数据的时候，列表中它后面的key都发生了变化，那么当前的 `v-for` 都会对key变化的 Element 重新渲染，但是其实它们除了插入的 Element 数据都没有发生改变，这就导致了没有必要的开销。所以，尽量不要用index作为标识，而去采用数据中的唯一值，如 id 等字段。

![image.png](https://upload-images.jianshu.io/upload_images/12877063-664a9d812be21f17.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 长列表
项目当中，会涉及到非常多的长列表场景，区别于普通的分页来说，大部分的前端在做这种 无限列表 的时候，大部分新手前端都是通过一个 `v-for` 将数据遍历出来，想的多一点的就是做一个分页。滚动到底部的时候就继续请求 API 。其实这也是未思考妥当的。随着数据的加载，DOM会越来越多，这样就导致了性能开销的问题产生了，当页面上的DOM太多的时候，难免给我的客户端造成一定的压力，所以对于长列表渲染的时候，建议将DOM移除掉，类似于图片懒加载的模式，只有出现在视图上的DOM才是重要的DOM。网络上有一些很好的解决方案，如 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) 库等等，大家可以理性的选择。




> 接上文：[Vue项目性能优化](https://www.jianshu.com/p/def55b3aef81)
参考链接：[总结我对Vue项目上线做的一些基本优化](https://juejin.im/post/6850037281559543821)
