import {
  tacItemSection,
  tacMapWrap,
  tacRolesEl,
  tacRolesHunterEl,
  tacRolesOtherEl,
  tacticView,
} from '../core/dom.js';
import { tacBoard, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { TAC_ITEM_TYPES } from '../data/items.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_ABYSS_MAX_M } from '../data/tactic-data.js';
import { renderTacArrows, renderTacBoard } from './board.js';
import { setTacTool, tacTool } from './panel.js';
import {
  setTacPlaceItem,
  setTacPlaceRole,
  setTacSelected,
  setTacSelectedItem,
  tacPlaceItem,
  tacPlaceRole,
  tacSelected,
  tacSelectedItem,
} from './selection.js';

function tacItemMetersToPercent(meters) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  return widthM ? (meters * 2 / widthM) * 100 : null;
}

function tacCrossSvg(opt, meters, angle) {
  const w = Math.max(0.5, (opt.crossWidth / (meters * 2)) * 100);
  const y = (100 - w) / 2;
  return '<svg class="tac-item-cross-svg" viewBox="0 0 100 100" aria-hidden="true">'
    + `<g transform="rotate(${((angle || 0) % 360 + 360) % 360} 50 50)">`
    + `<rect x="0" y="${y.toFixed(3)}" width="100" height="${w.toFixed(3)}"/>`
    + `<rect x="${y.toFixed(3)}" y="0" width="${w.toFixed(3)}" height="100"/>`
    + '</g></svg>';
}

function tacRingSvg(opt) {
  const ratio = Math.min(0.95, Math.max(0, opt.ringInner / opt.size_m));
  const rIn = 45 * ratio;
  const yIn = 50 - rIn;
  return '<svg class="tac-role-ring-svg" viewBox="0 0 100 100" aria-hidden="true">'
    + '<path fill-rule="evenodd" d="'
    + 'M50 5 A45 45 0 1 1 49.99 5 Z '
    + `M50 ${yIn.toFixed(3)} A${rIn.toFixed(3)} ${rIn.toFixed(3)} 0 1 1 49.99 ${yIn.toFixed(3)} Z"/>`
    + '</svg>';
}

function tacRangeDefaultKey(cfg, hideByDefault) {
  // 新格式 ranges 无 key 语义：返回 null 表示「无默认显示」
  return null;
}

function tacRangeModeOf(cfg, inst, hideByDefault) {
  if (!cfg) return null;
  const e = tacRangeEntries(cfg, inst, hideByDefault);
  return e.length ? e[0].opt : null;
}

const TAC_RANGE_DEFAULT_FILL = 'rgba(226, 232, 240, 0.1)';

const TAC_TALENTS_BY_CAMP = {
  survivor: ['fearRadius', 'webersLaw', 'sneak'],
  hunter: ['tinnitus', 'fearRadius', 'addiction', 'nostalgic', 'skittish',
    'deerHunt', 'streetSweeper', 'wither', 'obsession', 'famine'],
};

function tacRangeFmt(m) {
  return String(Math.round(m * 100) / 100);
}

function tacOptionMeters(opt, rb, cfg) {
  const s = opt && opt.size_m;
  if (s == null) return null;
  let base;
  if (typeof s === 'number') {
    base = s;
  } else if (Array.isArray(s)) {
    // 档位模式：[9,12,15]，rb.gear 为当前挡位索引
    const gi = rb && Number.isInteger(rb.gear) ? rb.gear : 0;
    base = s[Math.min(Math.max(gi, 0), s.length - 1)];
  } else if (typeof s === 'object') {
    // 滑杆模式：{min,max}，max 为 null 时取地图宽
    const dynMax = s.max != null ? s.max
      : (MAPS_DATA[S.currentMapId] && MAPS_DATA[S.currentMapId].widthM) || 100;
    base = rb && rb.m != null ? rb.m : dynMax;
  } else {
    return null;
  }
  if (!(base > 0)) return null; // 半径 0 等价于隐藏范围
  if (cfg && cfg.fearMods) {
    const pick = (opts, v) => (opts.find((o) => o[0] === v) || opts[0])[2];
    base *= pick(cfg.fearMods.hunter, rb && rb.fearH)
      * pick(cfg.fearMods.survivor, rb && rb.fearS);
  }
  return base;
}

function tacRangeEntries(cfg, inst, hideByDefault) {
  if (!cfg || !Array.isArray(cfg.options)) return [];
  const rb = tacRbEnsure(cfg, inst, hideByDefault, false);
  const out = [];
  const subs = Array.isArray(rb.subs) ? rb.subs : [];
  for (const i of subs) {
    if (i < 0 || i >= cfg.options.length) continue;
    const opt = cfg.options[i];
    const meters = tacOptionMeters(opt, rb, cfg);
    if (meters == null) continue;
    out.push({ opt, i, meters });
  }
  return out;
}

function tacRbEnsure(cfg, inst, hideByDefault, defFill) {
  if (inst.rangeBox && !inst.rangeBox.modes) {
    // 新结构 rangeBox：{ tab, subs, talents, fill, m, fearH, fearS }
    const rb = inst.rangeBox;
    if (!Array.isArray(rb.subs)) rb.subs = [];
    if (!rb.talents) rb.talents = {};
    if (rb.tab === undefined) rb.tab = null;
    if (rb.fill === undefined) rb.fill = !!defFill;
    return rb;
  }
  // 迁移旧 rangeBox（modes 结构）或 legacy 字段（rangeMode/hideRange/rangeMeters）
  const n = (cfg.options || []).length;
  let tab = null;
  let subs = [];
  let m;
  let fearH;
  let fearS;
  const talents = {};
  const old = inst.rangeBox;
  if (old && old.modes) {
    for (const k of Object.keys(old.modes)) {
      const st = old.modes[k];
      if (!st) continue;
      if (st.m != null) m = st.m;
      if (st.fearH) fearH = st.fearH;
      if (st.fearS) fearS = st.fearS;
    }
    const hadSubs = Object.keys(old.modes).length > 0;
    const hadTalents = !!(old.talents && Object.keys(old.talents).length);
    tab = old.activeGroup === '__talents' || (hadTalents && !hadSubs) ? 'talents'
      : (hadSubs || old.activeGroup ? 'range' : null);
    for (const tk of Object.keys(old.talents || {})) talents[tk] = old.talents[tk];
    if (old.fill !== undefined) defFill = old.fill;
    if (tab === 'range') subs = n ? [0] : [];
  } else {
    const legacyKey = inst.rangeMode || (inst.hideRange ? 'off' : null);
    if (n && (legacyKey ? legacyKey !== 'off' : !hideByDefault)) {
      // 道具新创建默认显示第一个范围；角色默认隐藏
      tab = 'range';
      subs = [0];
    }
    if (inst.rangeMeters != null) m = inst.rangeMeters;
  }
  const rb = inst.rangeBox = { tab, subs, talents };
  if (defFill) rb.fill = true;
  if (m != null) rb.m = m;
  if (fearH) rb.fearH = fearH;
  if (fearS) rb.fearS = fearS;
  return rb;
}

function tacHostCamp(role) {
  return (TAC_ROLES[role] || {}).camp === 'hunter' ? 'hunter' : 'survivor';
}

function tacTalentButtons(hostRole, camp) {
  const list = TAC_TALENTS_BY_CAMP[camp] || TAC_TALENTS_BY_CAMP.survivor;
  const out = [];
  for (const kind of list) {
    const def = TAC_ITEM_TYPES[kind];
    if (!def || !def.ranges || !Array.isArray(def.ranges.options)) continue;
    const opt = def.ranges.options[0];
    if (!opt || opt.size_m == null) continue;
    if (kind === 'fearRadius') {
      // 恐惧半径修正数据在角色条目下（survivor.js / hunter.js 的 fearRadius 字段）
      const fr = (TAC_ROLES[hostRole] || {}).fearRadius;
      if (camp === 'hunter' && fr && fr.forms) {
        out.push({
          tk: 'fearRadius', kind, label: def.name, base: opt.size_m,
          variants: fr.forms.map((f) => ({ key: f.key, label: f.name, mult: f.mult })),
        });
        continue;
      }
      const mult = (camp !== 'hunter' && fr && fr.mult) || 1;
      out.push({ tk: 'fearRadius', kind, label: def.name, base: opt.size_m, mult });
      continue;
    }
    out.push({ tk: kind, kind, label: def.name, opt });
  }
  return out;
}

function tacTalentRanges(inst, hostRole) {
  const rb = inst && inst.rangeBox;
  if (!rb || !rb.talents) return [];
  const camp = tacHostCamp(hostRole);
  const out = [];
  for (const b of tacTalentButtons(hostRole, camp)) {
    const sel = rb.talents[b.tk];
    if (!sel) continue;
    let meters;
    let sub = null;
    if (b.variants) {
      const v = b.variants.find((x) => x.key === sel.variant) || b.variants[0];
      sub = v.label;
      meters = b.base * v.mult;
    } else if (b.base != null) {
      meters = b.base * b.mult;
    } else {
      meters = tacOptionMeters(b.opt, sel, null);
    }
    if (meters == null) continue;
    out.push({ ...b, meters, sel, sub });
  }
  return out;
}

function tacRangeMetersOf(cfg, inst, hideByDefault) {
  const e = tacRangeEntries(cfg, inst, hideByDefault);
  return e.length ? e[0].meters : null;
}

function tacItemMeters(it) {
  return tacRangeMetersOf((TAC_ITEM_TYPES[it.kind] || {}).ranges, it, false);
}

function tacItemSizePercent(it) {
  const meters = tacItemMeters(it);
  return meters === null ? null : tacItemMetersToPercent(meters);
}

function tacRoleRangeMode(role, token) {
  return tacRangeModeOf((TAC_ROLES[role] || {}).ranges, token, true);
}

function tacRoleRangeMeters(role, token) {
  return tacRangeMetersOf((TAC_ROLES[role] || {}).ranges, token, true);
}

// —— 多实例角色：tokens 为数组，tacSelected 存 tid ——
function tacTokenByTid(tid) {
  return tacBoard().tokens.find((t) => t.tid === tid) || null;
}

function tacTokenByRole(role) {
  return tacBoard().tokens.find((t) => t.role === role) || null;
}

function tacItemByIid(iid) {
  return tacBoard().items.find((it) => it.iid === iid) || null;
}

function tacSelRole() {
  const t = tacSelected != null ? tacTokenByTid(tacSelected) : null;
  return t ? t.role : null;
}

let tacItemRole = null;

// ———— 连线系统 ————
// 同种两两相连（移行/音符/雕像）：linkIid 双向引用（仅这类道具有 linkMaxM）
function tacSameLinkable(def) {
  return !!def && def.render === 'link';
}

// 异造物相连（镇魂伞→宿伞之魂等）：道具 linkTid 指向角色实例
function tacLinkPartner(it) {
  if (!it || it.linkIid == null) return null;
  return tacItemByIid(it.linkIid);
}

function tacLinkTokenOf(it) {
  if (!it || it.linkTid == null) return null;
  return tacTokenByTid(it.linkTid);
}

function tacTokenLinkedItems(t) {
  return tacBoard().items.filter((it) => it.linkTid === t.tid);
}

// 击球点链式连线：board.hpEdges = [{ a: iid, b: iid, close }]
// 链式生长：新点连最近一个「允许连线且未封闭」的点；第 3 个开放点可用提前闭合，
// 第 4 个开放点自动与最早的开放点闭合；封闭边无距离限制
const TAC_HP_KIND = 'contactPoint';

const TAC_HP_MIN_M = 4;

const TAC_HP_MAX_M = 35;

function tacHpItems() {
  return tacBoard().items.filter((it) => it.kind === TAC_HP_KIND);
}

function tacHpEdges() {
  const b = tacBoard();
  b.hpEdges ||= [];
  return b.hpEdges;
}

// 与某击球点相连的对端：普通边 / 封闭边分开返回
function tacHpPeers(it) {
  const reg = [];
  const close = [];
  for (const e of tacHpEdges()) {
    const other = e.a === it.iid ? e.b : (e.b === it.iid ? e.a : null);
    if (other == null) continue;
    const o = tacItemByIid(other);
    if (!o) continue;
    (e.close ? close : reg).push(o);
  }
  return { reg, close };
}

// 通过连线边得到的相连组件（共享按钮 / 一起删除的范围）
function tacHpComponent(it) {
  const seen = new Set([it.iid]);
  const queue = [it.iid];
  while (queue.length) {
    const cur = queue.pop();
    for (const e of tacHpEdges()) {
      const other = e.a === cur ? e.b : (e.b === cur ? e.a : null);
      if (other != null && !seen.has(other)) { seen.add(other); queue.push(other); }
    }
  }
  return tacHpItems().filter((o) => seen.has(o.iid));
}

// 开放点按加入链的顺序（hpSeq）排序：重新勾选允许连线后加入顺序优先于创建顺序
function tacHpOpenItems() {
  return tacHpItems().filter((o) => o.linkAuto !== false && !o.hpClosed)
    .sort((x, y) => (x.hpSeq || 0) - (y.hpSeq || 0) || x.iid - y.iid);
}

function tacHpComponentOpen(comp) {
  return comp.filter((o) => o.linkAuto !== false && !o.hpClosed)
    .sort((x, y) => (x.hpSeq || 0) - (y.hpSeq || 0) || x.iid - y.iid);
}

// 闭合本组件：最新开放点与最早开放点连成封闭边，组件全部转为封闭态
function tacHpCloseShape(item) {
  const opens = tacHpComponentOpen(tacHpComponent(item));
  if (opens.length < 3) return false;
  const newest = opens[opens.length - 1];
  const earliest = opens[0];
  tacHpEdges().push({ a: newest.iid, b: earliest.iid, close: true });
  opens.forEach((o) => { o.hpClosed = true; });
  return true;
}

// 击球点位置钳制：普通相连边距离限制 4-35m，封闭边无限制
function tacHpClampPos(item, x, y) {
  const map = MAPS_DATA[S.currentMapId];
  const widthM = map && map.widthM;
  const size = map && map.mapSize;
  if (!widthM || !size) return { x, y };
  const [dw, dh] = size;
  const minU = TAC_HP_MIN_M / widthM * dw;
  const maxU = TAC_HP_MAX_M / widthM * dw;
  let px = x;
  let py = y;
  for (const e of tacHpEdges()) {
    if (e.close) continue;
    if (e.a !== item.iid && e.b !== item.iid) continue;
    const o = tacItemByIid(e.a === item.iid ? e.b : e.a);
    if (!o) continue;
    const ux = (px - o.x) * dw;
    const uy = (py - o.y) * dh;
    const units = Math.hypot(ux, uy);
    if (units < 1e-9) {
      // 与对端重合：向右侧推出最小距离
      px = o.x + minU / dw;
      continue;
    }
    if (units < minU || units > maxU) {
      const k = Math.min(Math.max(units, minU), maxU) / units;
      px = o.x + (px - o.x) * k;
      py = o.y + (py - o.y) * k;
    }
  }
  return { x: px, y: py };
}

// 击球点加入链（创建 / 勾选允许连线）：连最近加入的开放点；开放数达 4 自动闭合
function tacHpJoin(item) {
  const b = tacBoard();
  item.hpSeq = (b.hpSeq = (b.hpSeq || 0) + 1);
  const mates = tacHpOpenItems().filter((o) => o !== item);
  if (mates.length) {
    const latest = mates[mates.length - 1];
    tacHpEdges().push({ a: item.iid, b: latest.iid, close: false });
    // 相连瞬间显示连线打勾（两端共享）
    item.linkShow = true;
    latest.linkShow = true;
    // 保证与相连点距离不少于 4m 不超过 35m
    const cl = tacHpClampPos(item, item.x, item.y);
    item.x = cl.x;
    item.y = cl.y;
  }
  const opens = tacHpComponentOpen(tacHpComponent(item));
  if (opens.length >= 4) tacHpCloseShape(item);
}

// 取消允许连线：组件内全部取消允许连线、解除连线、恢复未封闭态
function tacHpDissolve(item) {
  const comp = tacHpComponent(item);
  const ids = new Set(comp.map((o) => o.iid));
  const b = tacBoard();
  b.hpEdges = tacHpEdges().filter((e) => !(ids.has(e.a) && ids.has(e.b)));
  comp.forEach((o) => { o.linkAuto = false; o.hpClosed = false; delete o.hpSeq; });
}

function tacSetSameLink(a, b) {
  a.linkIid = b.iid;
  b.linkIid = a.iid;
  // 显示连线共享：相连瞬间任一端打勾则两端打勾，都未勾则保持未勾
  const show = a.linkShow !== false || b.linkShow !== false;
  a.linkShow = show;
  b.linkShow = show;
}

// 解除水镜/渔猎的专属状态（镜像造物、模拟水渊），供相连与解除相连共用
function tacClearMirrorState(aq) {
  if (!aq || aq.kind !== 'aquaMirror') return;
  aq.showMirror = false;
  aq.fixedMirror = false;
  delete aq.mirrorAxis;
  const b = tacBoard();
  for (let i = b.items.length - 1; i >= 0; i -= 1) {
    if (b.items[i].kind === 'mirrorImage'
      && (b.items[i].aqIid == null || b.items[i].aqIid === aq.iid)) {
      b.items.splice(i, 1);
    }
  }
}

function tacClearAbyss(sp) {
  if (sp && sp.kind === 'spearfishing') delete sp.abyss;
}

// 异造物相连：写入 linkTid 并同步显示连线共享；水镜相连时重置镜像状态，渔猎相连时关闭模拟水渊
function tacSetCrossLink(item, token) {
  item.linkTid = token.tid;
  const show = item.linkShow !== false || token.linkShow !== false;
  item.linkShow = show;
  token.linkShow = show;
  if (item.kind === 'aquaMirror') tacClearMirrorState(item);
  if (item.kind === 'spearfishing') tacClearAbyss(item);
}

function tacClearSameLink(it) {
  const p = tacLinkPartner(it);
  if (p) delete p.linkIid;
  delete it.linkIid;
}

// 创建道具后自动连线：只连最早创建的一个未连线且勾选自动连线的同类造物（两两相连）
function tacAutoLinkItem(item) {
  const def = TAC_ITEM_TYPES[item.kind];
  if (!def) return;
  if (tacSameLinkable(def)) {
    const mate = tacBoard().items.find((o) => o !== item && o.kind === item.kind
      && o.linkIid == null && o.linkAuto !== false);
    if (mate) tacSetSameLink(item, mate);
  } else if (def.linkToRole) {
    const mate = tacBoard().tokens.find((t) => t.role === def.linkToRole
      && t.linkAuto !== false && !tacTokenLinkedItems(t).length);
    if (mate) tacSetCrossLink(item, mate);
  } else if (item.kind === TAC_HP_KIND) {
    tacHpJoin(item);
  }
}

// 创建角色后自动连线：最早创建的未连线且勾选自动连线的对应道具
function tacAutoLinkToken(token) {
  const item = tacBoard().items.find((it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    return def && def.linkToRole === token.role
      && it.linkTid == null && it.linkAuto !== false;
  });
  if (item) tacSetCrossLink(item, token);
}

// 解除道具连线并按规则补连（删除道具 / 取消自动连线时）
function tacBreakItemLink(item, relink = true) {
  const def = TAC_ITEM_TYPES[item.kind];
  if (!def) return;
  if (tacSameLinkable(def)) {
    const p = tacLinkPartner(item);
    tacClearSameLink(item);
    if (relink && p) {
      const mate = tacBoard().items.find((o) => o !== p && o.kind === p.kind
        && o.linkIid == null && o.linkAuto !== false);
      if (mate) tacSetSameLink(p, mate);
    }
  } else if (def.linkToRole) {
    const tk = tacLinkTokenOf(item);
    delete item.linkTid;
    tacClearMirrorState(item);
    tacClearAbyss(item);
    if (relink && tk) tacAutoLinkToken(tk);
  }
}

// 角色删除 / 取消自动连线时：其相连道具改连其它未连线且勾选自动连线的同类角色
function tacBreakTokenLinks(token, relink = true) {
  for (const it of [...tacTokenLinkedItems(token)]) {
    delete it.linkTid;
    tacClearMirrorState(it);
    tacClearAbyss(it);
    if (!relink) continue;
    const def = TAC_ITEM_TYPES[it.kind];
    const mate = def && tacBoard().tokens.find((t) => t !== token
      && t.role === def.linkToRole && t.linkAuto !== false
      && !tacTokenLinkedItems(t).length);
    if (mate) tacSetCrossLink(it, mate);
  }
}

function tacClampLinkPos(idx, x, y) {
  const it = tacBoard().items[idx];
  const def = it && TAC_ITEM_TYPES[it.kind];
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!def || !def.linkMaxM || !widthM) return { x, y };
  const partner = tacLinkPartner(it);
  if (!partner) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  const ux = (x - partner.x) * dw, uy = (y - partner.y) * dh;
  const units = Math.hypot(ux, uy);
  const maxUnits = def.linkMaxM / widthM * dw;
  if (units <= maxUnits || units < 1e-9) return { x, y };
  const k = maxUnits / units;
  return { x: partner.x + (x - partner.x) * k, y: partner.y + (y - partner.y) * k };
}

function tacClampRoleLinkPos(idx, x, y) {
  const it = tacBoard().items[idx];
  const def = it && TAC_ITEM_TYPES[it.kind];
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!def || !def.linkToRole || !def.linkMaxM || !widthM) return { x, y };
  const tk = tacLinkTokenOf(it);
  if (!tk) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  const ux = (x - tk.x) * dw, uy = (y - tk.y) * dh;
  const units = Math.hypot(ux, uy);
  const maxUnits = def.linkMaxM / widthM * dw;
  if (units <= maxUnits || units < 1e-9) return { x, y };
  const k = maxUnits / units;
  return { x: tk.x + (x - tk.x) * k, y: tk.y + (y - tk.y) * k };
}

function tacClampTokenToLinkedItems(t, x, y) {
  const widthM = MAPS_DATA[S.currentMapId].widthM;
  if (!widthM || !t) return { x, y };
  const [dw, dh] = MAPS_DATA[S.currentMapId].mapSize;
  let cx = x, cy = y;
  for (const it of tacTokenLinkedItems(t)) {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def || !def.linkMaxM) continue;
    const ux = (cx - it.x) * dw, uy = (cy - it.y) * dh;
    const units = Math.hypot(ux, uy);
    const maxUnits = def.linkMaxM / widthM * dw;
    if (units > maxUnits && units > 1e-9) {
      const k = maxUnits / units;
      cx = it.x + (cx - it.x) * k;
      cy = it.y + (cy - it.y) * k;
    }
  }
  return { x: cx, y: cy };
}

function tacMirrorParts(aq = null) {
  const board = tacBoard();
  aq = aq || board.items.find((it) => it.kind === 'aquaMirror') || null;
  const bq = (aq && aq.linkTid != null
    ? board.tokens.find((t) => t.tid === aq.linkTid) : null) || null;
  if (!aq || !bq) return null;
  const miIdx = board.items.findIndex((it) => it.kind === 'mirrorImage'
    && (it.aqIid == null || it.aqIid === aq.iid));
  return { bq, aq, mi: miIdx >= 0 ? board.items[miIdx] : null, miIdx };
}

function tacSyncMirror(moved = null, targetAq = null) {
  const board = tacBoard();
  const parts = tacMirrorParts(targetAq);
  if (!parts) return false;
  const { bq, aq } = parts;
  let { mi, miIdx } = parts;
  const clamp01 = (v) => Math.min(0.995, Math.max(0.005, v));
  let changed = false;

  if (!aq || !aq.showMirror) {
    if (miIdx >= 0) { board.items.splice(miIdx, 1); changed = true; }
    if (aq) delete aq.mirrorAxis;
    return changed;
  }

  const W = tacMapWrap.clientWidth || 1;
  const H = tacMapWrap.clientHeight || 1;
  if (!mi) {
    mi = {
      iid: ++board.itemSeq,
      role: 'bloodyQueen', kind: 'mirrorImage',
      aqIid: aq.iid,
      x: clamp01(2 * aq.x - bq.x), y: clamp01(2 * aq.y - bq.y),
    };
    board.items.push(mi);
    changed = true;
    return changed;
  }

  if (aq.fixedMirror) {
    if (!aq.mirrorAxis) {
      const dx = (bq.x - aq.x) * W, dy = (bq.y - aq.y) * H;
      const len = Math.hypot(dx, dy) || 1;

      aq.mirrorAxis = { x: aq.x, y: aq.y, nx: dx / len, ny: dy / len };
      changed = true;
    }
    const ax = aq.mirrorAxis.x * W, ay = aq.mirrorAxis.y * H;
    const reflect = (q) => {
      const px = q.x * W, py = q.y * H;
      const dot = (px - ax) * aq.mirrorAxis.nx + (py - ay) * aq.mirrorAxis.ny;
      return { x: (px - 2 * dot * aq.mirrorAxis.nx) / W, y: (py - 2 * dot * aq.mirrorAxis.ny) / H };
    };
    if (moved === 'bq') {
      const r = reflect(bq);
      mi.x = clamp01(r.x); mi.y = clamp01(r.y); changed = true;
    } else if (moved === 'mi') {
      const r = reflect(mi);
      bq.x = clamp01(r.x); bq.y = clamp01(r.y); changed = true;
    }
    return changed;
  }

  delete aq.mirrorAxis;
  if (moved === 'mi') {
    aq.x = clamp01((bq.x + mi.x) / 2);
    aq.y = clamp01((bq.y + mi.y) / 2);
    changed = true;
  } else {
    mi.x = clamp01(2 * aq.x - bq.x);
    mi.y = clamp01(2 * aq.y - bq.y);
    changed = true;
  }
  return changed;
}

function tacSyncMirrorEl(kind, refItem = null) {
  const b = tacBoard();
  let i2 = -1;
  if (refItem) i2 = b.items.indexOf(refItem);
  else i2 = b.items.findIndex((o) => o.kind === kind);
  const o2 = i2 >= 0 ? b.items[i2] : null;
  if (!o2) return;
  // 该造物的所有范围圈/图标都要一起移动（镜像可同时显示三个范围）
  tacMapWrap.querySelectorAll(
    `.tac-item-circle[data-idx="${i2}"], .tac-item-pin[data-idx="${i2}"]`)
    .forEach((el2) => { el2.style.left = `${o2.x * 100}%`; el2.style.top = `${o2.y * 100}%`; });
}

function tacOnItemRemoved(removed) {
  if (!removed) return;
  tacBreakItemLink(removed, true);
  if (removed.kind === TAC_HP_KIND) {
    const b = tacBoard();
    if (removed.hpClosed) {
      const comp = tacHpComponent(removed);
      const ids = new Set(comp.map((o) => o.iid));
      ids.add(removed.iid);
      b.hpEdges = (b.hpEdges || []).filter((e) => !(ids.has(e.a) && ids.has(e.b)));
      for (let i = b.items.length - 1; i >= 0; i -= 1) {
        if (b.items[i] !== removed && ids.has(b.items[i].iid)) b.items.splice(i, 1);
      }
    } else {
      b.hpEdges = (b.hpEdges || []).filter((e) => e.a !== removed.iid && e.b !== removed.iid);
    }
  }
  if (removed.kind === 'mirrorImage') {
    const aq = (removed.aqIid != null && tacItemByIid(removed.aqIid))
      || tacBoard().items.find((it) => it.kind === 'aquaMirror');
    if (aq && aq.showMirror) {
      aq.showMirror = false;
      aq.fixedMirror = false;
      delete aq.mirrorAxis;
      tacSave();
    }
  }
  if (removed.kind === 'aquaMirror') {
    for (let i = tacBoard().items.length - 1; i >= 0; i -= 1) {
      if (tacBoard().items[i].kind === 'mirrorImage') tacBoard().items.splice(i, 1);
    }
  }
}

function tacOnTokenRemoved(removed) {
  if (!removed) return;
  tacBreakTokenLinks(removed, true);
  if (removed.role === 'bloodyQueen') {
    const b = tacBoard();
    if (!b.tokens.some((t) => t.role === 'bloodyQueen')) {
      for (let i = b.items.length - 1; i >= 0; i -= 1) {
        if (b.items[i].kind === 'mirrorImage') b.items.splice(i, 1);
      }
    }
    b.items.filter((it) => it.kind === 'aquaMirror' && it.linkTid != null)
      .forEach((aq) => tacSyncMirror(null, aq));
  }
}

function tacAbyssItem(tid = null) {
  return tacBoard().items.find((it) =>
    it.kind === 'spearfishing' && it.abyss && it.abyss.on
    && (tid == null || it.linkTid === tid)) || null;
}

function tacAbyssMeters(a, b) {
  const map = MAPS_DATA[S.currentMapId];
  if (!map.widthM) return null;
  const [dw, dh] = map.mapSize;
  return Math.hypot((a.x - b.x) * dw, (a.y - b.y) * dh) / dw * map.widthM;
}

function tacAbyssRecord(p, t) {
  const it = t ? tacAbyssItem(t.tid) : null;
  if (!it || !it.abyss.recording) return;
  const nt = t;
  const ab = it.abyss;
  const last = ab.trail[ab.trail.length - 1];
  if (last && Math.hypot((nt.x - last.x) * p.W, (nt.y - last.y) * p.H) < 5) return;
  ab.done = null;
  const m = tacAbyssMeters(nt, it);
  if (m !== null && m > TAC_ABYSS_MAX_M) {
    const k = TAC_ABYSS_MAX_M / m;
    ab.trail.push({ x: it.x + (nt.x - it.x) * k, y: it.y + (nt.y - it.y) * k });
    ab.done = ab.trail.slice();
    ab.recording = false;
    renderTacArrows();
    return;
  }
  ab.trail.push({ x: nt.x, y: nt.y });
  renderTacArrows();
}

function tacAbyssFinalize() {
  const it = tacBoard().items.find((o) => o.kind === 'spearfishing'
    && o.abyss && o.abyss.on && o.abyss.recording);
  if (!it) return;
  const ab = it.abyss;
  ab.recording = false;
  if (ab.trail.length >= 2) ab.done = ab.trail.slice();
  ab.trail = [];
  renderTacArrows();
}

function buildTacRoles() {
  const campBoxes = {
    survivor: tacRolesEl, hunter: tacRolesHunterEl, other: tacRolesOtherEl,
  };
  Object.values(campBoxes).forEach((box) => { box.innerHTML = ''; });
  for (const [role, def] of Object.entries(TAC_ROLES)) {
    const btn = document.createElement('button');
    btn.className = 'tac-role';
    btn.dataset.role = role;
    btn.style.setProperty('--rc', def.color || '#fff');
    btn.innerHTML = def.icon
      ? `<span class="tac-role-dot tac-role-img">`
        + `<img src="${def.icon}" alt="${def.name}" draggable="false"></span>${def.name}`
      : `<span class="tac-role-dot">${(def.name || role).charAt(0)}</span>${def.name}`;
    btn.addEventListener('click', () => onTacRoleClick(role));
    (campBoxes[def.camp] || tacRolesEl).appendChild(btn);
  }
}

function onTacRoleClick(role) {

  if (tacTool !== 'roles') setTacTool('roles');
  setTacPlaceRole(tacPlaceRole === role ? null : role);
  setTacSelected(null);
  setTacSelectedItem(null);
  renderTacBoard();
}

function buildTacItems(role, activeBtn) {
  const def = TAC_ROLES[role];
  tacItemRole = role;

  document.querySelectorAll('.tac-item-section').forEach((s) => {
    if (s !== tacItemSection) s.remove();
  });
  const grid = activeBtn.parentElement;

  let cols = 4;
  const tracks = getComputedStyle(grid).gridTemplateColumns;
  if (tracks && tracks !== 'none') cols = tracks.split(' ').length || 4;
  activeBtn.after(tacItemSection);
  const lead = Array.from(grid.children).indexOf(tacItemSection) % cols;
  const firstRow = Math.max(1, cols - lead);

  const rows = [];
  for (let i = 0, n = firstRow; i < def.items.length; i += n, n = cols)
    rows.push(def.items.slice(i, i + n));

  const sections = [tacItemSection];
  for (let r = 1; r < rows.length; r++) {
    const s = tacItemSection.cloneNode(false);
    s.removeAttribute('id');
    const inner = document.createElement('div');
    inner.className = 'tac-items';
    s.appendChild(inner);
    sections.push(s);
  }
  rows.forEach((chunk, r) => {
    const sec = sections[r];
    sec.style.display = '';
    sec.style.setProperty('--tac-item-cols', Math.max(1, chunk.length));
    const box = sec.querySelector('.tac-items');
    box.innerHTML = '';
    chunk.forEach((kind) => {
      const it = TAC_ITEM_TYPES[kind];
      const btn = document.createElement('button');
      btn.className = 'tac-item';
      btn.dataset.kind = kind;
      btn.style.setProperty('--ic', it.color);
      btn.title = it.name;
      btn.innerHTML =
        `<span class="tac-item-dot"><img src="${it.icon}" alt="${it.name}" draggable="false"></span>${it.name}`;
      btn.addEventListener('click', () => onTacItemClick(role, kind));
      box.appendChild(btn);
    });
  });

  activeBtn.after(...sections);
}

function onTacItemClick(role, kind) {
  if (tacPlaceItem && tacPlaceItem.kind === kind) {
    setTacPlaceItem(null);
  } else {
    if (tacTool !== 'roles') setTacTool('roles');
    setTacPlaceItem({ role, kind });
    setTacPlaceRole(null);
    setTacSelected(null);
    setTacSelectedItem(null);
  }
  renderTacBoard();
}

export function setTacItemRole(value) {
  tacItemRole = value;
  return value;
}

export function initializeRolePicker() {
  buildTacRoles();

  // 阵营页签：点击切换显示对应阵营的角色按钮；
  // 切走时，被隐藏阵营里的选中/待放置角色与道具一并取消（沿用旧折叠语义）
  tacticView.querySelectorAll('#tacCampTabs .side-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      tacticView.querySelectorAll('#tacCampTabs .side-btn').forEach((b) =>
        b.classList.toggle('active', b === btn));
      const boxes = { survivor: tacRolesEl, hunter: tacRolesHunterEl, other: tacRolesOtherEl };
      Object.entries(boxes).forEach(([camp, box]) => {
        box.style.display = camp === btn.dataset.camp ? '' : 'none';
      });
      const hidden = (r) => r && (TAC_ROLES[r] || {}).camp && TAC_ROLES[r].camp !== btn.dataset.camp;
      let changed = false;
      if (hidden(tacSelRole()) || hidden(tacPlaceRole)) {
        setTacSelected(null);
        setTacPlaceRole(null);
        changed = true;
      }
      if (tacPlaceItem && hidden(tacPlaceItem.role)) { setTacPlaceItem(null); changed = true; }
      if (tacSelectedItem !== null) {
        const it = tacBoard().items[tacSelectedItem];
        if (it && hidden(it.role)) { setTacSelectedItem(null); changed = true; }
      }
      if (changed) renderTacBoard();
    });
  });
}

export {
  TAC_HP_KIND,
  TAC_HP_MAX_M,
  TAC_HP_MIN_M,
  TAC_RANGE_DEFAULT_FILL,
  buildTacItems,
  buildTacRoles,
  onTacItemClick,
  onTacRoleClick,
  tacAbyssFinalize,
  tacAbyssItem,
  tacAbyssMeters,
  tacAbyssRecord,
  tacAutoLinkItem,
  tacAutoLinkToken,
  tacBreakItemLink,
  tacBreakTokenLinks,
  tacClampLinkPos,
  tacClampRoleLinkPos,
  tacClampTokenToLinkedItems,
  tacCrossSvg,
  tacHostCamp,
  tacHpClampPos,
  tacHpCloseShape,
  tacHpComponent,
  tacHpComponentOpen,
  tacHpDissolve,
  tacHpEdges,
  tacHpJoin,
  tacHpPeers,
  tacItemByIid,
  tacItemMeters,
  tacItemMetersToPercent,
  tacItemRole,
  tacItemSizePercent,
  tacLinkPartner,
  tacLinkTokenOf,
  tacMirrorParts,
  tacOnItemRemoved,
  tacOnTokenRemoved,
  tacRangeDefaultKey,
  tacRangeEntries,
  tacRangeFmt,
  tacRangeMetersOf,
  tacRangeModeOf,
  tacRbEnsure,
  tacRingSvg,
  tacRoleRangeMeters,
  tacRoleRangeMode,
  tacSameLinkable,
  tacSelRole,
  tacSyncMirror,
  tacSyncMirrorEl,
  tacTalentButtons,
  tacTalentRanges,
  tacTokenByRole,
  tacTokenByTid,
  tacTokenLinkedItems,
};
