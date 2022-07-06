<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 14:33:42
 * @LastEditTime: 2022-07-06 14:34:52
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/Vue/为什么 Vue2 this 能够直接获取到 data 和 methods ?.md
-->

# 为什么 Vue2 this 能够直接获取到 data 和 methods ?

原文：[为什么 Vue2 this 能够直接获取到 data 和 methods ?](https://juejin.cn/post/7112255428452417549)

通过 `this` 直接访问到 `methods` 里面的函数的原因是：因为 `methods` 里的方法通过 `bind` 指定了 `this` 为 `new Vue` 的实例(`vm`)。

通过 `this` 直接访问到 `data` `里面的数据的原因是：data` 里的属性最终会存储到 `new Vue` 的实例（`vm`）上的 `_data` 对象中，访问 `this.xxx`，是访问 `Object.defineProperty` 代理后的 `this._data.xxx`。
