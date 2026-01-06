docker --version

systemctl start docker

systemctl status docker 查看运行状态

docker run -itd --name mysql -p 3306:3306 -e=MYSQL_ROOT_PASSWORD=123456 mysql

docker run 命令来创建

itd 交互式终端后台运行

name 指定容器名称

p 指定映射端口

最后 Mysql 比较特殊，需要指定 MYSQL_ROOT_PASSWORD 变量

- mysql 镜像名称

docker ps 查看运行的镜像

docker ps -a 查看所有镜像

修改镜像加速

vi /etc/docker/daemon.json

{

"registry-mirrors": ["https://registry.docker-cn.com"]

}

systemctl daemon-reload

systemctl restart docker

删除停止容器

docker rm names/id

删除运行中的容器

docker stop names/id

docker rm names/id
