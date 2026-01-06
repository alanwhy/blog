#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const README = path.join(ROOT, 'README.md');
const START = '<!-- AUTO-GENERATED-TREE:START -->';
const END = '<!-- AUTO-GENERATED-TREE:END -->';

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  '.husky',
  '.vscode',
]);

const IGNORE_FILES = new Set([
  '.DS_Store',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]);

function isHidden(name) {
  return name.startsWith('.');
}
function sanitizeName(name) {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  // 保留中英文、数字、下划线、短横线、点；其余替换为 '-'
  let sanitized = base.replace(/[^\w\u4e00-\u9fa5.-]+/g, '-');
  sanitized = sanitized.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (!sanitized) sanitized = 'file';
  let newName = sanitized + ext;
  // 进一步处理常见中文/全角括号等
  newName = newName.replace(/[()（）\[\]【】]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  if (!newName) newName = 'file' + (ext || '');
  return newName;
}

function ensureUniqueName(dir, targetName) {
  let candidate = targetName;
  let idx = 1;
  while (fs.existsSync(path.join(dir, candidate))) {
    const ext = path.extname(targetName);
    const bn = path.basename(targetName, ext);
    candidate = `${bn}-${idx}${ext}`;
    idx += 1;
  }
  return candidate;
}

function encodePath(rel) {
  if (!rel) return '';
  const unix = rel.split(path.sep).join('/');
  return unix.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

let stats = { dirs: 0, files: 0, mds: 0, renamed: 0 };

function sanitizeTraversal(dir) {
  const entries = readDirSafe(dir);
  for (const ent of entries) {
    const name = ent.name;
    const abs = path.join(dir, name);
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(name) || isHidden(name)) continue;
      let newName = sanitizeName(name);
      if (newName !== name) {
        newName = ensureUniqueName(dir, newName);
        const dest = path.join(dir, newName);
        fs.renameSync(abs, dest);
        stats.renamed += 1;
        console.log(`重命名 目录: ${path.relative(ROOT, abs)} -> ${path.relative(ROOT, dest)}`);
      }
      stats.dirs += 1;
      sanitizeTraversal(path.join(dir, newName !== name ? newName : name));
    } else if (ent.isFile()) {
      if (IGNORE_FILES.has(name) || isHidden(name)) continue;
      let newName = sanitizeName(name);
      let finalAbs = abs;
      if (newName !== name) {
        newName = ensureUniqueName(dir, newName);
        finalAbs = path.join(dir, newName);
        fs.renameSync(abs, finalAbs);
        stats.renamed += 1;
        console.log(`重命名 文件: ${path.relative(ROOT, abs)} -> ${path.relative(ROOT, finalAbs)}`);
      }
      stats.files += 1;
      if (/\.md$/i.test(newName)) stats.mds += 1;
    }
  }
}


function readDirSafe(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return [];
  }
}

function buildList(dir, rel = '') {
  const abs = path.join(dir, rel);
  const entries = readDirSafe(abs);
  const filesMd = [];
  const dirs = [];

  for (const ent of entries) {
    const name = ent.name;
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(name) || isHidden(name)) continue;
      dirs.push(name);
    } else if (ent.isFile()) {
      if (IGNORE_FILES.has(name) || isHidden(name)) continue;
      if (/\.md$/i.test(name)) filesMd.push(name);
    }
  }

  dirs.sort((a, b) => a.localeCompare(b));
  filesMd.sort((a, b) => a.localeCompare(b));

  const lines = [];

  for (const d of dirs) {
    const display = d + '/';
    const linkPath = encodePath(path.posix.join(rel.split(path.sep).join('/'), d)) + '/';
    const childLines = buildList(dir, path.join(rel, d));
    if (childLines.length > 0) {
      lines.push(`- [${display}](${linkPath})`);
      for (const l of childLines) {
        lines.push(`  ${l}`);
      }
    }
  }

  for (const f of filesMd) {
    const linkPath = encodePath(path.posix.join(rel.split(path.sep).join('/'), f));
    const display = f;
    lines.push(`- [${display}](${linkPath})`);
  }

  return lines;
}

function generateListMarkdown() {
  // 顶层不嵌套标题，由 README 现有结构承载
  // README.md 文件放在同级文件列表的首位（更易发现）
  const lines = buildList(ROOT, '');
  // 将顶层文件中的 README.md 置顶
  const topLevelFileLineIdx = lines.findIndex(
    l => l.startsWith('- [README.md](')
  );
  if (topLevelFileLineIdx > -1) {
    const [line] = lines.splice(topLevelFileLineIdx, 1);
    lines.unshift(line);
  }
  return lines.join('\n');
}

function upsertReadmeSection(content) {
  let readme = '';
  try {
    readme = fs.readFileSync(README, 'utf8');
  } catch {
    readme = '';
  }

  const block = `\n\n## 目录\n${START}\n${content}\n${END}\n`;

  if (readme.includes(START) && readme.includes(END)) {
    const startIdx = readme.indexOf(START);
    const endIdx = readme.indexOf(END) + END.length;
    const before = readme.slice(0, startIdx);
    const after = readme.slice(endIdx);
    return before + START + '\n' + content + '\n' + END + after;
  }

  if (readme.trim().length === 0) {
    return `# Blog\n${block}`;
  }

  return readme.trimEnd() + block;
}

function main() {
  // 先遍历并重命名含特殊字符的文件/目录
  stats = { dirs: 0, files: 0, mds: 0, renamed: 0 };
  sanitizeTraversal(ROOT);

  const listMd = generateListMarkdown();
  const next = upsertReadmeSection(listMd);
  fs.writeFileSync(README, next, 'utf8');
  console.log('README.md 目录树已更新');
  console.log(`统计: 目录 ${stats.dirs} 个，文件 ${stats.files} 个，其中 Markdown ${stats.mds} 个，重命名 ${stats.renamed} 个。`);
}

main();
