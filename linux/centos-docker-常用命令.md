docker --version

systemctl start docker

systemctl status docker 查看运行状态

docker run -itd --name mysql -p 3306:3306 -e=MYSQL_ROOT_PASSWORD=123456 mysql

docker run 命令来创建

itd交互式终端后台运行

name指定容器名称

p指定映射端口

最后Mysql比较特殊，需要指定MYSQL_ROOT_PASSWORD变量

+ mysql镜像名称



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
