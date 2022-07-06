### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [A、B 机器正常连接后，B 机器突然重启，问 A 此时处于 TCP 什么状态](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/21)

### 正文回答

### 超纲题目 做出回答 了解即可

A 侧的 TCP 链路状态在未发送任何数据的情况下与等待的时间相关，如果在多个超时值范围以内那么状态为`established`;如果触发了某一个超时的情况那么视情况的不同会有不同的改变。

一般情况下不管是 KeepAlive 超时还是内核超时，只要出现超时，那么必然会抛出异常，只是这个异常截获的时机会因编码方式的差异而有所不同。（同步异步 IO，以及有无使用 select、poll、epoll 等 IO 多路复用机制）
