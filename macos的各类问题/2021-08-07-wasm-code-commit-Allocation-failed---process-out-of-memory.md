电脑型号：Apple Mbp M1

在运行某个开发程序的时候，安装依赖

```shell
$ npm install
```

报错：

```shell
wasm code commit Allocation failed - process out of memory
```

解决方式

```shell
$ nvm uninstall 14
$ arch -x86_64 zsh 
$ nvm install 14
$ nvm alias default 14
```

删除原来的`node_modules`，重新 `npm install`

问题解决！

> 参考解决链接：# [wasm code commit Allocation failed - process out of memory](https://stackoverflow.com/questions/65856300/wasm-code-commit-allocation-failed-process-out-of-memory)
