<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:57:42
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/git/web-项目如何进行-git-多人协作开发.md
-->
web 项目的 git 使用要复杂一些，需要管理好哪些是正在开发的代码、哪些是提交测试的代码、哪些是已经上线的代码、多人共同开发时如何避免代码冲突与线上新代码被旧代码覆盖等等。

### 1. 一个分支

![image.png](https://upload-images.jianshu.io/upload_images/12877063-fb1ab86d86f2365b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
提交代码到本地 master 分支，并推送到远程 master 分支
持续集成构建或本地构建，然后上传到服务器

### 2. 开发分支与个人分支

![image.png](https://upload-images.jianshu.io/upload_images/12877063-20ca854e8c032953.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

提交代码到本地 dev 分支
在需要构建项目时 merge 到本地 master 分支，并推送到远程 master 分支
持续集成构建，然后同步到服务器

是多人参与的项目，就需要个人开发分支了
![image.png](https://upload-images.jianshu.io/upload_images/12877063-d94feed358f7f322.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
提交代码到本地 man1 分支（以 man1 个人为例）
在需要构建项目时 merge 到本地 master 分支，并推送到远程 master 分支（有可能需要先 pull 远程的代码）
持续集成构建，然后同步到服务器

### 3. 多个服务器环境

![image.png](https://upload-images.jianshu.io/upload_images/12877063-4f948571f16feb9e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

提交代码到本地 dev 分支
在需要构建项目时 merge 到本地 test 分支，并推送到远程 test 分支
持续集成构建，然后同步到测试服务器
构建产品环境可以由远程的 test 分支 merge 到远程 prod 分支进行持续集成构建，也可由本地 dev 或 test 分支 merge 到本地 prod 分支，并推送到远程 prod 分支进行持续集成构建。

是多人参与的项目，就需要个人开发分支
![image.png](https://upload-images.jianshu.io/upload_images/12877063-b14168fe885c7efe.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
提交代码到本地 man1 分支（以 man1 个人为例）
在需要构建项目时 merge 到本地 test 分支，并推送到远程 test 分支（有可能需要先 pull 远程的代码）
持续集成构建，然后同步到测试服务器
构建产品环境可以由远程的 test 分支 merge 到远程 prod 分支进行持续集成构建，也可由本地 man1 或 test 分支 merge 到本地 prod 分支，并推送到远程 prod 分支进行持续集成构建。

在适当的时候，每一个个人分支（如 man1, man2）都需要 pull 一下 prod 分支（如有需要，也可以 pull test 分支），以保证自己本地的代码的版本不会低于服务器。

### 4. 多个需求同时开发

![image.png](https://upload-images.jianshu.io/upload_images/12877063-228ab12e4e7d49fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
构建测试环境与之前的步骤一致，但构建产品环境时，为了保证各个需求不相互影响，一般由本地直接合并到 prod 分支：

本地 task1 分支 merge 到本地 prod 分支，并推送到远程 prod 分支进行持续集成构建
每一个个人分支（如 man1, man2）都需要 pull 一下 prod 分支，以保证自己本地的代码的版本不会低于服务器
最后删除 task1 分支

### 5. 多人协作开发修改公共文件

因为不同分支修改同一个文件而导致的文件冲突是多人协作开发中比较常见的问题之一，避免这种问题的思路主要有以下的几种：

在代码层面，尽量避免多个成员都会改动的文件，尽量将代码分解到每个人只负责自己的那块代码，不需要去改别人的代码
在工程层面，尽量减少公共文件，尽量每个文件只由一个人负责
在 git 层面，如果有必要，可以单独建一个分支，用于更新某些公共文件，并及时的更新到其他分支

### 6. 其他分支

- bug 分支：用于紧急修复产品环境的 bug

> 原文链接：[web 项目如何进行 git 多人协作开发](https://github.com/senntyou/blogs/blob/master/misc/3.md)
