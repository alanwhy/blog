<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:29
 * @LastEditTime: 2022-07-06 09:27:04
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/开发工具/Prettier+VScode-配置说明.md
-->
###Prettier 是什么
Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

以上是 github 上的官方解释，其实就是简单的代码格式工具，和 esLint 不同在于，ESLint 只是一个代码质量工具(确保没有未使用的变量、没有全局变量，等等)。而 Prettier 只关心格式化文件(最大长度、混合标签和空格、引用样式等)。可见，代码格式统一的问题，交给 Prettirer 再合适不过了。和 Eslint 配合使用，风味更佳。

###这里介绍 VSCode 中如何配置 Prettier #####安装 Prettier 插件  [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) #####添加自定义配置文件.prettierrc

```
   {
      "singleQuote": true,
      "trailingComma": "es5",
      "printWidth": 140,
      "overrides": [
        {
          "files": ".prettierrc",
          "options": { "parser": "json" }
        }
      ]
    }
```

系统设置中增加`"editor.formatOnSave": true`即可自动保存，还要注意的一点是，如果同时设置了`"files.autoSave": "autoSaveDelay"`,保存及格式化会失效。`files.autoSave`配置成别的选项即可。

![配置.png](https://upload-images.jianshu.io/upload_images/12877063-cc2546c7f84cf259.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###结语
prettier 只关心代码格式，显然是不够的。项目中还是要引入 ESlint。两者配合才能使项目代码优雅健壮

> 原文链接：# [Prettier+VScode 治好你的代码洁癖](https://segmentfault.com/a/1190000016579279)
