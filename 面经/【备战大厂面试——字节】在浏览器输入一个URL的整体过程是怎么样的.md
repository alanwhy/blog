<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:27:26
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/面经/【备战大厂面试——字节】在浏览器输入一个URL的整体过程是怎么样的.md
-->
![在浏览器输入一个URL的整体过程是怎么样的.png](https://upload-images.jianshu.io/upload_images/12877063-47f8d20e3b1ed52c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. 当我们在浏览器地址栏按下键盘的时候，浏览器就会启动一个算法去书签栏和历史记录中按照我们输入的字母进行筛选、展示一个我们可能会访问的 URL

2. 当我们选定了 URL 按下回车时，浏览器就会开始构建请求行，然后检测这个域名是否合法，如果合法就将此任务给网络请求线程

3. 构建好请求行后就会去检测强缓存是否有效（这个步骤不会发送网络请求），如果无效，就会开始调用 DNS 协议进行域名解析，如果之前访问过这个 URL，那么浏览器会把 DNS 解析后的 IP 地址保存下来，下次访问就直接命中（大概可以节约 50~200ms），如果没有就需要去网络运营商或者 DNS 服务器上寻找

4. 拿到 DNS 解析的 IP 地址后，就会构建 HTTP 请求，开始 TCP 三次握手建立稳定链接：客户端向服务器发送一个 SYN（同步序列编码），服务端收到后返回一个新的 SYN + ACK（在第一个 SYN 上做计算后生成的回复消息），客户端收到后回复一个 ACK，三次握手建立完毕。为什么是三次？两次太少，四次太多

5. 建立好三次握手后，TCP 协议为了传输方便，会将 HTTP 报文切割并编码成一个个数据包，随后转交给网络层

6. 网络层拿到这些数据包后，通过 IP 地址，配合 ARP 协议反查出 MAC 地址，开始传输数据
   服务器收到这些数据后，将在 TCP 传输层协议中被分割的报文还原成完整的，这个时候一般会校验是否有权限、是否设置了缓存以及是否过期等。如果设置了协商缓存，那么会返回 304 状态码通知浏览器使用协商缓存（这里可以把协商缓存的字段也说下），否则开始响应。响应完毕后，服务器会判断 Connection 字段是否为 keep-alive（在 HTTP 1.1 中是默认值），不是则断开

7. 接下来就是浏览器开始解析请求到的文件，首先调用 GUI 线程并行解析 HTML 和 CSS 文件，对 HTML 文件使用标记化和建树算法，根据文件中设置的<!DOCTYPE>标准来生成 DOM 树，对 CSS 文件进行格式化和标准化生成 CSSOM 树，最后合并成合成树。注意 HTML 和 CSS 文件解析是互不影响的，但是会影响最后的合成树生成的速度，所以 CSS 文件中不要放@import，它总是在 CSS 文件解析完毕后再去加载对应的资源

8. 另外 GUI 线程和 JS 线程是互斥的，当解析到 HTML 文件中的 script 标签时，就会挂起 GUI 线程，从而阻塞渲染，所以 script 标签中不要写 async，它总是异步加载，然后立即执行，但你可以写 defer
   拿到合成树后，为了提高渲染效率，因为复杂的图层总是会由 GUP 单独绘制（GPU 加速），不会影响其他的图层，所以开始创建图层树。普通文档流可以算是复杂图层，除此之外 absolute、transform、opacity、canvas 等元素都能形成复杂图层，所以说动画最好放在 absolute 等元素上、用 transform 代替 left/top

9. 浏览器将这些图层的绘制生成一个个绘制指令，然后交给合成池去进行绘制，生成图块和位图，最后显示出当前的页面

> 原文链接：[网上看到的字节面试题，不自量力写下答案](https://juejin.im/post/6844904178750324750)
