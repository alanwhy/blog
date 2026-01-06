# remote: Support for password authentication was removed on August 13, 2021.

## 问题描述

这是什么情况，大概意思就是你原先的密码凭证从 2021 年 8 月 13 日开始就不能用了，必须使用个人访问令牌（personal access token），就是把你的密码替换成 token！

## token 的好处

近年来，GitHub 客户受益于 GitHub.com 的许多安全增强功能，例如双因素身份验证、登录警报、经过验证的设备、防止使用泄露密码和 WebAuthn 支持。 这些功能使攻击者更难获取在多个网站上重复使用的密码并使用它来尝试访问您的 GitHub 帐户。 尽管有这些改进，但由于历史原因，未启用双因素身份验证的客户仍能够仅使用其 GitHub 用户名和密码继续对 Git 和 API 操作进行身份验证。

从 2021 年 8 月 13 日开始，我们将在对 Git 操作进行身份验证时不再接受帐户密码，并将要求使用基于令牌（token）的身份验证，例如个人访问令牌（针对开发人员）或 OAuth 或 GitHub 应用程序安装令牌（针对集成商） GitHub.com 上所有经过身份验证的 Git 操作。 您也可以继续在您喜欢的地方使用 SSH 密钥（如果你要使用 ssh 密钥可以参考）。

令牌（token）与基于密码的身份验证相比，令牌提供了许多安全优势：

- 唯一： 令牌特定于 GitHub，可以按使用或按设备生成
- 可撤销：可以随时单独撤销令牌，而无需更新未受影响的凭据
- 有限 ： 令牌可以缩小范围以仅允许用例所需的访问
- 随机：令牌不需要记住或定期输入的更简单密码可能会受到的字典类型或蛮力尝试的影响

## 如何解决？

1. 在个人设置页面，找到 `Setting`
2. 选择开发者设置 `Developer setting`
3. 选择个人访问令牌 `Personal access tokens`，然后选中生成令牌 `Generate new token`
4. 设置 token 的有效期，访问权限等
   - 选择要授予此令牌 token 的范围或权限。
   - 要使用 token 从命令行访问仓库，请选择 `repo`。
   - 要使用 token 从命令行删除仓库，请选择 `delete_repo`
   - 其他根据需要进行勾选
5. 生成令牌 `Generate token`

> 注意：记得把你的 token 保存下来，因为你再次刷新网页的时候，你已经没有办法看到它了，所以我还没有彻底搞清楚这个 token 的使用，后续还会继续探索！

6. 之后用自己生成的 token 登录，把上面生成的 token 粘贴到输入密码的位置，然后成功 push 代码！

也可以 把 token 直接添加远程仓库链接中，这样就可以避免同一个仓库每次提交代码都要输入 token 了：

```shell
$ git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git
```

- `<your_token>`：换成你自己得到的 token
- `<USERNAME>`：是你自己 github 的用户名
- `<REPO>`：是你的仓库名称

> 原文链接：[github 开发人员在七夕搞事情：remote: Support for password authentication was removed on August 13, 2021.](https://blog.csdn.net/weixin_41010198/article/details/119698015)
