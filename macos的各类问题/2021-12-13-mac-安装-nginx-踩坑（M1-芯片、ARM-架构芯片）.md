<!--
 * @Author: wuhaoyuan
 * @Date: 2021-12-13 17:34:24
 * @LastEditTime: 2021-12-13 20:15:54
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /undefined/Users/wuhaoyuan/Desktop/mac 安装 nginx.md
-->

## 问题一 没有 brew

安装 brew

```shell
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# version
$ brew -v
```

## 问题二 brew update 报错

```shell
# 报错信息
$ brew update
error: Not a valid ref: refs/remotes/origin/master
fatal: Could not resolve HEAD to a revision
Already up-to-date.
```

```shell
$ cd /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core
$ ls -al
total 0
drwxr-xr-x   3 zuige  admin   96  7 11 00:21 .
drwxr-xr-x   3 zuige  admin   96  7 11 02:15 ..
drwxr-xr-x  12 zuige  admin  384  7 18 01:03 .git

# 发现只有一个.git文件

# 在该路径下执行
$ git fetch --prune origin
$ git pull --rebase origin master
From https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core
 * branch                  master     -> FETCH_HEAD
Updating files: 100% (5370/5370), done.
```

问题解决

```shell
$ brew update
Already up-to-date.
```

## 问题三 不支持安装 ARM 架构的 nginx

```shell
# 报错内容

Cannot install in Homebrew on ARM processor in Intel default prefix (/usr/local)!
```

1. 关闭所有的终端
2. 访达 => 应用程序 => 实用工具
3. 右键终端.app，显示简介
4. 将 【使用 Rosetta】勾选
5. 重新打开终端，执行`brew install`

p.s. **安装完成后，记得将勾选去掉**

## 问题四 权限不足

报错内容

```shell
Error: The following directories are not writable by your user:
/usr/local/lib/pkgconfig

You should change the ownership of these directories to your user.
  sudo chown -R $(whoami) /usr/local/lib/pkgconfig

And make sure that your user has write permission.
  chmod u+w /usr/local/lib/pkgconfig
```

直接用

```shell
$ sudo brew install nginx

# 报错

Error: Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
build scripts full access to your system.
```

按照提示解决

```
$ sudo chown -R $(whoami) /usr/local/lib/pkgconfig
$ chmod u+w /usr/local/lib/pkgconfig
```

安装 nginx

```shell
$ brew install nginx

# success log
...

Docroot is: /usr/local/var/www

The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /usr/local/etc/nginx/servers/.

To restart nginx after an upgrade:
  brew services restart nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon off;
```

## 问题五 如何启动/停止/重启 nginx

```shell
# 启动
$ brew services start nginx

# 关闭
$ brew services stop nginx

# 重启
$ brew services restart nginx
```

但是这种启动方式会存在修改的配置文件不生效

```shell
# 启动
$ nginx

# 重新加载配置文件
$ nginx -s reload

# 停止
$ nginx -s stop
```
