<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:53:16
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/前端100问/【前端100问】Q71：实现一个字符串匹配算法，从长度为-n-的字符串-S-中，查找是否存在字符串-T，T-的长度是-m，若存在返回所在位置.md
-->

### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [实现一个字符串匹配算法，从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置。](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/118)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

```js
// 因为 T 的 length 是一定的，所以在循环S的的时候 ，循环当前项 i 后面至少还有 T.length 个元素
const find = (S, T) => {
  if (S.length < T.length) return -1;
  for (let i = 0; i < S.length - T.length; i++) {
    if (S.substr(i, T.length) === T) return i;
  }
  return -1;
};
```

```js
// 方法一：
// search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。
const find = (S, T) => S.search(T);

// 方法二：
// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
const find = (S, T) => {
  const matched = S.match(T);
  return matched ? matched.index : -1;
};
```

```js
// 完全不用api
getIndexOf = function (s, t) {
  let n = s.length;
  let m = t.length;
  if (!n || !m || n < m) return -1;
  for (let i = 0; i < n; i++) {
    let j = 0;
    let k = i;
    if (s[k] === t[j]) {
      k++;
      j++;
      while (k < n && j < m) {
        if (s[k] !== t[j]) break;
        else {
          k++;
          j++;
        }
      }
      if (j === m) return i;
    }
  }
  return -1;
};
```
