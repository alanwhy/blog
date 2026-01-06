# 20200812

### 设置全局基础配置

```
git config --global user.name "xxx" // 请换成你自己的名字
git config --global user.email "xxx@xx.com" // 请换成你自己的邮箱
git config --global push.default simple // 要求 Git 版本 1.9.5 以上
git config --global core.autocrlf false // 让Git不要管Windows/Unix换行符转换的事
git config --global core.ignorecase false // windows设置大小写敏感
```

### 指令将远程分支上的最新的修改下载下来

```
git fetch
git fetch origin master
```

### git pull

```
git pull =>git fetch 和 git merge
```

### 将远程分支代码同步到本地

```
git fetch origin dev（dev为远程仓库的分支名）
// 在本地创建分支dev并切换到该分支
git checkout -b dev(本地分支名称) origin/dev(远程分支名称)
// 把某个分支上的内容都拉取到本地
git pull origin dev(远程分支名称)
```

### 查看分支情况

```
git branch #查看本地所有分支
git branch -r #查看远程所有分支
git branch -a #查看本地及远程的所有分支
```

### 切换分支

```
// 切换到master分支
git checkout master
```

# 20200907

### 将某个远程主机的更新，全部取回本地

```
git fetch
```
