# git-commit 的一些工具库

> 建议阅读：[git commit 规范参考 ](https://www.jianshu.com/p/cac0fe9c34c4)

> 原文链接： [你可能已经忽略的 git commit 规范](https://segmentfault.com/a/1190000021634111)

### commitizen

1. 首先通过上下键控制指向你想要的 type 类型，分别对应有上面提到的 feat、fix、docs、perf 等:

![image.png](https://upload-images.jianshu.io/upload_images/12877063-bb54886e2b6b6139.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 然后会让你选择本次提交影响到的文件:
   ![image.png](https://upload-images.jianshu.io/upload_images/12877063-437a0737281e7ea7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 后面会让你分别写一个简短的和详细的提交描述:

![image.png](https://upload-images.jianshu.io/upload_images/12877063-344b97df205a6df4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 最后会让你去判断本次提交是否是 BREAKING CHANGE 或者有关联已开启的 issue:
   ![image.png](https://upload-images.jianshu.io/upload_images/12877063-9bc06b42cff827a8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 如何安装

```shell
# 安装commitizen
$ npm install --save-dev commitizen
# 接下来安装适配器
# for npm >= 5.2
$ npx commitizen init cz-conventional-changelog --save-dev --save-exact
# for npm < 5.2
$ ./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact

# 也可以用中文版来代替
$ npx commitizen init cz-conventional-changelog-zh --save-dev --save-exact

// package.json script字段中添加commit命令
"scripts": {
   "commit": "git-cz"
}
// use
$ npm run commit
```

### commitlint

![image.png](https://upload-images.jianshu.io/upload_images/12877063-67a488dacb1754fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

对于 Conventional Commits 规范，社区已经整理好了 `@commitlint/config-conventional` 包，我们只需要安装并启用它就可以了。

```shell
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

接着在 package.json 中配置 commitlint 脚本:

```js
"commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
```

> 当然如果你想单独对 commitlint 进行配置的话，需要建立校验文件 `commitlint.config.js`，不然会校验失败

为了可以在每次 commit 时执行 commitlint 来 检查我们输入的 message，我们还需要用到一个工具 —— `husky`。

husky 是一个增强的 git hook 工具。可以在 git hook 的各个阶段执行我们在 package.json 中配置好的 npm script。

```shell
npm install --save-dev husky
```

接着在 package.json 中配置 commitmsg 脚本:

```js
"husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
 },
```

### [gitmoji-cli](https://github.com/carloscuesta/gitmoji/)

![image.png](https://upload-images.jianshu.io/upload_images/12877063-fc5db8f4842d91e2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```shell
# 安装
npm i -g gitmoji-cli
# 使用
git commit -m ':bug: 问题fix'
```

![image.png](https://upload-images.jianshu.io/upload_images/12877063-ca7112fea660a548.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 最后附上一个之前项目针对 git commit 配置的 package.json，作为参考:

```json
{
  "name": "ts-axios",
  "version": "0.0.0",
  "description": "",
  "keywords": [],
  "main": "dist/ts-axios.umd.js",
  "module": "dist/ts-axios.es5.js",
  "typings": "dist/types/ts-axios.d.ts",
  "files": ["dist"],
  "author": "fengshuan <1263215592@qq.com>",
  "repository": {
    "type": "git",
    "url": ""
  },
  "license": "MIT",
  "engines": {
    "node": ">=6.0.0"
  },
  "scripts": {
    "dev": "node examples/server.js",
    "lint": "tslint  --project tsconfig.json -t codeFrame 'src/**/*.ts' 'test/**/*.ts'",
    "prebuild": "rimraf dist",
    "build": "tsc --module commonjs && rollup -c rollup.config.ts && typedoc --out docs --target es6 --theme minimal --mode file src",
    "start": "rollup -c rollup.config.ts -w",
    "test": "jest --coverage",
    "test:watch": "jest --coverage --watch",
    "test:prod": "npm run lint && npm run test -- --no-cache",
    "deploy-docs": "ts-node tools/gh-pages-publish",
    "report-coverage": "cat ./coverage/lcov.info | coveralls",
    "commit": "git-cz",
    "semantic-release": "semantic-release",
    "semantic-release-prepare": "ts-node tools/semantic-release-prepare",
    "precommit": "lint-staged",
    "travis-deploy-once": "travis-deploy-once"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "{src,test}/**/*.ts": ["prettier --write", "git add"]
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  },
  "jest": {
    "transform": {
      ".(ts|tsx)": "ts-jest"
    },
    "testEnvironment": "node",
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "moduleFileExtensions": ["ts", "tsx", "js"],
    "coveragePathIgnorePatterns": ["/node_modules/", "/test/"],
    "coverageThreshold": {
      "global": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    },
    "collectCoverageFrom": ["src/*.{js,ts}"]
  },
  "prettier": {
    "semi": false,
    "singleQuote": true
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  },
  "devDependencies": {
    "@commitlint/cli": "^7.1.2",
    "@commitlint/config-conventional": "^7.1.2",
    "@types/jest": "^23.3.2",
    "@types/node": "^10.11.0",
    "body-parser": "^1.19.0",
    "colors": "^1.3.2",
    "commitizen": "^3.0.0",
    "coveralls": "^3.0.2",
    "cross-env": "^5.2.0",
    "cz-conventional-changelog": "^2.1.0",
    "express": "^4.17.1",
    "husky": "^1.0.1",
    "jest": "^23.6.0",
    "jest-config": "^23.6.0",
    "lint-staged": "^8.0.0",
    "lodash.camelcase": "^4.3.0",
    "prettier": "^1.14.3",
    "prompt": "^1.0.0",
    "replace-in-file": "^3.4.2",
    "rimraf": "^2.6.2",
    "rollup": "^0.67.0",
    "rollup-plugin-commonjs": "^9.1.8",
    "rollup-plugin-json": "^3.1.0",
    "rollup-plugin-node-resolve": "^3.4.0",
    "rollup-plugin-sourcemaps": "^0.4.2",
    "rollup-plugin-typescript2": "^0.18.0",
    "semantic-release": "^15.9.16",
    "shelljs": "^0.8.3",
    "travis-deploy-once": "^5.0.9",
    "ts-jest": "^23.10.2",
    "ts-loader": "^6.1.1",
    "ts-node": "^7.0.1",
    "tslint": "^5.11.0",
    "tslint-config-prettier": "^1.15.0",
    "tslint-config-standard": "^8.0.1",
    "tslint-loader": "^3.5.4",
    "typedoc": "^0.12.0",
    "typescript": "^3.0.3",
    "webpack": "^4.40.2",
    "webpack-dev-middleware": "^3.7.1",
    "webpack-hot-middleware": "^2.25.0"
  }
}
```
