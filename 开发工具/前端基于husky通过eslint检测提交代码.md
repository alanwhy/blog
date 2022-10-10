<!--
 * @Author: wuhaoyuan
 * @Date: 2022-10-10 15:40:11
 * @LastEditTime: 2022-10-10 15:48:01
 * @LastEditors: wuhaoyuan
 * @Description:
 * @FilePath: /blog/开发工具/前端基于husky通过eslint检测提交代码.md
-->

# 前端基于 husky 通过 eslint 检测提交代码

### 配置代码风格

`eslint` 配置代码风格、质量的校验，`prettier` 用于代码格式的校验，`lint-staged` 过滤文件

首先明确一下，`Lint-staged` 仅仅是文件过滤器，不会帮你格式化任何东西，所以没有代码规则配置文件，需要自己配置一下，如：`.eslintrc`、`.stylelintrc` 等，然后在 `package.json` 中引入。

`eslint` 和 `prettier` 两者配合使用，即 使用 `prettier` 做格式化， `eslint` 做代码校验。

第一，`ESLint` 推出 `--fix` 参数前，ESLint 并没有自动格式化代码的功能，而 `Prettier` 可以自动格式化代码。

第二，虽然 `ESLint` 也可以校验代码格式，但 `Prettier` 更擅长。
所以还需要 `eslint-config-prettier`,`eslint-plugin-prettier` 加强两者的配合

`eslint-plugin-prettier`  是一个 `ESLint` 插件， 由 `Prettier` 生态提供，用于报告错误给 `ESLint`

`eslint-config-prettier` 的作用是使用 `Prettier` 默认推荐配置，并且关闭 `eslint` 自身的格式化功能，防止  `Prettier`  和  `ESLint`  的自动格式化冲突

安装所需的 NPM 包

```bash
npm i eslint prettier lint-staged eslint-plugin-prettier eslint-config-prettier
```

常用的配置 `.prettier.js`

```js
module.exports = {
  printWidth: 120, // 换行字符串阈值
  tabWidth: 2, // 设置工具每一个水平缩进的空格数
  useTabs: false,
  semi: false, // 句末是否加分号
  vueIndentScriptAndStyle: true,
  singleQuote: true, // 用单引号
  trailingComma: "none", // 最后一个对象元素加逗号
  bracketSpacing: true, // 对象，数组加空格
  jsxBracketSameLine: true, // jsx > 是否另起一行
  arrowParens: "always", // (x) => {} 是否要有小括号
  requirePragma: false, // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
};
```

`.eslintrc.js` 建议采用自己的项目配置

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["prettier", "plugin:prettier/recommended"],
  rules: { ...yourselfConfig },
};
```

### 自动配置 husky

```bash
yarn add husky --dev   # must install
npm install husky --save-dev

npx husky-init install # npm
npx husky-init # Yarn 1
yarn dlx husky-init # Yarn 2+
pnpm dlx husky-init # pnpm
```

它将设置 `husky`，修改`package.json`并创建一个`pre-commit`您可以编辑的示例挂钩。默认情况下，它将`npm test`在您提交时运行。

把示例 `npm test` 修改成 `yarn lint-staged` 或者 您自己定义的命令

在 `package.json` 中添加 `lint-staged` 命令

```json
"lint-staged": "lint-staged --allow-empty",
"lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx ",
"lint-staged": {
    "**/*.{js,jsx,ts,tsx}": "yarn run lint-staged:js",
    "**/*.{js,jsx,tsx,ts,less,md,json}": [
      "prettier --write"
    ]
  },
```

在 `git commit` 的时候，就会触发 `.husky/pre-commit` 文件下 的命令行 `yarn lint-staged` 或者 您自己定义的命令

在检查代码成功的时候会自动格式化代码然后帮您提交，如果检测到错误就会停止提交并告知错误行，及时改正后可以再次提交

当我 `git commit` 时，它会自动检测到不符合规范的代码，如果无法自主修复 则会抛出错误文件给您！

在此之前，配置好 `eslint` 和 `prettier` 是有必要的~

原文：[前端基于 husky 通过 eslint 检测提交代码](https://juejin.cn/post/7137158040565841951)
