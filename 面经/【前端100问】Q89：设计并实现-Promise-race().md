### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [设计并实现 Promise.race()](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/140)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

顾名思义，Promse.race就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。

race的使用场景就是，多台服务器部署了同样的服务端代码，假如我要获取一个商品列表接口，我可以在 race 中写上所有服务器中的查询商品列表的接口地址，哪个服务器响应快，就从哪个服务器拿数据。

```js
Promise._race = promises => new Promise((resolve, reject) => {
	promises.forEach(promise => {
		promise.then(resolve, reject)
	})
})
```
