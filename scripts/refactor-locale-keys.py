# -*- coding: utf-8 -*-
"""语言包键名大重构：
TAC_ITEM_TYPES / TAC_ROLES 下的范围相关语言键归属到对应道具/角色名下。
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "js" / "data" / "tactic-data.js"
LOCALE = ROOT / "locales" / "zh-CN.json"

SRC = DATA_JS.read_text(encoding="utf-8")

# 移速标签后缀 -> 语义叶子名（每个后缀仅被一个角色使用）
SPEED_LEAF = {
    "": "exhibition",
    "Alternate": "pushBall",
    "Third": "rocketDash0",
    "Fourth": "rocketDash1",
    "Fifth": "rocketDash2",
    "Sixth": "beautyForm",
    "Seventh": "prajnaForm",
    "Eighth": "xieBian",
    "Ninth": "fanWuJiu",
    "Tenth": "originalBody",
    "Eleventh": "humanForm",
    "Twelfth": "wheelForm",
    "Thirteenth": "ivy",
}

# 每个 speed 后缀期望所属的角色（校验用）
SPEED_OWNER = {
    "": "prodigy", "Alternate": "prodigy",
    "Third": "smileyFace", "Fourth": "smileyFace", "Fifth": "smileyFace",
    "Sixth": "geisha", "Seventh": "geisha",
    "Eighth": "wuchang", "Ninth": "wuchang",
    "Tenth": "dreamWitch",
    "Eleventh": "theBreakingWheel", "Twelfth": "theBreakingWheel",
    "Thirteenth": "theShadow",
}

GENERIC_LABEL_GROUPS = ("show", "show1", "show2")

pairs = []  # (old_key, new_key) 逐处记录


def lower_first(s):
    return s[0].lower() + s[1:] if s else s


def make_replacer(ns, entry_key):
    def repl(m):
        old = m.group(1)
        new = map_key(old, ns, entry_key)
        if new != old:
            pairs.append((old, new))
        return f'translate("{new}")'
    return repl


def map_key(k, ns, entry_key):
    # 通用「关闭」
    if k == "tactic.off.label":
        return "tactic.range.label.off"
    # size_m 档位标签
    m = re.fullmatch(r"tactic\.sizeM\.tac(?:ItemTypes|Roles)(\w+)", k)
    if m:
        return f"{ns}.range.sizeM.{lower_first(m.group(1))}"
    # 恐惧半径修正标签
    m = re.fullmatch(r"tactic\.fearMods\.tacItemTypes(\w+)", k)
    if m:
        return f"{ns}.range.fearMods.{lower_first(m.group(1))}"
    # 移速状态标签
    m = re.fullmatch(r"tactic\.speed\.tacRoles(\w*)", k)
    if m:
        suffix = m.group(1)
        assert SPEED_OWNER[suffix] == lower_first(entry_key), f"speed key {k} 出现在 {entry_key}"
        return f"{ns}.speed.{SPEED_LEAF[suffix]}"
    # 通用 card 回退键 -> 归属到当前实体
    if k == "application.card":
        return f"{ns}.range.card.application"
    # 通用 label（show/show1/show2 家族）-> 共享 tactic.range.*
    m = re.fullmatch(r"tactic\.(show\d*)\.(label\w*)", k)
    if m:
        return f"tactic.range.{m.group(1)}.{m.group(2)}"
    # 其余 card -> 归属当前实体
    m = re.fullmatch(r"tactic\.(\w+)\.(card\w*)", k)
    if m:
        return f"{ns}.range.card.{m.group(1)}"
    # 其余 label -> 归属当前实体
    m = re.fullmatch(r"tactic\.(\w+)\.(label\w*)", k)
    if m:
        return f"{ns}.range.label.{m.group(1)}"
    return k


def find_matching_brace(text, open_idx):
    depth = 0
    for i in range(open_idx, len(text)):
        c = text[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
    raise ValueError("unbalanced braces")


def process_section(src, const_name, ns_prefix):
    start = src.index(f"export const {const_name} = {{")
    open_idx = src.index("{", start)
    close_idx = find_matching_brace(src, open_idx)
    section = src[open_idx:close_idx + 1]

    out = []
    pos = 0
    entry_re = re.compile(r'^  ([A-Za-z0-9]+): \{', re.MULTILINE)
    for m in entry_re.finditer(section):
        entry_key = m.group(1)
        brace_open = section.index("{", m.start())
        brace_close = find_matching_brace(section, brace_open)
        block = section[brace_open:brace_close + 1]
        ns = ns_prefix + lower_first(entry_key)
        new_block = re.sub(r'translate\("([^"]+)"\)', make_replacer(ns, entry_key), block)
        out.append(section[pos:brace_open])
        out.append(new_block)
        pos = brace_close + 1
    out.append(section[pos:])
    new_section = "".join(out)
    return src[:open_idx] + new_section + src[close_idx + 1:]


SRC = process_section(SRC, "TAC_ITEM_TYPES", "items.")
SRC = process_section(SRC, "TAC_ROLES", "characters.")

DATA_JS.write_text(SRC, encoding="utf-8")

# ---------- 语言包迁移 ----------
locale = json.loads(LOCALE.read_text(encoding="utf-8"))
new_locale = dict(locale)
removed, added = set(), set()
for old, new in pairs:
    if old not in locale:
        print(f"!! 语言包缺少旧键: {old}", file=sys.stderr)
        continue
    if old != "application.card":  # tactic.js 回退仍在用，保留
        removed.add(old)
    if new in new_locale and new_locale[new] != locale[old]:
        print(f"!! 新键冲突: {new} 已有不同值", file=sys.stderr)
        continue
    new_locale[new] = locale[old]
    added.add(new)

for old in removed:
    del new_locale[old]

LOCALE.write_text(
    json.dumps(new_locale, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)

print(f"JS 替换 {len(pairs)} 处；语言包删除 {len(removed)} 个旧键，新增 {len(added)} 个新键。")
