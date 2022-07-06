<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:53:52
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/前端100问/【前端100问】Q91：介绍下-HTTPS-中间人攻击.md
-->
### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [介绍下 HTTPS 中间人攻击](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/142)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

https 协议由 http + ssl 协议构成，具体的链接过程可参考[SSL 或 TLS 握手的概述](https://github.com/lvwxx/blog/issues/3)

中间人攻击过程如下：

1. 服务器向客户端发送公钥。
2. 攻击者截获公钥，保留在自己手上。
3. 然后攻击者自己生成一个【伪造的】公钥，发给客户端。
4. 客户端收到伪造的公钥后，生成加密 hash 值发给服务器。
5. 攻击者获得加密 hash 值，用自己的私钥解密获得真秘钥。
6. 同时生成假的加密 hash 值，发给服务器。
7. 服务器用私钥解密获得假秘钥。
8. 服务器用加秘钥加密传输信息

防范方法：

- 服务端在发送浏览器的公钥中加入 CA 证书，浏览器可以验证 CA 证书的有效性
