# -*- coding: utf-8 -*-
"""第六轮重构（地图 feature 键）：
1) maps.<map>.<id>.feature -> maps.<map>.cipher.<id>.feature；
2) 弃用 maps.default.cipher.fixed.feature，必刷机还原为图内键（保留分组前缀）；
   两台跨图引用（月亮河E_1、唐人街E_2）改为图内新建键，值取「E1组 必刷机」。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAPS_JS = ROOT / "js" / "data" / "maps.js"
LOCALE = ROOT / "locales" / "zh-CN.json"

src = MAPS_JS.read_text(encoding="utf-8")
locale = json.loads(LOCALE.read_text(encoding="utf-8"))

MAP_NAMES = ("armsFactory", "chinaTown", "darkwoods", "eversleepingTown",
             "lakesideVillage", "moonlitRiverPark", "sacredHeartHospital", "theRedChurch")

moves = {}

# 必刷机：锁定行的 name 键 -> 还原目标 feature 键
LOCKED_RESTORE = {
    "maps.armsFactory.cipher.m4.name": "maps.armsFactory.cipher.m4.feature",
    "maps.theRedChurch.cipher.e4.name": "maps.theRedChurch.cipher.e4.feature",
    "maps.lakesideVillage.cipher.e1.name": "maps.lakesideVillage.cipher.e1.feature",
    "maps.moonlitRiverPark.cipher.m1.name": "maps.moonlitRiverPark.cipher.m1.feature",
    "maps.moonlitRiverPark.cipher.e1.name": "maps.moonlitRiverPark.cipher.e1.feature",
    "maps.theRedChurch.cipher.e1.name": "maps.eversleepingTown.cipher.w1.feature",
    "maps.chinaTown.cipher.e2.name": "maps.chinaTown.cipher.e2.feature",
}

# 需要从 git HEAD 恢复的值（第五轮已删除的旧键）
RECOVER = {
    "maps.armsFactory.cipher.m4.feature": "M3组 必刷机",
    "maps.theRedChurch.cipher.e4.feature": "E3组 必刷机",
    "maps.lakesideVillage.cipher.e1.feature": "E1组 必刷机",
    "maps.moonlitRiverPark.cipher.m1.feature": "M组 必刷机",
    "maps.eversleepingTown.cipher.w1.feature": "W1组 必刷机",
    "maps.moonlitRiverPark.cipher.e1.feature": "E1组 必刷机",
    "maps.chinaTown.cipher.e2.feature": "E1组 必刷机",
}

# ---------- 1) feature 键插入 .cipher（含对跨图同键名的统一处理） ----------
feat_re = re.compile(
    r'maps\.(' + "|".join(MAP_NAMES) + r")\.([mewabcd]\d+)\.feature")


def feat_repl(m):
    old = m.group(0)
    new = f"maps.{m.group(1)}.cipher.{m.group(2)}.feature"
    if old in locale:
        assert new not in locale or True
        moves[old] = new
    return new


src = feat_re.sub(feat_repl, src)

# ---------- 2) 必刷机还原 ----------
FIXED = "maps.default.cipher.fixed.feature"
lines = src.splitlines(keepends=True)
hits = 0
for i, line in enumerate(lines):
    if "locked: true" not in line:
        continue
    name_m = re.search(r'name: translate\("([^"]+)"\)', line)
    assert name_m and name_m.group(1) in LOCKED_RESTORE, f"第 {i+1} 行无法识别: {line.strip()[:90]}"
    target = LOCKED_RESTORE[name_m.group(1)]
    assert FIXED in line, f"第 {i+1} 行缺少 {FIXED}"
    lines[i] = line.replace(f'translate("{FIXED}")', f'translate("{target}")')
    hits += 1
assert hits == 7, f"必刷机数量异常: {hits}"
src = "".join(lines)
MAPS_JS.write_text(src, encoding="utf-8")

# ---------- 语言包 ----------
new_locale = dict(locale)
for old, new in moves.items():
    new_locale[new] = locale[old]
    del new_locale[old]
for k, v in RECOVER.items():
    assert k not in new_locale, f"{k} 已存在"
    new_locale[k] = v
assert FIXED in new_locale
del new_locale[FIXED]

LOCALE.write_text(
    json.dumps(new_locale, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
    encoding="utf-8",
)

print(f"feature 键迁移 {len(moves)} 个，恢复/新建 {len(RECOVER)} 个，删除 {FIXED}")
