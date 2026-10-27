# -*- coding: utf-8 -*-
"""第二轮重构：
1) 角色范围 label 键全量归属角色（leaf=模式键），弃用共享 tactic.range.show*.label*；
2) TAC_SURVIVOR_SPEED / TAC_BASE_STATES / TAC_ROLE_BASES / TAC_FIXED_BASES / TAC_STATE_NAMES
   合并为 TAC_MOVEMENT_SURVIVOR；
3) 语言包键重命名到 movement.survivor.*。
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "js" / "data" / "tactic-data.js"
TACTIC_JS = ROOT / "js" / "tactic.js"
LOCALE = ROOT / "locales" / "zh-CN.json"

src = DATA_JS.read_text(encoding="utf-8")
locale = json.loads(LOCALE.read_text(encoding="utf-8"))

renames = {}  # old -> new（语言包）


def locale_move(old, new):
    assert old in locale, f"语言包缺少旧键 {old}"
    if new in locale and locale[new] != locale[old]:
        assert False, f"新键冲突 {new}"
    renames[old] = new


# ---------- 1) TAC_ROLES 中共享 label 归属角色 ----------
roles_start = src.index("export const TAC_ROLES = {")
roles_open = src.index("{", roles_start)


def find_close(text, open_idx):
    depth = 0
    for i in range(open_idx, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return i
    raise ValueError


roles_close = find_close(src, roles_open)
section = src[roles_open:roles_close + 1]

mode_label_re = re.compile(
    r"\{ key: '(\w+)', label: translate\(\"tactic\.range\.show\d*\.label\w*\"\)"
)


def repl_section(m):
    role_key = m.group(1)
    ns = role_key[0].lower() + role_key[1:]
    return (
        "{ key: '" + m.group(2) + "', label: translate(\"characters."
        + ns + ".range.label." + m.group(2) + "\")"
    )


out, pos = [], 0
entry_re = re.compile(r"^  ([A-Za-z0-9]+): \{", re.MULTILINE)
for m in entry_re.finditer(section):
    role_key = m.group(1)
    brace_open = section.index("{", m.start())
    brace_close = find_close(section, brace_open)
    block = section[brace_open:brace_close + 1]
    ns = role_key[0].lower() + role_key[1:]

    def repl_mode(mm, ns=ns):
        old_key = re.search(r'translate\("([^"]+)"\)', mm.group(0)).group(1)
        new_key = f"characters.{ns}.range.label.{mm.group(1)}"
        locale_move(old_key, new_key)
        return ("{ key: '" + mm.group(1) + "', label: translate(\"" + new_key + "\")")

    new_block = mode_label_re.sub(repl_mode, block)
    out.append(section[pos:brace_open])
    out.append(new_block)
    pos = brace_close + 1
out.append(section[pos:])
src = src[:roles_open] + "".join(out) + src[roles_close + 1:]

# ---------- 2) 合并五个常量 ----------
old_block_start = src.index("export const TAC_SURVIVOR_SPEED = 3.8;")
old_block_end = src.index("};", src.index("export const TAC_STATE_NAMES")) + 2

merged = '''export const TAC_MOVEMENT_SURVIVOR = {
  baseSpeed: 3.8,
  states: {
    run: { name: translate("movement.survivor.run"), speed: 3.8 },
    walk: { name: translate("movement.survivor.walk"), speed: 2.11 },
    crouch: { name: translate("movement.survivor.crouch"), speed: 1.14 },
    crawl: { name: translate("movement.survivor.crawl"), speed: 0.44 },
  },
  roles: {
    'survivor': { name: translate("characters.camps.survivor"), speed: 3.8, role: null },
    'wildling:0': { name: translate("movement.survivor.wildling0"), speed: 3.65, role: 'wildling', form: 0 },
    'prodigy:0': { name: translate("movement.survivor.prodigy0"), speed: 3.92, role: 'prodigy', form: 0 },
  },
  fixed: {
    'toyMerchant:0': { name: translate("movement.survivor.toyMerchant0"), speed: 5.74, role: 'toyMerchant', form: 0 },
    'prodigy:1': { name: translate("movement.survivor.prodigy1"), speed: 3.8, role: 'prodigy', form: 1 },
  },
  stateNames: { run: translate("tactic.run"), walk: translate("movement.survivor.walk"), crouch: translate("movement.survivor.crouch"), crawl: translate("movement.survivor.crawl"),
    role: translate("ui.common.roles"), fixed: translate("movement.survivor.fixed"), custom: translate("application.name"), hunter: translate("characters.camps.hunter") },
};'''

src = src[:old_block_start] + merged + src[old_block_end:]
DATA_JS.write_text(src, encoding="utf-8")

# ---------- 3) tactic.js 使用点更新 ----------
tac = TACTIC_JS.read_text(encoding="utf-8")
tac = re.sub(r"\bTAC_SURVIVOR_SPEED\b", "TAC_MOVEMENT_SURVIVOR.baseSpeed", tac)
tac = re.sub(r"\bTAC_BASE_STATES\b", "TAC_MOVEMENT_SURVIVOR.states", tac)
tac = re.sub(r"\bTAC_ROLE_BASES\b", "TAC_MOVEMENT_SURVIVOR.roles", tac)
tac = re.sub(r"\bTAC_FIXED_BASES\b", "TAC_MOVEMENT_SURVIVOR.fixed", tac)
tac = re.sub(r"\bTAC_STATE_NAMES\b", "TAC_MOVEMENT_SURVIVOR.stateNames", tac)
TACTIC_JS.write_text(tac, encoding="utf-8")

# ---------- 4) 语言包重命名 ----------
for old, new in [
    ("movement.states.run", "movement.survivor.run"),
    ("movement.states.walk", "movement.survivor.walk"),
    ("movement.states.crouch", "movement.survivor.crouch"),
    ("movement.states.crawl", "movement.survivor.crawl"),
    ("tactic.wildling0.name", "movement.survivor.wildling0"),
    ("tactic.prodigy0.name", "movement.survivor.prodigy0"),
    ("tactic.toyMerchant0.name", "movement.survivor.toyMerchant0"),
    ("tactic.prodigy1.name", "movement.survivor.prodigy1"),
    ("tactic.fixed", "movement.survivor.fixed"),
]:
    locale_move(old, new)

new_locale = dict(locale)
for old, new in renames.items():
    new_locale[new] = locale[old]

# 删除不再被任何 js 引用的键
referenced = set()
for f in (ROOT / "js").rglob("*.js"):
    for mm in re.finditer(r'translate\(\s*[\'"]([^\'"]+)[\'"]', f.read_text(encoding="utf-8")):
        referenced.add(mm.group(1))
for f in (ROOT / "index.html",):
    if f.exists():
        for mm in re.finditer(r'translate\(\s*[\'"]([^\'"]+)[\'"]', f.read_text(encoding="utf-8")):
            referenced.add(mm.group(1))

removed = []
for old in renames:
    if old not in referenced:
        del new_locale[old]
        removed.append(old)

LOCALE.write_text(
    json.dumps(new_locale, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)

print(f"角色 label 归属: {sum(1 for o in renames if o.startswith('tactic.range.'))} 处")
print(f"重命名: {sum(1 for o in renames if not o.startswith('tactic.range.'))} 个")
print(f"删除孤儿键: {len(removed)} 个")
for r in sorted(removed):
    print("  -", r)
