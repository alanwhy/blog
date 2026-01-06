### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [介绍 HTTPS 握手过程](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/70)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

1. 客户端使用 https 的 url 访问 web 服务器,要求与服务器建立 ssl 连接
2. web 服务器收到客户端请求后, 会将网站的证书(包含公钥)传送一份给客户端
3. 客户端收到网站证书后会检查证书的颁发机构以及过期时间, 如果没有问题就随机产生一个秘钥
4. 客户端利用公钥将会话秘钥加密, 并传送给服务端, 服务端利用自己的私钥解密出会话秘钥
5. 之后服务器与客户端使用秘钥加密传输

好文分享：[配置 SSL, 方法及须知原理](https://blog.csdn.net/dadadeganhuo/article/details/80265808)
