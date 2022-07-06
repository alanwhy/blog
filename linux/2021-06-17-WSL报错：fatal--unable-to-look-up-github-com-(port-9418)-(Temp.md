> 原文解决方式：[WSL2 DNS issues](https://github.com/microsoft/WSL/issues/5256)


### 环境

本人环境是wsl1，Ubuntu

### 报错情况

无法更新github上的代码，报错如下：
```
fatal: unable to look up github.com (port 9418) (Temporary failure in name resolution)
```

意思就是网络不行，会发现去ping google等都不行

### 解决方式

Incredibly unhelpful.

It is the issue for many people, it is the same in issue trackers/forums/etc across the internet.

The WSL instance cannot resolve domain names. Editing resolv.conf to point to a functioning nameserver "works" for the duration of the session, but as soon as the distro is rebooted resolv.conf is regenerated using WSL's original template. Because `etc/resolv.conf` is actually a symlink to `run/resolvconf/resolv.conf`

Steps that have worked for me:

1. Boot your distro.
2. 
```
cd ~/../../etc
```
3. Create `wsl.conf`, however you see fit. `sudo vim wsl.conf`, `sudo touch wsl.conf` and edit it later, whatever.
4. Add these lines to `wsl.conf`:
```
[network]
generateResolvConf=false
```
5. `exit` or in Windows cmd `wsl --terminate [YourDistroName]`
6. Boot your distro.
At this point, thanks to wsl.conf, run/resolvconf should no longer exist and will never be created again.
7. 
```
cd ~/../../etc
```
8. `sudo rm resolv.conf` - this deletes the existing symlink file.
9. Create a new `resolv.conf`, however you see fit. `sudo vim resolv.conf`, `sudo touch resolv.conf` and edit it later, whatever.
10. Add this line to `resolv.conf`:
```
nameserver 8.8.8.8
```
replace 8.8.8.8 with your preferred functional nameserver.
11. `exit` or in Windows cmd `wsl --terminate [YourDistroName]`
12. `wsl --shutdown` just to be sure that you've definitely killed everything.
13. Boot your distro.
14. Confirm that your resolv.conf changes are still in effect, or just ping a domain name and cry tears of joy after struggling to get this working for far too fucking long.
