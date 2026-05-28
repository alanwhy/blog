# 记一次 Three.js 与 @google/model-viewer 的依赖冲突排查与解决

> **背景**：项目中同时使用了 `three` 和 `@google/model-viewer`，上线后发现通过 `<model-viewer>` 加载的 3D 模型始终无法渲染，排查后发现是两个包内置了不同版本的 Three.js，Vite 的预打包机制导致两份实例并存，渲染管线崩溃。

---

## 一、问题现象

- 使用 `<model-viewer>` 标签的页面，模型加载后画布一片空白
- 控制台无明显报错，或仅有 WebGL 上下文相关的隐性异常
- 使用 `THREE.WebGLRenderer` 直接渲染的组件（`PreviewGltf`、`PreviewObj` 等）完全正常

---

## 二、根本原因分析

### 2.1 @google/model-viewer 自带 Three.js

`@google/model-viewer` v4 将 Three.js r168 **打包（bundle）进了自身的 dist 文件**，不依赖宿主项目提供的 Three.js：

```
node_modules/@google/model-viewer/dist/
├── model-viewer.min.js      # 933KB，内含完整的 Three.js r168
└── ...
```

而项目中同时单独安装了 `three ^0.183.2`（r183）。

### 2.2 Vite 的 optimizeDeps 将两者合并到同一模块图

`vite.config.js` 中配置了：

```js
optimizeDeps: {
  include: ['@google/model-viewer', ...]
},
rollupOptions: {
  manualChunks: {
    vendor3: ['@google/model-viewer']
  }
}
```

Vite 的 `optimizeDeps` 预打包机制会将 `@google/model-viewer` 作为 ES 模块纳入打包流程。此时，Rollup 在解析模块依赖时，会将其内部引用的 Three.js 与项目中独立安装的 `three` 识别为**同一模块**，导致两份不同版本的 Three.js 实例在运行时互相污染。

model-viewer 内部用 r168 的 API 初始化渲染器，却拿到了 r183 的类实例，接口不兼容，渲染管线静默失败。

### 2.3 问题关系图

```
项目模块图 (Vite/Rollup)
│
├── three@0.183.2  ◄──────────────────┐ 两份 Three.js 实例
│                                     │ 被合并进同一模块图
└── @google/model-viewer@4.x          │
    └── 内置 three@r168  ─────────────┘
         ↑
         model-viewer 用这里的 API 初始化，
         运行时却拿到了上面那份 r183 实例 → 崩溃
```

---

## 三、解决方案

**核心思路**：将 `@google/model-viewer` 完全移出 Vite/Rollup 的模块图，让浏览器通过原生 `<script type="module">` 在独立的模块作用域中加载它，彻底切断两者的模块图联系。

### 3.1 将 model-viewer.min.js 作为静态资源

```bash
cp node_modules/@google/model-viewer/dist/model-viewer.min.js public/static/model-viewer.min.js
```

### 3.2 在 vite.config.js 中添加内联插件自动化此过程

```js
import fs from 'fs';

// 在 plugins 数组末尾追加：
{
  name: 'vite-plugin-copy-model-viewer',
  // buildStart：每次构建启动时自动同步最新版本
  buildStart() {
    const src = path.resolve('node_modules/@google/model-viewer/dist/model-viewer.min.js');
    const destDir = path.resolve('public/static');
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, path.join(destDir, 'model-viewer.min.js'));
  },
  // order: 'post' 确保在 Rollup 分析入口文件之后才注入 <script> 标签，
  // 使 Rollup 看不到这个 script，不会将其纳入打包
  transformIndexHtml: {
    order: 'post',
    handler() {
      const base = mode === 'development' ? '/' : `/${projectName}/`;
      return [
        {
          tag: 'script',
          attrs: { type: 'module', src: `${base}static/model-viewer.min.js` },
          injectTo: 'head'
        }
      ];
    }
  }
}
```

> **为什么用 `order: 'post'` 而不是直接写在 `index.html` 里？**
>
> 若直接在 `index.html` 写 `<script type="module" src="...model-viewer.min.js">`，Vite 会把它当成入口文件交给 Rollup 解析，触发 `failed to resolve import` 错误。`order: 'post'` 让注入发生在 Rollup 分析完成之后，绕过了这一检测。

### 3.3 删除源码中的 import 语句

```js
// src/views/material/ModelList.js
- import '@google/model-viewer';

// src/views/material/MaterialMain.js
- import '@google/model-viewer';
```

### 3.4 从 optimizeDeps 和 manualChunks 中移除

```js
// vite.config.js
optimizeDeps: {
  include: [
-   '@google/model-viewer',
    '@turf/turf',
    ...
  ]
},
manualChunks: {
  vendor1: ['element-ui'],
  vendor2: [...],
- vendor3: ['@google/model-viewer']   // 删除
}
```

---

## 四、修改前后对比

| | 修改前 | 修改后 |
|---|---|---|
| 加载方式 | `import '@google/model-viewer'`（纳入模块图） | `<script type="module">` 独立作用域 |
| Three.js 实例 | 两份（r168 + r183），互相污染 | 完全隔离，各用各的 |
| 构建产物 | model-viewer 被打进业务 chunk | 单独的静态文件 `static/model-viewer.min.js` |
| 模型渲染 | 空白，静默失败 | 正常 |

---

## 五、经验总结：如何在后续开发中预防此类问题

### 5.1 引入新依赖前做尽职调查

```bash
# 检查是否有 bundledDependencies（内置了其他库）
npm info <package-name> bundledDependencies

# 检查是否有重复的底层依赖
pnpm why three
find node_modules -name "three" -maxdepth 4 -type d
```

### 5.2 识别"自带运行时"的包

满足以下任一条件，优先考虑 `<script>` 外部加载而非 `import`：

- dist 目录提供独立的完整包（`xxx.min.js`，体积 > 500KB）
- `package.json` 中有 `bundledDependencies` 字段
- 典型案例：`@google/model-viewer`、`CesiumJS`、`ArcGIS JS API`、`BabylonJS`

### 5.3 在 CI 中加入重复依赖检测

```bash
# 检测 three 是否存在多个路径（有输出则告警）
pnpm why three | grep -c "node_modules"
```

### 5.4 有冲突时的决策树

```
发现底层库版本冲突
│
├─ 两个包使用同一主版本？
│   └─ 是 → 尝试 pnpm.overrides 强制统一版本
│
└─ 版本差异较大 / API 不兼容？
    └─ 是 → 物理隔离：将冲突包改为 <script> 标签加载
```

### 5.5 架构层面：按渲染引擎归属划分组件边界

> 一个页面/模块只允许使用一种渲染引擎实例。

- Three.js 渲染的组件（`PreviewGltf`、`PreviewObj`、`PreviewLas`）归一类
- `<model-viewer>` 组件通过 Web Component Shadow DOM 天然隔离，归另一类
- 两类不在同一组件内混用，冲突即使发生影响范围也可控

---

## 参考

- [@google/model-viewer 官方文档](https://modelviewer.dev/)
- [Vite Plugin API — transformIndexHtml](https://vite.dev/guide/api-plugin#transformindexhtml)
- [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides)
