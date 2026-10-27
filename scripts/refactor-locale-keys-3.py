# -*- coding: utf-8 -*-
"""第三轮重构：
1) TAC_TRAIT_BUFFS / TAC_TALENT_BUFFS / TAC_OTHER_BUFFS 合并为 TAC_MOVEMENT_BUFFS；
2) 加成名称键归属：movement.buff.trait.<角色>.<键>.name / movement.buff.talent.<键>.name
   / movement.buff.other.<键>.name。
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

renames = {}  # old -> new


def locale_move(old, new):
    assert old in locale, f"语言包缺少旧键 {old}"
    if new in locale:
        assert locale[new] == locale[old], f"新键冲突 {new}"
    renames[old] = new


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


def extract_block(src, const_name):
    """返回 (头部起始, 内容起始, 内容结束, 结束含分号)。"""
    start = src.index(f"export const {const_name} = {{")
    open_idx = src.index("{", start)
    close_idx = find_close(src, open_idx)
    end = close_idx + 1
    while end < len(src) and src[end] == ";":
        end += 1
    return start, open_idx + 1, close_idx, end


def rename_in(text, mapping_func):
    def repl(m):
        old = m.group(1)
        new = mapping_func(old)
        if new != old:
            locale_move(old, new)
        return f'translate("{new}")'
    return re.sub(r'translate\("([^"]+)"\)', repl, text)


# ---------- 处理三个块 ----------
_, t_open, t_close, t_end = extract_block(src, "TAC_TRAIT_BUFFS")
_, l_open, l_close, l_end = extract_block(src, "TAC_TALENT_BUFFS")
_, o_open, o_close, o_end = extract_block(src, "TAC_OTHER_BUFFS")

# trait：name 键需结合同条目的 role
trait_body = src[t_open:t_close]

trait_entry_re = re.compile(
    r"\{ key: '(\w+)', role: translate\(\"characters\.(\w+)\.name\"\), name: translate\(\"(tactic\.[^\"]+)\"\)"
)


def trait_repl(m):
    buff_key, role, old = m.group(1), m.group(2), m.group(3)
    mm = re.fullmatch(r"tactic\.(\w+)\.(name\w*)", old)
    if not mm or mm.group(1) != buff_key:
        return m.group(0)  # 非 tactic.* 名称（如 items.*）不动
    new = f"movement.buff.trait.{role}.{buff_key}.{mm.group(2)}"
    locale_move(old, new)
    return (f"{{ key: '{buff_key}', role: translate(\"characters.{role}.name\"), "
            f"name: translate(\"{new}\")")


trait_body = trait_entry_re.sub(trait_repl, trait_body)

# talent：tactic.<X>.name -> movement.buff.talent.<X>.name
talent_body = rename_in(src[l_open:l_close],
                        lambda k: re.sub(r"^tactic\.(\w+)\.(name\w*)$",
                                         r"movement.buff.talent.\1.\2", k))

# other：tactic.<X>.name -> movement.buff.other.<X>.name
other_body = rename_in(src[o_open:o_close],
                       lambda k: re.sub(r"^tactic\.(\w+)\.(name\w*)$",
                                        r"movement.buff.other.\1.\2", k))

merged = ("export const TAC_MOVEMENT_BUFFS = {\n"
          "  trait: {" + trait_body + "},\n"
          "  talent: {" + talent_body + "},\n"
          "  other: {" + other_body + "},\n"
          "};")

header_start = src.rindex("export const", 0, t_open)
src = src[:header_start] + merged + src[o_end:]
DATA_JS.write_text(src, encoding="utf-8")

# ---------- tactic.js ----------
tac = TACTIC_JS.read_text(encoding="utf-8")
tac = tac.replace(
    "TAC_OTHER_BUFFS, TAC_ROLES, TAC_SVG_NS, TAC_TALENT_BUFFS, TAC_TRAIT_BUFFS,",
    "TAC_MOVEMENT_BUFFS, TAC_ROLES, TAC_SVG_NS,")
tac = re.sub(r"\bTAC_TRAIT_BUFFS\b", "TAC_MOVEMENT_BUFFS.trait", tac)
tac = re.sub(r"\bTAC_TALENT_BUFFS\b", "TAC_MOVEMENT_BUFFS.talent", tac)
tac = re.sub(r"\bTAC_OTHER_BUFFS\b", "TAC_MOVEMENT_BUFFS.other", tac)
TACTIC_JS.write_text(tac, encoding="utf-8")

# ---------- 语言包 ----------
new_locale = dict(locale)
for old, new in renames.items():
    new_locale[new] = locale[old]

referenced = set()
for f in (ROOT / "js").rglob("*.js"):
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

print(f"重命名 {len(renames)} 个键，删除孤儿键 {len(removed)} 个")
if removed:
    for r in sorted(removed):
        print("  -", r)
