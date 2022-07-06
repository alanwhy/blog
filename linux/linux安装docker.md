linux 安装 docker 入门，基于 centos7.7
#####1、先删除旧的版本(如果没有可以跳过)

```
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

######2、安装必须的依赖

```
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

添加 stable 的 Docker-ce 的源：

```
$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

#####3、安装 docker-ce:

```
$ sudo yum install docker-ce docker-ce-cli containerd.io
```

#####4、选择指定的安装版本(可选)

```
$ yum list docker-ce --showduplicates | sort -r

docker-ce.x86_64  3:18.09.1-3.el7                     docker-ce-stable
docker-ce.x86_64  3:18.09.0-3.el7                     docker-ce-stable
docker-ce.x86_64  18.06.1.ce-3.el7                    docker-ce-stable
docker-ce.x86_64  18.06.0.ce-3.el7                    docker-ce-stable
```

我们来举个例子，比如我们要安装 3:18.09.1-3.el7 这个版本，使用如下命令结构：

```
$ sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
```

命令说明：
第一部分是 docker-ce，第二部分是版本号 18.09.1，看明白了吗？就是这样子：

```
$ sudo yum install -y docker-ce-18.09.1 docker-ce-cli-18.09.1
```

#####5、启动服务并测试一下：

```
# 启动服务
sudo systemctl start docker

# 来一个Hello World吧
sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete
Digest: sha256:2557e3c07ed1e38f26e389462d03ed943586f744621577a99efb77324b0fe535
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

#####6、关于升级&删除：
升级：

```
# 更新所有
yum -y update

# 更新指定
yum -y update docker-ce docker-ce-cli containerd.io
```

删除：

```
sudo yum remove docker-ce

# 删除文件系统
sudo rm -rf /var/lib/docker
```

> 原文链接：[Docker 入门之安装教程](https://www.toimc.com/docker%E5%85%A5%E9%97%A8%E4%B9%8B%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B/#more)
