<!--
 * @Author: wuhaoyuan
 * @Date: 2022-07-06 09:22:28
 * @LastEditTime: 2022-07-06 09:57:52
 * @LastEditors: wuhaoyuan
 * @Description: 
 * @FilePath: /blog/linux/centos查看防火墙相关命令.md
-->
1、查看 firewall 服务状态

systemctl status firewalld

2、查看 firewall 的状态

firewall-cmd --state

3、开启、重启、关闭、firewalld.service 服务

# 开启

service firewalld start

# 重启

service firewalld restart

# 关闭

service firewalld stop

4、查看防火墙规则

firewall-cmd --list-all

5、查询、开放、关闭端口

# 查询端口是否开放

firewall-cmd --query-port=8080/tcp

# 开放 80 端口

firewall-cmd --permanent --add-port=80/tcp

# 移除端口

firewall-cmd --permanent --remove-port=8080/tcp

#重启防火墙(修改配置后要重启防火墙)
firewall-cmd --reload

# 参数解释

1、firwall-cmd：是 Linux 提供的操作 firewall 的一个工具；
2、--permanent：表示设置为持久；
3、--add-port：标识添加的端口；

编辑 Iptables

vi /etc/sysconfig/iptables 配置文件
