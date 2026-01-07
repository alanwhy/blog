## 问题描述

- 提交记录中的大文件
- 拉取代码的时候很慢，甚至是失败

## 如何解决

**注意**：清理完之后,其他人一定要删掉之前拉取的项目,重新从 git 上拉项目,不要使用之前的项目了,之前的项目中的.git 文件会将已将删除的文件重新加进来,甚至变的更大

查询/清理文件的时候若是想提速,可以关掉 360/电脑管家等这样的软件,这些软件会监控文件,拖慢速度...我之前提示 8 小时的处理,关掉 360 之后 2 小时就完成了.

### 查看仓库大小

```shell
git count-objects -vH  # 查看当前仓库大小

du -sh  # 查看这个文件夹的总大小

ls -lh  # 查看这个文件夹中文件的大小
```

### 解除保护分支

默认情况下,git 项目是有一个保护分支的

![image.png](https://upload-images.jianshu.io/upload_images/12877063-22fc1b17b20981d8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 操作

#### 1. 拉取项目:将项目所有分支拉下来

```shell
git clone xxx # 默认拉取master分支
cd xx #进入拉取的文件夹
git branch -r | grep -v '\->' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
git fetch --all
git pull --all
```

#### 2. 查找大文件(若是知道具体的文件,不需要查)

```shell
# 将最大的10个文件查询下来
git rev-list --objects --all | grep "$(git verify-pack -v .git/objects/pack/*.idx | sort -k 3 -n | tail -10 | awk '{print$1}')"
# 比如我查询了
486fa66baeb237a456266dccfab8bab14cde98ba pro_web_front_202009101858.gz
d644ed6c55ecc6e058a0a7d0c39c4e49984a37d1 src/assets/img/2.png
f45b37335083ad5c5598e3cf5a75a9fc07b9a803 static/pdf/build/pdf.worker.js.map
21e9d2cd0c73b246d86f603c7ff0e5cd8b8312bc static/pdf/web/operationManual.pdf
7c65cab916684f43d66053e570dbdf453e8ca507 src/assets/img/login.png
f8aebc2a121c89c99190553ac9b3dcc853315182 src/assets/img/login_2.png
13868adfda3704f8a8b10f64da068a11a418ccf2 src/assets/img/login_3.png
# 其中需要删的是 pro_web_front_202009101858.gz
```

#### 3. 处理记录

```shell
# 文件可以是文件夹,也可以是文件 ,
# 例如:文件夹的话可以是  /dist.js/
# 例如:文件可以是  static/pdf/build/pdf.worker.js
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch 文件' --prune-empty --tag-name-filter cat -- --all
# 会在项目根目录生成 .git_....文件夹,里面就是改的记录
# 一次只能处理一个文件/文件夹

# 回收空间
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now
# 此时查看本地,会发现项目明显减小了,若是还有需要的文件,就重复第3步即可
# （p.s. 原作者说会减小，但是我这里整个工程还是跟原来的一样大，可能是因为我主要是删除历史文件，本地的问题并没有删除什么）
```

#### 4. 推送到服务器

```shell
git push origin --force --all
git remote prune origin
# 此时 ,拉取项目就已经是减小后的大小
# 但是查看服务器,服务器显示的大小还是原来的大小（p.s.这里是因为 gitlab 服务器本身也是有缓存的）
```

#### 5. 清理服务器缓存

```shell
# 进入git服务器-->这个操作需要root权限,不然连文件夹都进不去
cd /var/opt/gitlab/git-data/repositories
# 根据项目,进入对应的git项目文件夹
# 进入 项目.git文件,就可以看到和本地的.git目录中一样的目目录了
# 查询git项目大小
git count-objects -vH   # 此时还是旧的大小
git gc --prune=now  # 清理无效文件
git count-objects -vH  # 此时就和本地一样,从库减小了
# 貌似 gitlab 服务器有缓存,此时服务器的仓库中文件大小已经减小了,但是在浏览器上通过页面查看,还是原来的大小
# （p.s.我因为是用的公司集团的gitlab，无法直接操作到gitlab的服务器，所以此处的操作没有实际尝试过，但是应该是没有问题的）
```

### 结果图

![image.png](https://upload-images.jianshu.io/upload_images/12877063-2438e96d3efdeb6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 原文参考：[git 项目过大清理](https://www.cnblogs.com/ziyue7575/p/45538b0b7dbe1cbbca5e4ca1a90810ca.html)
> 好像是个更好的方法：[使用 bfg 快速清理 git 历史大文件](https://blog.csdn.net/qq_36254947/article/details/108641438)
