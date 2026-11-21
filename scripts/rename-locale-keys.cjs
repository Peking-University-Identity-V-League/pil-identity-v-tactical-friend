// 语言包键名重命名工具（可复用）：
// 用法：node keyrename.tmp.cjs <新键名文件>   例如 node keyrename.tmp.cjs locales/zh-CN_new_key_name2.json
// 约定：新文件与 locales/zh-CN.json 每行一一对应；以新文件键名为准重命名，同步代码引用，最后按字母排序。
const fs = require('fs'), path = require('path');

const newFile = process.argv[2];
if (!newFile) { console.error('usage: node keyrename.tmp.cjs <new-key-file>'); process.exit(1); }
const zhPath = 'locales/zh-CN.json';

// 1) 逐行生成旧键 -> 新键映射，校验值一致与结构一致
const a = fs.readFileSync(zhPath, 'utf8').split(/\r?\n/);
const b = fs.readFileSync(newFile, 'utf8').split(/\r?\n/);
if (a.length !== b.length) { console.error('LINE COUNT MISMATCH', a.length, b.length); process.exit(1); }
const keyRe = /^(\s*)"([^"]+)"(\s*:\s*)(.*)$/;
const map = {};
let valueDiff = 0, structural = 0;
for (let i = 0; i < a.length; i++) {
  const ma = a[i].match(keyRe), mb = b[i].match(keyRe);
  if (!ma || !mb) {
    if ((ma ? ma[0] : a[i]).trim() !== (mb ? mb[0] : b[i]).trim()) { structural++; console.error('STRUCT line', i + 1); }
    continue;
  }
  if (ma[4] !== mb[4]) { valueDiff++; console.error('VALUE DIFF line', i + 1, ma[2]); }
  if (ma[2] !== mb[2]) map[ma[2]] = mb[2];
}
console.log('renamed keys:', Object.keys(map).length, 'valueDiff:', valueDiff, 'structural:', structural);
if (valueDiff || structural) { console.error('ABORT: 值或结构不一致，请先人工核对'); process.exit(1); }

// 2) 代码替换：边界为 " ' ` 或 &（HTML 实体），模板拼接前缀单独处理
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { if (!['node_modules', '.git', 'test-results', 'locales'].includes(f.name)) walk(p); }
    else if (/\.(js|html|css|mjs)$/.test(f.name) && !f.name.endsWith('.tmp.cjs')) files.push(p);
  }
};
walk('.');
// 从映射自动推导模板前缀：同一家族 key0..keyN 都以数字结尾且代码里无前缀完整引用时，
// 直接对 "旧前缀${" -> "新前缀${" 做替换
const tplPairs = [];
{
  const fam = {};
  for (const [o, n] of Object.entries(map)) {
    const mo = o.match(/^(.*?)\d+$/), mn = n.match(/^(.*?)\d+$/);
    if (mo && mn) (fam[mo[1]] = fam[mo[1]] || new Set()).add(mn[1]);
  }
  for (const [op, nps] of Object.entries(fam)) {
    if (nps.size === 1) tplPairs.push([op + '${', [...nps][0] + '${']);
  }
}
let totalRepl = 0;
for (const f of files) {
  let txt = fs.readFileSync(f, 'utf8');
  let changed = 0;
  for (const [x, y] of tplPairs) {
    const n = txt.split(x).length - 1;
    if (n) { txt = txt.split(x).join(y); changed += n; }
  }
  for (const [oldK, newK] of Object.entries(map)) {
    const re = new RegExp(esc(oldK) + '(?=["\'`&])', 'g');
    const n = (txt.match(re) || []).length;
    if (n) { txt = txt.replace(re, newK); changed += n; }
  }
  if (changed) { fs.writeFileSync(f, txt); console.log(f, changed); totalRepl += changed; }
}
console.log('total replacements:', totalRepl);

// 3) 校验：代码中无旧键残留；代码引用的键都存在于新语言包
let leftovers = 0, missing = 0;
const newZh = {};
{
  const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
  for (const [k, v] of Object.entries(zh)) newZh[map[k] || k] = v;
}
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const oldK of Object.keys(map)) {
    const re = new RegExp(esc(oldK) + '(?=["\'`&])', 'g');
    const n = (txt.match(re) || []).length;
    if (n) { console.log('LEFTOVER', f, oldK, n); leftovers += n; }
  }
  const refs = new Set();
  for (const m of txt.matchAll(/translate\(\s*"([^"]+)"/g)) refs.add(m[1]);
  for (const m of txt.matchAll(/translate\('([^']+)'/g)) refs.add(m[1]);
  for (const m of txt.matchAll(/data-i18n="([^"]+)"/g)) refs.add(m[1]);
  for (const m of txt.matchAll(/&quot;(?:title|aria-label|placeholder)&quot;:&quot;([^&]+)&quot;/g)) refs.add(m[1]);
  for (const r of refs) if (!(r in newZh)) { console.log('NO-LOCALE', f, r); missing++; }
}
console.log('leftover old keys:', leftovers, '| refs missing from locale:', missing);
if (leftovers || missing) { console.error('ABORT: 校验未通过'); process.exit(1); }

// 4) 写回语言包并按字母排序
const sorted = Object.fromEntries(Object.entries(newZh).sort(([x], [y]) => x.localeCompare(y, 'en')));
fs.writeFileSync(zhPath, JSON.stringify(sorted, null, 2) + '\n');
console.log('locale keys:', Object.keys(sorted).length, 'sorted & written');
