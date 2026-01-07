# 项目维护手册
<!-- markdownlint-disable MD013 -->

本手册用于说明仓库的目录约定、脚本用途与执行流程、Markdown 写作规范，以及常见问题与解决建议，帮助长期维护时快速上手与减少重复劳动。

## 目录结构与约定

- 内容文档集中在 [doc/](doc/) 下，按主题分子目录组织。
- 根目录的 [README.md](README.md) 会包含自动生成的目录树（带标记块），便于快速浏览。
- 所有新增 Markdown 文档建议放在对应主题目录，并遵循下文写作规范。

## 脚本说明

### gen:tree

- 入口：

  ```bash
  npm run gen:tree
  ```

- 作用：
  - 遍历项目并“规范化”文件/目录命名（移除不安全字符，统一中英文、数字、下划线、短横线等常用字符）。
  - 在 README.md 中插入/更新目录树，范围由标记 `<!-- AUTO-GENERATED-TREE:START -->` 和 `<!-- AUTO-GENERATED-TREE:END -->` 控制。
  - 输出统计信息（目录/文件数量、Markdown 数量、重命名计数）。
- 注意：该脚本可能重命名文件与目录，可能影响外部链接或历史引用；执行后请检查 Git 变更并在提交前确认无误。

### fix:md

- 入口：

  ```bash
  npm run fix:md
  ```

- 作用：
  - 遍历 [doc/](doc/) 下所有 `.md` 文件，自动为缺少语言标注的围栏代码块（``` 或 ~~~）添加语言（基于 highlight.js 自动识别）。
  - 谨慎将部分“缩进代码块”转换为围栏代码块，以提升 GitHub 预览的语法高亮效果。
  - 对标题语法做轻量修正，例如 `#` 后自动补空格；统一换行为 LF。
- 语言识别：优先识别 `javascript`、`typescript`、`json`、`bash`、`nginx`、`html`、`css` 等常见语言；无法识别时会回退为 `plaintext`。

### lint:md

- 入口：

  ```bash
  npm run lint:md
  ```

- 作用：运行 `markdownlint --fix "doc/**/*.md"`，自动修复常见 Markdown 语法问题并给出剩余告警。
- 常见规则与提醒（示例）：
  - MD013 行宽限制：中文内容较多时可保留较长行，或通过配置放宽；
  - MD041 首行需要顶级标题：建议每篇文档以 H1 开头；
  - MD001 标题层级递增：标题层级应逐级递增（h1→h2→h3…）；
  - MD029 有序列表前缀：保持 1/1/1 风格；
  - MD033 禁止内联 HTML：尽量使用 Markdown 语法替代；
  - MD040/MD046 代码块语言/样式：使用围栏代码块并标注语言。

## 推荐维护流程

1. 编写/整理文档时遵守写作规范（见下节）。
1. 执行脚本：

```bash
npm run fix:md
npm run lint:md
npm run gen:tree
```

1. 检查 Git 变更（特别是文件/目录重命名与目录树更新）。
1. 提交并推送，记录简洁明了的提交信息。

## Markdown 写作规范（关键）

- 顶级标题：文档首行使用 `# 标题`（H1）。
- 标题层级：严格逐级递增（H1→H2→H3），避免跳级。
- 代码块：
  - 使用围栏代码块（```lang 或 ~~~lang），务必标注语言（如 `javascript`、`bash`、`json` 等）。
  - 示例：

    ```javascript
    function sum(a, b) {
      return a + b;
    }
    ```

- 图片与链接：图片需提供 alt 文本；避免使用内联 HTML，优先 Markdown 语法。
- 列表：有序列表保持统一前缀（建议 1/1/1 风格）。
- 行宽：中文内容可适度放宽行宽限制；如影响阅读或产生大量告警，可考虑在 lint 配置中调整（见下节）。

## 可选：Lint 配置建议

如需减少不必要的告警，可在根目录添加 `.markdownlint.json`，示例（按需调整）：

```json
{
  "MD013": { "line_length": 120, "code_blocks": false, "tables": false },
  "MD041": false,
  "MD033": { "allowed_elements": ["br"] }
}
```

说明：

- 放宽 MD013 行宽到 120，并忽略代码块/表格；
- 关闭 MD041（首行 H1）或根据需要保留；
- 允许少量内联 HTML（如 `<br>`）时可在 `allowed_elements` 中声明。

## 常见问题与处理

- 代码块语言识别不准确：手动改为期望语言，例如 `javascript`、`bash`、`json` 等；
- 缩进代码块未转换或误判：尽量改为围栏代码块；脚本已尽量避免列表/引用等结构误判；
- 目录树重命名影响链接：执行 `gen:tree` 后务必检查重命名变更，必要时同步更新文档中的链接。

## 维护历史

- 2026-01-06：新增维护脚本与初次批量修复；补充本手册。

## 快速命令合集

```bash
# 批量修复代码块语言与语法细节
npm run fix:md

# 检测与自动修复常见 Markdown 语法
npm run lint:md

# 规范化命名并更新 README 目录树
npm run gen:tree
```
