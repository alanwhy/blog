## 报错如下

```shell
fatal: unable to access 'https://github.com/visgl/loaders.gl.git/': GnuTLS recv error (-110): The TLS connection was non-properly terminated.

// or

fatal: unable to access 'https://github.com/visgl/loaders.gl.git/': Failed to connect to github.com port 443: Connection refused

// or 

fatal: unable to access 'https://github.com/visgl/loaders.gl.git/': Could not resolve host: github.com
```

## 解决办法

1. 首先保证不能访问 google
2. 输入命令
```shell
git config --global --unset http.proxy
git config --global --unset https.proxy
```

3. 如果不行，则输入命令
```shell
git config --global url.git://github.com/.insteadOf https://github.com/
```

4. 再进行 clone

> 参考：[https://github.com/bower/bower/issues/2288](https://github.com/bower/bower/issues/2288)
