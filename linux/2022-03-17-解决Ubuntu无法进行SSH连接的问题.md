1. 首先查看Ubuntu虚拟机的IP地址：

```shell
$ ifconfig
```

2. 倘若ubuntu没有开启22号端口是不能连接上SSH或者XShell等软件，所以需要我们打开SSH服务，开启22端口，执行以下命令

```shell
$ sudo apt-get install openssh-server
$ sudo apt-get install ufw
$ sudo ufw enable
$ sudp ufw allow 22
```

3. 可以使用以下两种方法查看是否开启了22号端口：(发现端口此时的状态都为LISTEN，即为开启状态）

```shell
$ netstat -ntlp|grep 22
```

4. windows 使用SSH或者XShell尝试连接，mac推荐Termius
