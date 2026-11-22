// 语言包键名重命名工具（可复用）：
// 用法：node scripts/rename-locale-keys.cjs <新键名文件>   例如 node scripts/rename-locale-keys.cjs locales/zh-CN_new_key_name2.json
// 约定：新文件与 locales/zh-CN.json 每行一一对应；以新文件键名为准重命名，同步代码引用，最后按字母排序。
// 能力：注释行（// "key": ...）表示删除该键；新文件中多出的键行视为新增；删除键要求代码零引用；
//       重命名后键名重复时值相同自动合并、值不同则中止待人工裁决。
const fs = require('fs'), path = require('path');

const newFile = process.argv[2];
if (!newFile) { console.error('usage: node scripts/rename-locale-keys.cjs <new-key-file>'); process.exit(1); }
const zhPath = 'locales/zh-CN.json';

// 1) 逐行生成旧键 -> 新键映射；注释行 = 删除；值不一致且键名不在旧包中 = 新增
const a = fs.readFileSync(zhPath, 'utf8').split(/\r?\n/);
const b = fs.readFileSync(newFile, 'utf8').split(/\r?\n/);
const keyRe = /^(\s*)"([^"]+)"(\s*:\s*)(.*)$/;
const commentRe = /^(\s*)\/\/\s*"([^"]+)"(\s*:\s*)(.*)$/;
const normVal = (s) => s.replace(/,\s*$/, ''); // 比较值时忽略行尾逗号
const zhKeys = new Set();
for (const l of a) { const m = l.match(keyRe); if (m) zhKeys.add(m[2]); }
const map = {};
const deletedKeys = [];
const additions = []; // [key, value]
let valueDiff = 0, structural = 0;
for (let i = 0, j = 0; i < a.length || j < b.length;) {
  const la = i < a.length ? a[i] : null, lb = j < b.length ? b[j] : null;
  const ma = la && la.match(keyRe);
  const mc = lb && lb.match(commentRe);
  const isComment = lb != null && /^\s*\/\//.test(lb);
  const mb = !isComment && lb && lb.match(keyRe);
  if (isComment) { // 注释行：删除本行旧键；注释中带完整键名时校验一致
    if (!ma) { structural++; console.error('COMMENT-ON-NONKEY line b', j + 1, lb); j++; continue; }
    if (mc && ma[2] !== mc[2]) { structural++; console.error('COMMENT-MISMATCH line a', i + 1, ma[2], '| b', j + 1, mc[2]); i++; j++; continue; }
    if (!mc) console.log('WARN: 无法解析的注释行（按位置删除） line b', j + 1, lb.trim());
    deletedKeys.push(ma[2]); i++; j++; continue;
  }
  if (ma && mb && normVal(ma[4]) === normVal(mb[4])) {           // 值一致：正常配对（键不同即重命名）
    if (ma[2] !== mb[2]) map[ma[2]] = mb[2];
    i++; j++; continue;
  }
  if (mb && (!ma || !zhKeys.has(mb[2]))) {     // 新文件中多出的键行 → 新增
    try { additions.push([mb[2], JSON.parse(mb[4].replace(/,\s*$/, ''))]); }
    catch { valueDiff++; console.error('ADD-PARSE-FAIL line b', j + 1, lb); }
    j++; continue;
  }
  if (ma && mb && i + 1 < a.length) {
    // 值不一致时试探：跳过旧文件本行后 a[i+1] 与 b[j] 值一致 → 本行是被删除的键
    const maNext = a[i + 1].match(keyRe);
    if (maNext && normVal(maNext[4]) === normVal(mb[4])) { deletedKeys.push(ma[2]); i++; continue; }
  }
  if (!ma && !mb) {
    if ((la || '').trim() !== (lb || '').trim()) { structural++; console.error('STRUCT line a', i + 1, 'b', j + 1); }
    i++; j++; continue;
  }
  valueDiff++; console.error('VALUE DIFF line a', i + 1, ma ? ma[2] : la, '| b', j + 1, mb ? mb[2] : lb);
  i++; j++;
}
console.log('renamed keys:', Object.keys(map).length, '| deleted keys:', deletedKeys.length, '| added keys:', additions.length, '| valueDiff:', valueDiff, '| structural:', structural);
if (deletedKeys.length) console.log('deleted:', deletedKeys.join(', '));
if (additions.length) console.log('added:', additions.map(([k]) => k).join(', '));
if (valueDiff || structural) { console.error('ABORT: 值或结构不一致，请先人工核对'); process.exit(1); }

// 2) 收集代码文件
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { if (!['node_modules', '.git', 'test-results', 'locales', 'deploy'].includes(f.name)) walk(p); }
    else if (/\.(js|html|css|mjs)$/.test(f.name) && !f.name.endsWith('.tmp.cjs')) files.push(p);
  }
};
walk('.');

// 3) 删除键必须零引用（完整键 + 模板前缀家族）
{
  let bad = 0;
  for (const k of deletedKeys) {
    const re = new RegExp(esc(k) + '(?=["\'`&])');
    const pre = k.match(/^(.*?)\d+$/)?.[1];
    for (const f of files) {
      const txt = fs.readFileSync(f, 'utf8');
      if (re.test(txt)) { console.error('DELETED-KEY-REFERENCED', f, k); bad++; }
      if (pre && txt.includes(pre + '${')) { console.error('DELETED-KEY-TPL-FAMILY', f, pre); bad++; }
    }
  }
  if (bad) { console.error('ABORT: 被删键仍存在代码引用'); process.exit(1); }
}

// 4) 重命名后键名重复检测：值相同合并，值不同中止；新增键不得与最终键名冲突
const zh0 = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
{
  const byNew = {};
  for (const [k, v] of Object.entries(zh0)) {
    if (deletedKeys.includes(k)) continue;
    const nk = map[k] || k;
    (byNew[nk] = byNew[nk] || []).push([k, v]);
  }
  const merges = [], conflicts = [];
  for (const [nk, list] of Object.entries(byNew)) {
    if (list.length < 2) continue;
    const vals = new Set(list.map(([, v]) => v));
    (vals.size === 1 ? merges : conflicts).push([nk, list]);
  }
  for (const [k, v] of additions) {
    if (byNew[k] && byNew[k][0][1] !== v) conflicts.push([k, [[byNew[k][0][0], byNew[k][0][1]], ['(新增)', v]]]);
  }
  if (merges.length) console.log('merge duplicates (same value):', merges.map(([nk]) => nk).join(', '));
  if (conflicts.length) {
    for (const [nk, list] of conflicts) { console.error('CONFLICT', nk); list.forEach(([k, v]) => console.error('   ', k, '=', JSON.stringify(v))); }
    console.error('ABORT: 重命名后键名冲突且值不同，请先人工裁决'); process.exit(1);
  }
}

// 5) 代码替换：边界为 " ' ` 或 &（HTML 实体），模板拼接前缀单独处理
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

// 6) 校验：代码中无旧键残留；代码引用的键都存在于新语言包
let leftovers = 0, missing = 0;
const newZh = {};
for (const [k, v] of Object.entries(zh0)) {
  if (deletedKeys.includes(k)) continue;
  newZh[map[k] || k] = v; // 重复键值相同，后者覆盖前者无影响
}
for (const [k, v] of additions) newZh[k] = v;
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

// 7) 写回语言包并按字母排序
const sorted = Object.fromEntries(Object.entries(newZh).sort(([x], [y]) => x.localeCompare(y, 'en')));
fs.writeFileSync(zhPath, JSON.stringify(sorted, null, 2) + '\n');
console.log('locale keys:', Object.keys(sorted).length, 'sorted & written');
