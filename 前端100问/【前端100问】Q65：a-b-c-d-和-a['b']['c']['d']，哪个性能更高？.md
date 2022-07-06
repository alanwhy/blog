<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:53:07
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/前端100问/【前端100问】Q65：a-b-c-d-和-a['b']['c']['d']，哪个性能更高？.md
-->
### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [a.b.c.d 和 a['b']['c']['d']，哪个性能更高？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/111)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

应该是 `a.b.c.d` 比 `a['b']['c']['d']` 性能高点，后者还要考虑 [ ] 中是变量的情况，再者，从两种形式的结构来看，显然编译器解析前者要比后者容易些，自然也就快一点。

![q65-1.png](https://upload-images.jianshu.io/upload_images/12877063-778da67ab1a1f85e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
