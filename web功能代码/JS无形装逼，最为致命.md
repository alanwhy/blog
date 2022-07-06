###日历
创建过去七天的数组，如果将代码中的减号换成加号，你将得到未来7天的数组集合
```
// 创建过去七天的数组
[...Array(7).keys()].map(days => new Date(Date.now() - 86400000 * days));
```
###生成随机ID
```
// 生成长度为11的随机字母数字字符串
Math.random().toString(36).substring(2);
```
###获取URL的查询参数
```
// 获取URL的查询参数
q={};location.search.replace(/([^?&=]+)=([^&]+)/g,(_,k,v)=>q[k]=v);q;
```
###本地时间
```
// 创建本地时间
<body onload="setInterval(()=>document.body.innerHTML=new Date().toLocaleString().slice(10,19))"></body>
```
###数组混淆
```
// 随机更改数组元素顺序，混淆数组
(arr) => arr.slice().sort(() => Math.random() - 0.5)
```
###生成随机十六进制代码（生成随机颜色）
```
// 生成随机十六进制代码 如：'#c618b2'
'#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');
```
###数组去重
```
// 数组去重
[...new Set(arr)]
```
###创建特定大小的数组
```
[...Array(3).keys()]
```
###返回一个键盘（惊呆了）
```
// 用字符串返回一个键盘图形
(_=>[..."`1234567890-=~~QWERTYUIOP[]\\~ASDFGHJKL;'~~ZXCVBNM,./~"].map(x=>(o+=`/${b='_'.repeat(w=x<y?2:' 667699'[x=["BS","TAB","CAPS","ENTER"][p++]||'SHIFT',p])}\\|`,m+=y+(x+'    ').slice(0,w)+y+y,n+=y+b+y+y,l+=' __'+b)[73]&&(k.push(l,m,n,o),l='',m=n=o=y),m=n=o=y='|',p=l=k=[])&&k.join`
`)()
```
> 原文链接：[JS无形装逼，最为致命](https://juejin.im/post/5cc55eb5e51d456e577f93f0)
