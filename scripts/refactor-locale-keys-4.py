# -*- coding: utf-8 -*-
"""第四轮重构：
1) 道具/角色共用的范围键迁入 items.default.* / characters.default.*；
2) TAC_MOVEMENT_BUFFS 中引用 items.*.name 的名称改为新建 movement.buff.* 键（原键保留）；
3) 删除 tactic.run（stateNames.run 改用 movement.survivor.run）；
4) 删除 TAC_MOVEMENT_SURVIVOR.baseSpeed，使用点改用 states.run.speed。
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
tac = TACTIC_JS.read_text(encoding="utf-8")
locale = json.loads(LOCALE.read_text(encoding="utf-8"))

moves = {}    # old -> new（语言包键移动）
copies = {}   # old -> new（语言包键复制，old 保留）


def locale_move(old, new):
    assert old in locale, f"语言包缺少旧键 {old}"
    if new in locale:
        assert locale[new] == locale[old], f"新键冲突 {new}: {locale[new]!r} != {locale[old]!r}"
    moves[old] = new


def locale_copy(old, new):
    assert old in locale, f"语言包缺少旧键 {old}"
    if new in locale:
        assert locale[new] == locale[old], f"新键冲突 {new}"
    copies[old] = new


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


def block_span(text, const_name):
    start = text.index(f"export const {const_name} = {{")
    open_idx = text.index("{", start)
    close_idx = find_close(text, open_idx)
    return open_idx, close_idx


def swap(text, old, new):
    n = text.count(old)
    assert n >= 1, f"{old} 未出现"
    key_old, key_new = old[11:-2], new[11:-2]  # translate("X") -> X
    if key_old not in moves:
        locale_move(key_old, key_new)
    return text.replace(old, new)


# ---------- 1) TAC_ITEM_TYPES 共享键 ----------
io, ic = block_span(src, "TAC_ITEM_TYPES")
item_block = src[io:ic]
item_block = swap(item_block, 'translate("tactic.range.show.label")', 'translate("items.default.range.label.show")')
item_block = swap(item_block, 'translate("tactic.range.show.labelAlternate")', 'translate("items.default.range.label.showAlternate")')
item_block = swap(item_block, 'translate("tactic.range.show.labelThird")', 'translate("items.default.range.label.showThird")')
item_block = swap(item_block, 'translate("tactic.range.show.labelFourth")', 'translate("items.default.range.label.showFourth")')
item_block = swap(item_block, 'translate("tactic.range.label.off")', 'translate("items.default.range.label.off")')
src = src[:io] + item_block + src[ic:]

# ---------- 2) TAC_ROLES 共享键 ----------
ro, rc = block_span(src, "TAC_ROLES")
role_block = src[ro:rc]
n_off = role_block.count('translate("tactic.range.label.off")')
assert n_off > 0
locale_move("tactic.range.label.off", "characters.default.range.label.off")
role_block = role_block.replace('translate("tactic.range.label.off")',
                                'translate("characters.default.range.label.off")')
src = src[:ro] + role_block + src[rc:]

# ---------- 3) TAC_MOVEMENT_BUFFS 中 items.*.name -> 新建 movement.buff.* ----------
bo, bc = block_span(src, "TAC_MOVEMENT_BUFFS")
buff_block = src[bo:bc]

BUFF_NAME_MAP = {
    "items.partWindWing.name": "movement.buff.trait.windWings.name",
    "items.duphrin.name": "movement.buff.trait.duphrin.name",
    "items.heightenedSenses.name": "movement.buff.trait.heightenedSenses.name",
    "items.webersLaw.name": "movement.buff.talent.webersLaw.name",
    "items.nostalgic.name": "movement.buff.talent.nostalgic.name",
    "items.obsession.name": "movement.buff.talent.obsession.name",
    "items.peeper.name": "movement.buff.other.peeper.name",
    "items.fastMusicbox.name": "movement.buff.other.fastMusicbox.name",
    "items.slowMusicbox.name": "movement.buff.other.slowMusicbox.name",
}
for old, new in BUFF_NAME_MAP.items():
    needle = f'translate("{old}")'
    assert buff_block.count(needle) == 1, f"{old} 在 buff 块中出现次数异常"
    locale_copy(old, new)
    buff_block = buff_block.replace(needle, f'translate("{new}")')
src = src[:bo] + buff_block + src[bc:]

# ---------- 4) 删除 tactic.run ----------
old_run = 'run: translate("tactic.run"), walk:'
assert old_run in src
src = src.replace(old_run, 'run: translate("movement.survivor.run"), walk:')

# ---------- 5) 删除 baseSpeed ----------
old_bs = "  baseSpeed: 3.8,\n"
assert old_bs in src
src = src.replace(old_bs, "", 1)
DATA_JS.write_text(src, encoding="utf-8")

# tactic.js 使用点
n = tac.count("TAC_MOVEMENT_SURVIVOR.baseSpeed")
assert n > 0
tac = tac.replace("TAC_MOVEMENT_SURVIVOR.baseSpeed", "TAC_MOVEMENT_SURVIVOR.states.run.speed")
TACTIC_JS.write_text(tac, encoding="utf-8")

# ---------- 语言包 ----------
new_locale = dict(locale)
for old, new in moves.items():
    new_locale[new] = locale[old]
for old, new in copies.items():
    new_locale[new] = locale[old]

# 删除不再被引用的键（tactic.run + 已迁移的 tactic.range.*）
referenced = set()
for f in (ROOT / "js").rglob("*.js"):
    for mm in re.finditer(r'translate\(\s*[\'"]([^\'"]+)[\'"]', f.read_text(encoding="utf-8")):
        referenced.add(mm.group(1))

removed = []
candidates = list(moves) + ["tactic.run"]
for old in candidates:
    if old not in referenced and old in new_locale:
        del new_locale[old]
        removed.append(old)

LOCALE.write_text(
    json.dumps(new_locale, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)

print(f"移动 {len(moves)} 个键，复制 {len(copies)} 个新键，删除 {len(removed)} 个键")
for r in sorted(removed):
    print("  -", r)
