#!/usr/bin/env node
/*
  Fix Markdown files under doc/:
  - Ensure fenced code blocks have language identifiers using highlight.js auto-detect
  - Convert certain indented code blocks to fenced blocks
  - Normalize common Markdown syntax issues (space after # in headings, normalize newlines)
*/

const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

const ROOT = process.cwd();
const DOC_DIR = path.join(ROOT, 'doc');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && full.endsWith('.md')) files.push(full);
  }
  return files;
}

// Map highlight.js language ids to common markdown language labels
const langMap = new Map([
  ['xml', 'html'],
  ['bash', 'bash'],
  ['shell', 'bash'],
  ['dockerfile', 'dockerfile'],
  ['json', 'json'],
  ['javascript', 'javascript'],
  ['typescript', 'typescript'],
  ['css', 'css'],
  ['scss', 'scss'],
  ['less', 'less'],
  ['nginx', 'nginx'],
  ['http', 'http'],
  ['markdown', 'markdown'],
  ['ini', 'ini'],
  ['yaml', 'yaml'],
  ['yml', 'yaml'],
  ['python', 'python'],
  ['java', 'java'],
  ['diff', 'diff'],
]);

function mapLanguage(id) {
  if (!id) return 'plaintext';
  const lower = id.toLowerCase();
  return langMap.get(lower) || lower;
}

function detectLanguage(code) {
  try {
    const res = hljs.highlightAuto(code);
    return mapLanguage(res.language);
  } catch {
    return 'plaintext';
  }
}

function fixHeadings(content) {
  return content.replace(/^(#{1,6})([^#\s])/gm, (_m, hashes, after) => `${hashes} ${after}`);
}

function processFencedBlocks(content) {
  // Replace fenced blocks without language: supports ``` and ~~~ with matching length
  const fenceRegex = /(^|\n)(`{3,}|~{3,})([^\n]*)\n([\s\S]*?)(\n\2[ \t]*)(?=\n|$)/g;
  return content.replace(fenceRegex, (m, prefix, fence, info, code, suffix) => {
    const infoTrim = String(info || '').trim();
    if (infoTrim.length > 0) return m; // already has language or info string
    const lang = detectLanguage(code);
    const open = fence + lang + '\n';
    const close = suffix.trimEnd(); // includes leading newline
    return (prefix || '') + open + code + close;
  });
}

function processIndentedBlocks(content) {
  const lines = content.split(/\n/);
  let i = 0;
  const out = [];
  while (i < lines.length) {
    const line = lines[i];
    const isBlank = line.trim().length === 0;
    if (!isBlank) {
      // Detect start of indented code block: previous is blank and this line has >=4 leading spaces or a tab
      const prevBlank = i === 0 || lines[i - 1].trim().length === 0;
      const leading = line.match(/^(\t| {4,})/);
      const isListItem = /^\s*([-*+] |\d+\.)/.test(line);
      if (prevBlank && leading && !isListItem) {
        // Collect consecutive indented lines
        const blockStart = i;
        const blockLines = [];
        while (i < lines.length) {
          const l = lines[i];
          if (l.trim().length === 0) break; // end on blank line
          const lead = l.match(/^(\t| {4,})/);
          const listItem = /^\s*([-*+] |\d+\.)/.test(l);
          if (!lead || listItem) break;
          // Remove one level of indentation (4 spaces or a tab)
          blockLines.push(l.replace(/^\t/, '').replace(/^ {4}/, ''));
          i++;
        }
        if (blockLines.length >= 3) {
          const code = blockLines.join('\n');
          const lang = detectLanguage(code);
          out.push('');
          out.push(`\`\`\`${lang}`.replace(/\\`/g, '`'));
          out.push(code);
          out.push('```');
          out.push('');
          continue; // skip default push of current line
        } else {
          // Not enough lines, treat as normal text and rewind processing
          i = blockStart;
        }
      }
    }
    out.push(line);
    i++;
  }
  return out.join('\n');
}

function normalizeNewlines(content) {
  return content.replace(/\r\n/g, '\n');
}

function processFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  let content = normalizeNewlines(original);
  content = fixHeadings(content);
  const afterFences = processFencedBlocks(content);
  const afterIndented = processIndentedBlocks(afterFences);

  if (afterIndented !== original) {
    fs.writeFileSync(file, afterIndented, 'utf8');
    return { file, changed: true };
  }
  return { file, changed: false };
}

function main() {
  if (!fs.existsSync(DOC_DIR)) {
    console.error(`Directory not found: ${DOC_DIR}`);
    process.exit(1);
  }
  const files = walk(DOC_DIR);
  let changedCount = 0;
  for (const f of files) {
    const res = processFile(f);
    if (res.changed) {
      changedCount++;
      console.log(`Updated: ${path.relative(ROOT, f)}`);
    }
  }
  console.log(`Processed ${files.length} files, updated ${changedCount}.`);
}

main();
