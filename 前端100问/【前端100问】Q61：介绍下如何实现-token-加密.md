### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [介绍下如何实现 token 加密](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/106)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

jwt 举例

1. 需要一个 secret（随机数）
2. 后端利用 secret 和加密算法(如：HMAC-SHA256)对 payload(如账号密码)生成一个字符串(token)，返回前端
3. 前端每次 request 在 header 中带上 token
4. 后端用同样的算法解密

![jwt](https://upload-images.jianshu.io/upload_images/12877063-d649434348cbb57f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
