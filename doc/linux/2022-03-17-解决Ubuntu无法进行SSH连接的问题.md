1. 首先查看 Ubuntu 虚拟机的 IP 地址：

```shell
ifconfig
```

2. 倘若 ubuntu 没有开启 22 号端口是不能连接上 SSH 或者 XShell 等软件，所以需要我们打开 SSH 服务，开启 22 端口，执行以下命令

```shell
sudo apt-get install openssh-server
sudo apt-get install ufw
sudo ufw enable
sudp ufw allow 22
```

3. 可以使用以下两种方法查看是否开启了 22 号端口：(发现端口此时的状态都为 LISTEN，即为开启状态）

```shell
netstat -ntlp|grep 22
```

4. windows 使用 SSH 或者 XShell 尝试连接，mac 推荐 Termius
