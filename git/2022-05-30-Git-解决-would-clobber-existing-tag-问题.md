## 问题

```shell
> git pull --tags origin master
From https://github.com/MY/REPO
* branch            master     -> FETCH_HEAD
! [rejected]        latest     -> latest  (would clobber existing tag)
9428765..935da94  master     -> origin/master
```

## 原因

我删了原有的一个 tag，然后重新创建了一个相同名字的。

## 解决方式

```shell
# 强制刷新一下本地的tags
$ git fetch --tags -f
```

原文： [Git 解决 would clobber existing tag 问题](http://kerwenzhang.github.io/git/2020/09/25/Git-Tag-Force-Update/)
