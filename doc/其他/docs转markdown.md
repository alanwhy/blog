<!--
 * @Author: wuhaoyuan
 * @Date: 2022-09-14 12:40:21
 * @LastEditTime: 2022-09-14 12:41:31
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/其他/docs转markdown.md
-->

# docs 转 markdown

## 安装软件

官网：<https://pandoc.org/installing.html>

鉴于官网使用 Github 地址提供下载的速度问题，也可以使用我的网盘地址（请放心没有限速无需下载软件无需注册登录）：

<https://pan.bilnn.com/s/NPzYIl>

## 输入命令

```shell
pandoc -f docx -t markdown -o output.md input.docx
```

- `-f docx`：指定源文件为 docx 格式（from）
- `-t markdown`：指定我们要转为 md 格式（to）
- `-o output.md`：表示输出的文件名为 output.md（output）
- `input.docx`：表示要转换的文件为 input.docx

## 注意

这个软件还是存在一个问题：图片无法导入，需要手动重新设置，目前无较好的解决方案。

> 原文：<https://blog.csdn.net/weixin_44495599/article/details/120394498>
