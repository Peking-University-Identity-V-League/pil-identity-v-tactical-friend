# -*- coding: utf-8 -*-
"""第五轮重构（地图密码机键名）：
1) 地图作用域密码机名键插入 .cipher：maps.<map>.<id>.name -> maps.<map>.cipher.<id>.name；
2) 通用密码机名键：maps.<id>.name -> maps.default.cipher.<id>.name；
3) 必刷机（locked）feature 统一为 maps.default.cipher.fixed.feature（值「必刷机」）；
4) maps.<map>.hints<Ord> -> maps.<map>.hint.<ord>。
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAPS_JS = ROOT / "js" / "data" / "maps.js"
LOCALE = ROOT / "locales" / "zh-CN.json"

src = MAPS_JS.read_text(encoding="utf-8")
locale = json.loads(LOCALE.read_text(encoding="utf-8"))

MAP_NAMES = ("armsFactory", "chinaTown", "darkwoods", "eversleepingTown",
             "lakesideVillage", "moonlitRiverPark", "sacredHeartHospital", "theRedChurch")
ORD = {"Zero": "zero", "One": "one", "Two": "two", "Three": "three", "Four": "four"}

moves = {}  # old -> new


def locale_move(old, new):
    assert old in locale, f"语言包缺少旧键 {old}"
    if new in locale:
        assert locale[new] == locale[old], f"新键冲突 {new}"
    moves[old] = new


# ---------- 1) JS：地图作用域密码机名键 ----------
name_re = re.compile(
    r'maps\.(' + "|".join(MAP_NAMES) + r")\.([mewabcd]\d+)\.name")


def name_repl(m):
    old = m.group(0)
    new = f"maps.{m.group(1)}.cipher.{m.group(2)}.name"
    if old in locale:
        locale_move(old, new)
    return new


src = name_re.sub(name_repl, src)

# ---------- 2) JS：通用密码机名键 ----------
for cid in ("e0", "e1", "e3", "e4", "w3"):
    old = f'maps.{cid}.name'
    new = f'maps.default.cipher.{cid}.name'
    n = src.count(f'translate("{old}")')
    assert n >= 1, f"{old} 未使用"
    locale_move(old, new)
    src = src.replace(f'translate("{old}")', f'translate("{new}")')

# ---------- 3) JS：必刷机 feature 统一 ----------
FIXED_KEY = "maps.default.cipher.fixed.feature"
locked_features = []
lines = src.splitlines(keepends=True)
fixed_feature_hits = 0
for i, line in enumerate(lines):
    if "locked: true" in line:
        m = re.search(r'feature: translate\("([^"]+)"\)', line)
        assert m, f"第 {i+1} 行 locked 条目缺少 feature"
        locked_features.append(m.group(1))
        lines[i] = line.replace(m.group(0), f'feature: translate("{FIXED_KEY}")')
        fixed_feature_hits += 1
src = "".join(lines)
assert fixed_feature_hits == 7, f"必刷机数量异常: {fixed_feature_hits}"

# ---------- 4) JS：hints 改名 ----------
hints_re = re.compile(
    r'maps\.(' + "|".join(MAP_NAMES) + r")\.hints(Zero|One|Two|Three|Four)")


def hints_repl(m):
    old = m.group(0)
    new = f"maps.{m.group(1)}.hint.{ORD[m.group(2)]}"
    locale_move(old, new)
    return new


src = hints_re.sub(hints_repl, src)
MAPS_JS.write_text(src, encoding="utf-8")

# ---------- 语言包 ----------
new_locale = dict(locale)
for old, new in moves.items():
    new_locale[new] = locale[old]
new_locale[FIXED_KEY] = "必刷机"

# 删除不再被引用的键
referenced = set()
for f in (ROOT / "js").rglob("*.js"):
    for mm in re.finditer(r'translate\(\s*[\'"]([^\'"]+)[\'"]', f.read_text(encoding="utf-8")):
        referenced.add(mm.group(1))

removed = []
for old in moves:
    if old not in referenced and old in new_locale:
        del new_locale[old]
        removed.append(old)

LOCALE.write_text(
    json.dumps(new_locale, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)

print(f"移动 {len(moves)} 个键，删除孤儿键 {len(removed)} 个")
print("必刷机原 feature 键:", locked_features)
for r in sorted(removed):
    print("  -", r)
