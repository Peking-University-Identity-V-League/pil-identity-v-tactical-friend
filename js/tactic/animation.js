import { animAllPositions, animDuration, animPositionAt, animSegments } from '../core/anim.js';
import {
  tacMapWrap,
  tacTimelineEl,
  tacTimelineFold,
  tacTimelinePlay,
  tacTimelineScrub,
  tacTimelineTime,
  tacTimelineTracks,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { simulateMovement } from '../core/measurements.js';
import { tacBoard, tacDrawSettings } from '../core/persist.js';
import { S } from '../core/state.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_MOVEMENT_BUFFS, TAC_MOVEMENT_SURVIVOR } from '../data/tactic-data.js';
import { renderTacBoard, tacLayer } from './board.js';
import {
  renderTacManage,
  setTacManageSel,
  tacBoxHint,
  tacInstDispName,
  tacManageBox,
  tacManageSel,
} from './manage.js';
import { tacRouteBetween } from './measure.js';
import { tacTool } from './panel.js';
import { tacTokenByTid } from './roles-items.js';
import { setTacSelected, setTacSelectedItem, tacUndoStack } from './selection.js';

// 动画路径点拖拽：{ ptIdx, prev }，prev 为拖动前的 anim 快照（供撤销）
let tacDragAnimDot = null;

// 播放中的动画：{ kind:'role'|'item', ref, raf }；只改 DOM 位置，不写回造物坐标
let tacAnimPlay = null;

// 动画工具下是否处于「添加路径点」状态：进入动画工具自动开启，可手动取消
let tacAnimArmed = false;

/* ================= 造物动画 =================
 * 动画数据存在造物 token/item 的 anim 字段（随棋盘自动存档）：
 *   { mode:'time'|'speed', points:[{x,y}], times:[...], speeds:[{name,speed}] }
 * 播放只改 DOM 位置，不写回造物坐标；停止/重置后回到真实位置。 */

function tacAnimGeom() {
  const md = MAPS_DATA[S.currentMapId];
  const [dw, dh] = md.mapSize;
  return { dw, dh, widthM: md.widthM };
}

function tacAnimTargetOf(sel) {
  if (!sel) return null;
  return sel.type === 'role' ? tacTokenByTid(sel.tid) : (tacBoard().items[sel.idx] || null);
}

function tacAnimEnsure(obj) {
  if (!obj.anim) obj.anim = { mode: 'time', points: [], times: [], speeds: [], paths: [] };
  const a = obj.anim;
  a.points ||= [];
  a.times ||= [];
  a.speeds ||= [];
  a.paths ||= [];
  return a;
}

// 造物的撤销引用：角色用 tid，道具用当前下标
function tacAnimPushUndo(obj, prev) {
  if (obj.tid != null) tacUndoStack.push({ type: 'anim', kind: 'role', tid: obj.tid, prev });
  else tacUndoStack.push({ type: 'anim', kind: 'item', idx: tacBoard().items.indexOf(obj), prev });
}

async function tacAnimRouteSegment(animObj, segIdx) {
  const anim = animObj && animObj.anim;
  if (!anim || segIdx < 0 || segIdx + 1 >= (anim.points || []).length) return;
  const from = { ...anim.points[segIdx] };
  const to = { ...anim.points[segIdx + 1] };
  const vault = !!tacDrawSettings.animVault; // 勾选「允许翻窗」后窗带视为可走
  const pts = await tacRouteBetween(from, to, vault);
  if (!pts) return;
  // 计算期间造物可能已被继续编辑：返回后校验该段端点未变，变了则丢弃，避免覆盖后续操作
  const cur = animObj.anim;
  if (!cur || segIdx + 1 >= (cur.points || []).length) return;
  const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-6;
  if (!near(cur.points[segIdx], from) || !near(cur.points[segIdx + 1], to)) return;
  cur.paths[segIdx] = pts;
  renderTacBoard();
}

// 移速预设：监管者取自身移速（多形态多档）；求生者取四姿态 + 角色专属移速（如玩具商滑翔）
function tacAnimSpeedPresets(obj) {
  const def = TAC_ROLES[obj.role];
  if (def && def.camp === 'hunter') {
    if (def.speed != null && typeof def.speed === 'object') {
      return Object.entries(def.speed).map(([name, v]) => ({ name, speed: v }));
    }
    if (def.speed > 0) return [{ name: def.name, speed: def.speed }];
    return [];
  }
  const out = Object.values(TAC_MOVEMENT_SURVIVOR.states)
    .map((s) => ({ name: s.name, speed: s.speed }));
  if (def && Array.isArray(def.speeds)) {
    def.speeds.forEach((s) => out.push({ name: s.name, speed: s.speed }));
  }
  return out;
}

// 新路径点的默认移速：预设第一项（监管者=自身移速，求生者=跑速）
function tacAnimDefaultSpeed(obj) {
  const first = tacAnimSpeedPresets(obj)[0];
  if (first) return { ...first };
  return { name: TAC_MOVEMENT_SURVIVOR.states.run.name, speed: TAC_MOVEMENT_SURVIVOR.states.run.speed };
}

// 段时长函数：段上有加成 buff 时，用与测算卡片同款的 simulateMovement 计算实际时长
function tacAnimSegDurFn(obj) {
  const speeds = (obj.anim && obj.anim.speeds) || [];
  if (!speeds.some((s) => s && s.buffs && s.buffs.length)) return null;
  return (i, lenM, v) => {
    const buffs = speeds[i] && speeds[i].buffs;
    if (!buffs || !buffs.length || !(v > 0)) return v > 0 ? lenM / v : 0;
    return simulateMovement([lenM], {
      bases: [{ from: 0, to: 1, speed: v }],
      buffs: buffs.map((b) => ({ ...b, from: 0, to: 1 })),
    }).total;
  };
}

// 该造物当前段可用的加成列表：按阵营/角色/姿态/形态过滤（与测算卡片同规则）
function tacAnimBuffOptions(obj, seg) {
  const def = TAC_ROLES[obj.role] || {};
  const camp = def.camp === 'hunter' ? 'hunter' : 'survivor';
  // 段基础速度对应的姿态（仅求生者有姿态概念）与监管者形态序号
  const stKey = camp === 'survivor'
    ? Object.keys(TAC_MOVEMENT_SURVIVOR.states)
      .find((k) => Math.abs(TAC_MOVEMENT_SURVIVOR.states[k].speed - seg.speed) < 1e-9) || null
    : null;
  let formIdx = 0;
  if (def.speed != null && typeof def.speed === 'object') {
    const fi = Object.values(def.speed).findIndex((v) => Math.abs(v - seg.speed) < 1e-9);
    if (fi >= 0) formIdx = fi;
  }
  const stateOk = (states) => !states || (stKey && states.includes(stKey));
  const out = [];
  (TAC_MOVEMENT_BUFFS.trait[camp] || []).forEach((t) => {
    if (t.role && t.role !== def.name) return;
    if (t.forms && t.forms.length && !t.forms.includes(formIdx)) return;
    if (!stateOk(t.states)) return;
    out.push({ type: 'trait', key: t.key, def: t });
  });
  Object.entries(TAC_MOVEMENT_BUFFS.talent).forEach(([k, b]) => {
    if (b.camp && b.camp !== camp) return;
    if (!stateOk(b.states)) return;
    out.push({ type: 'talent', key: k, def: b });
  });
  (TAC_MOVEMENT_BUFFS.other[camp] || []).forEach((t) => {
    if (!stateOk(t.states)) return;
    out.push({ type: 'other', key: t.key, def: t });
  });
  return out;
}

// 模式互转：位置保留，派生值互算（时刻<->移速）
function tacAnimConvertMode(anim, geom, toMode, segDurFn) {
  if (anim.mode === toMode) return;
  const segs = animSegments(anim, geom, segDurFn);
  if (toMode === 'speed') {
    // 全精度存储（仅显示时取两位小数），保证时刻<->移速往返切换不漂移
    anim.speeds = segs.map((s, i) => ({
      name: translate("common.custom"),
      speed: s.avgSpeed || TAC_MOVEMENT_SURVIVOR.states.run.speed,
      buffs: (anim.speeds[i] || {}).buffs,
    }));
  } else {
    anim.times = segs.length ? [segs[0].t0, ...segs.map((s) => s.t1)] : [];
    while (anim.times.length < anim.points.length) {
      anim.times.push((anim.times[anim.times.length - 1] ?? 0) + 3);
    }
  }
  anim.mode = toMode;
}

// 移动造物的所有相关 DOM（角色含范围圈，道具含圆/钉两层）
function tacAnimSetElPos(kind, ref, x, y) {
  const sel = kind === 'role'
    ? `.tac-token[data-tid="${ref}"], .tac-role-circle[data-tid="${ref}"]`
    : `.tac-item-circle[data-idx="${ref}"], .tac-item-pin[data-idx="${ref}"]`;
  tacMapWrap.querySelectorAll(sel).forEach((el) => {
    el.style.left = `${x * 100}%`;
    el.style.top = `${y * 100}%`;
  });
}

// 停止播放；restore=true 时把 DOM 位置还原到造物真实坐标
function tacAnimStop(restore) {
  if (!tacAnimPlay) return;
  cancelAnimationFrame(tacAnimPlay.raf);
  const { kind, ref } = tacAnimPlay;
  tacAnimPlay = null;
  if (restore) {
    const obj = kind === 'role' ? tacTokenByTid(ref) : tacBoard().items[ref];
    if (obj) tacAnimSetElPos(kind, ref, obj.x, obj.y);
  }
  renderTacManage(); // 播放/停止合并按钮的文字随播放状态刷新
}

// 重置按钮：无论是否播完，都把选中造物的 DOM 位置还原到真实坐标
function tacAnimReset() {
  const sel = tacManageSel;
  tacAnimStop(true);
  const obj = tacAnimTargetOf(sel);
  if (obj) tacAnimSetElPos(sel.type, sel.type === 'role' ? sel.tid : sel.idx, obj.x, obj.y);
}

/* ---- 全局时间轴：所有动画造物在统一时钟 T 下协同定位（只改 DOM，不存档） ---- */
const tacTimeline = { t: 0, playing: false, raf: 0 };

// 当前地图上所有带有效动画的造物
function tacTimelineEntries() {
  const out = [];
  tacBoard().tokens.forEach((tk) => {
    if (tk.anim && (tk.anim.points || []).length >= 2) {
      out.push({ kind: 'role', ref: tk.tid, obj: tk, name: tacInstDispName(tk) });
    }
  });
  tacBoard().items.forEach((it, idx) => {
    if (it.anim && (it.anim.points || []).length >= 2) {
      out.push({ kind: 'item', ref: idx, obj: it, name: tacInstDispName(it) });
    }
  });
  return out;
}

// 全局总时长 = 各动画结束时刻的最大值
function tacTimelineTotal(entries) {
  const geom = tacAnimGeom();
  let total = 0;
  (entries || tacTimelineEntries()).forEach((e) => {
    const { end } = animDuration(e.obj.anim, geom, tacAnimSegDurFn(e.obj));
    if (end > total) total = end;
  });
  return total;
}

// 把所有动画造物定位到时刻 t
function tacTimelineApply(t) {
  const geom = tacAnimGeom();
  const entries = tacTimelineEntries();
  const positions = animAllPositions(entries.map((e) => (
    { anim: e.obj.anim, segDurFn: tacAnimSegDurFn(e.obj) })), geom, t);
  positions.forEach((pos, i) => {
    if (pos) tacAnimSetElPos(entries[i].kind, entries[i].ref, pos.x, pos.y);
  });
}

function tacTimelineSyncUI(total) {
  tacTimelineScrub.max = total;
  tacTimelineScrub.value = Math.min(tacTimeline.t, total);
  tacTimelineTime.textContent = `${tacTimeline.t.toFixed(1)}s / ${total.toFixed(1)}s`;
  tacTimelinePlay.textContent = tacTimeline.playing ? '⏸' : '▶';
  tacTimelinePlay.disabled = total <= 0;
}

// 重绘轨道与时间显示（renderTacBoard 调用）
function renderTacTimeline() {
  const entries = tacTimelineEntries();
  const total = tacTimelineTotal(entries);
  if (tacTimeline.t > total) tacTimeline.t = total;
  const geom = tacAnimGeom();
  tacTimelineTracks.innerHTML = '';
  entries.forEach((e) => {
    const row = document.createElement('div');
    row.className = 'tac-timeline-track';
    const label = document.createElement('span');
    label.className = 'tac-timeline-track-name';
    label.textContent = e.name;
    row.appendChild(label);
    const lane = document.createElement('div');
    lane.className = 'tac-timeline-lane';
    if (total > 0) {
      animSegments(e.obj.anim, geom, tacAnimSegDurFn(e.obj)).forEach((s) => {
        if (s.dur <= 0) return;
        const bar = document.createElement('div');
        bar.className = 'tac-timeline-bar';
        bar.style.left = `${(s.t0 / total) * 100}%`;
        bar.style.width = `${(s.dur / total) * 100}%`;
        lane.appendChild(bar);
      });
    }
    row.appendChild(lane);
    row.title = e.name;
    row.addEventListener('click', () => {
      setTacManageSel(e.kind === 'role' ? { type: 'role', tid: e.ref } : { type: 'item', idx: e.ref });
      if (e.kind === 'role') { setTacSelected(e.ref); setTacSelectedItem(null); }
      else { setTacSelectedItem(e.ref); setTacSelected(null); }
      renderTacBoard();
    });
    tacTimelineTracks.appendChild(row);
  });
  tacTimelineSyncUI(total);
}

// 停止全局播放；restore=true 时所有造物还原到真实坐标
function tacTimelineStop(restore) {
  if (tacTimeline.raf) cancelAnimationFrame(tacTimeline.raf);
  tacTimeline.raf = 0;
  const wasPlaying = tacTimeline.playing;
  tacTimeline.playing = false;
  if (restore) {
    tacTimelineEntries().forEach((e) => tacAnimSetElPos(e.kind, e.ref, e.obj.x, e.obj.y));
  }
  if (wasPlaying || restore) renderTacTimeline();
}

function tacTimelineToggle() {
  if (tacTimeline.playing) { tacTimelineStop(false); return; }
  const total = tacTimelineTotal();
  if (total <= 0) return;
  tacAnimStop(false); // 与单个造物的播放互斥
  if (tacTimeline.t >= total) tacTimeline.t = 0;
  const t0 = performance.now();
  const base = tacTimeline.t;
  tacTimeline.playing = true;
  const step = (now) => {
    if (!tacTimeline.playing) return;
    tacTimeline.t = base + (now - t0) / 1000;
    if (tacTimeline.t >= total) {
      tacTimeline.t = total;
      tacTimelineApply(total);
      tacTimeline.playing = false;
      tacTimeline.raf = 0;
      renderTacTimeline();
      return;
    }
    tacTimelineApply(tacTimeline.t);
    tacTimelineSyncUI(total);
    tacTimeline.raf = requestAnimationFrame(step);
  };
  tacTimeline.raf = requestAnimationFrame(step);
  tacTimelineSyncUI(total);
}

function tacAnimPlayStart() {
  const obj = tacAnimTargetOf(tacManageSel);
  if (!obj || !obj.anim || (obj.anim.points || []).length < 2) return;
  tacAnimStop(true);
  tacTimelineStop(true); // 与全局播放互斥
  const geom = tacAnimGeom();
  const fn = tacAnimSegDurFn(obj);
  const { start, end } = animDuration(obj.anim, geom, fn);
  if (end <= start) return;
  const kind = tacManageSel.type;
  const ref = kind === 'role' ? tacManageSel.tid : tacManageSel.idx;
  const t0 = performance.now();
  const step = (now) => {
    if (!tacAnimPlay) return;
    const t = start + (now - t0) / 1000;
    const pos = animPositionAt(obj.anim, geom, t, fn);
    if (!pos) { tacAnimStop(true); return; }
    tacAnimSetElPos(kind, ref, pos.x, pos.y);
    if (pos.done) { tacAnimStop(false); return; }
    tacAnimPlay.raf = requestAnimationFrame(step);
  };
  tacAnimPlay = { kind, ref, raf: requestAnimationFrame(step) };
}

// 地图上的编号路径点（renderTacBoard 调用；可用「隐藏时刻点」关闭）
function renderTacAnimDots() {
  if (tacDrawSettings.hideAnimDots) return;
  const obj = tacAnimTargetOf(tacManageSel);
  if (!obj || !obj.anim) return;
  (obj.anim.points || []).forEach((pt, i) => {
    const dot = document.createElement('div');
    dot.className = 'tac-anim-dot';
    dot.dataset.pt = i;
    dot.style.left = `${pt.x * 100}%`;
    dot.style.top = `${pt.y * 100}%`;
    dot.textContent = i + 1;
    tacLayer().appendChild(dot);
  });
}

// 管理卡片动画区：模式切换 + 路径点行 + 播放控制
function buildTacAnimBox(settings, obj) {
  const geom = tacAnimGeom();
  const box = tacManageBox(settings, "ui.tac.anim.title");
  const hasAnim = obj.anim && Array.isArray(obj.anim.points) && obj.anim.points.length;
  // 添加路径点：状态按钮 + 状态文字（仅动画工具可加点；进入工具默认开启，可取消）
  if (tacTool === 'anim') {
    const armRow = document.createElement('div');
    armRow.className = 'tac-box-line';
    const armBtn = document.createElement('button');
    armBtn.type = 'button';
    armBtn.className = 'tac-anim-btn tac-anim-arm-btn' + (tacAnimArmed ? ' active' : '');
    armBtn.textContent = translate(tacAnimArmed ? "ui.tac.anim.disarm" : "ui.tac.anim.addPoints");
    armBtn.addEventListener('click', () => {
      tacAnimArmed = !tacAnimArmed;
      renderTacBoard();
    });
    armRow.appendChild(armBtn);
    const status = document.createElement('span');
    status.className = 'tac-anim-derive tac-anim-status';
    status.textContent = tacAnimArmed
      ? translate("ui.tac.anim.hint.empty")
      : (hasAnim ? '' : translate("ui.tac.anim.hint.none"));
    armRow.appendChild(status);
    box.appendChild(armRow);
  } else if (!hasAnim) {
    tacBoxHint(box, translate("ui.tac.anim.hint.none"));
    return;
  }
  // 清除动画后仍保留常规显示（隐藏开关/自动规划/播放控制等），anim 为空时按 0 时长渲染
  const anim = hasAnim ? tacAnimEnsure(obj) : null;
  const rerun = () => renderTacBoard();

  // 显示开关：隐藏动画线 / 隐藏时刻点（绘制设置持久化）
  const hideRow = document.createElement('div');
  hideRow.className = 'tac-box-line';
  hideRow.innerHTML =
    `<label class="tac-display-toggle"><input type="checkbox" data-h="path"`
    + `${tacDrawSettings.hideAnimPath ? ' checked' : ''}><span>${translate("ui.tac.anim.hide.path")}</span></label>`
    + `<label class="tac-display-toggle"><input type="checkbox" data-h="dots"`
    + `${tacDrawSettings.hideAnimDots ? ' checked' : ''}><span>${translate("ui.tac.anim.hide.dots")}</span></label>`;
  hideRow.querySelectorAll('input').forEach((cb) => cb.addEventListener('change', () => {
    if (cb.dataset.h === 'path') tacDrawSettings.hideAnimPath = cb.checked;
    else tacDrawSettings.hideAnimDots = cb.checked;
    rerun();
  }));
  box.appendChild(hideRow);

  // 自动规划最优路线：勾选后新增路径点时自动与上一点连成最优路径（复用两点最优路径规划）
  const routeRow = document.createElement('div');
  routeRow.className = 'tac-box-line';
  routeRow.innerHTML =
    `<label class="tac-display-toggle" title="${translate("ui.tac.anim.autoRoute.message")}"><input type="checkbox" data-ar="1"`
    + `${tacDrawSettings.animAutoRoute ? ' checked' : ''}><span>${translate("ui.tac.anim.autoRoute")}</span></label>`
    + `<label class="tac-display-toggle" title="${translate("ui.tac.path.result.note")}"><input type="checkbox" data-vault="1"`
    + `${tacDrawSettings.animVault ? ' checked' : ''}><span>${translate("ui.tac.path.setting.vaultAllow")}</span></label>`;
  routeRow.querySelectorAll('input').forEach((cb) => cb.addEventListener('change', () => {
    if (cb.dataset.ar) tacDrawSettings.animAutoRoute = cb.checked;
    else tacDrawSettings.animVault = cb.checked;
    rerun();
  }));
  box.appendChild(routeRow);

  // 模式切换：时刻 | 移速
  const modeRow = document.createElement('div');
  modeRow.className = 'tac-box-line tac-anim-mode';
  ['time', 'speed'].forEach((m) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tac-anim-btn' + (anim && anim.mode === m ? ' active' : '');
    b.disabled = !anim;
    b.textContent = translate(m === 'time' ? "ui.tac.anim.mode.time" : "ui.tac.anim.mode.speed");
    b.addEventListener('click', () => {
      if (!anim || anim.mode === m) return;
      const prev = structuredClone(obj.anim);
      tacAnimConvertMode(anim, geom, m, tacAnimSegDurFn(obj));
      tacAnimPushUndo(obj, prev);
      rerun();
    });
    modeRow.appendChild(b);
  });
  box.appendChild(modeRow);

  const segDurFn = anim ? tacAnimSegDurFn(obj) : null;
  const segs = anim ? animSegments(anim, geom, segDurFn) : [];
  const round2 = (v) => Math.round(v * 100) / 100;

  // 路径点行
  if (anim) anim.points.forEach((pt, i) => {
    let afterRow = null;
    const row = document.createElement('div');
    row.className = 'tac-box-line tac-anim-pt';
    const label = document.createElement('span');
    label.className = 'tac-anim-pt-label';
    label.textContent = translate("ui.tac.anim.point", { index: i + 1 });
    row.appendChild(label);

    if (anim.mode === 'time') {
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'tac-anim-num';
      input.min = 0;
      input.step = 0.5;
      input.value = round2(anim.times[i] ?? 0); // 显示两位小数，存储保持全精度
      input.addEventListener('change', () => {
        const prev = structuredClone(obj.anim);
        anim.times[i] = Math.max(0, parseFloat(input.value) || 0);
        tacAnimPushUndo(obj, prev);
        rerun();
      });
      row.appendChild(input);
      const unitS = document.createElement('span');
      unitS.className = 'tac-anim-derive';
      unitS.textContent = 's';
      row.appendChild(unitS);
      if (i > 0) {
        const dv = document.createElement('span');
        dv.className = 'tac-anim-derive';
        const avg = segs[i - 1] && segs[i - 1].avgSpeed;
        dv.textContent = avg != null
          ? translate("ui.tac.anim.avgSpeed", { speed: round2(avg) })
          : '∞';
        row.appendChild(dv);
      }
    } else if (i > 0) {
      // 移速模式：段 i-1 的预设下拉 + 自定义数值（预设按角色过滤）
      const seg = anim.speeds[i - 1] || tacAnimDefaultSpeed(obj);
      anim.speeds[i - 1] = seg;
      const sel = document.createElement('select');
      sel.className = 'tac-anim-speed-sel';
      const groups = tacAnimSpeedPresets(obj);
      const matched = groups.find((g) => Math.abs(g.speed - seg.speed) < 1e-9);
      sel.innerHTML = groups.map((g) =>
        `<option value="${g.speed}">${g.name} ${g.speed}m/s</option>`).join('')
        + `<option value="custom">${translate("common.custom")}</option>`;
      sel.value = matched ? String(matched.speed) : 'custom';
      sel.addEventListener('change', () => {
        if (sel.value === 'custom') return;
        const g = groups.find((gg) => String(gg.speed) === sel.value);
        if (!g) return;
        const prev = structuredClone(obj.anim);
        anim.speeds[i - 1] = { name: g.name, speed: g.speed, buffs: seg.buffs };
        tacAnimPushUndo(obj, prev);
        rerun();
      });
      row.appendChild(sel);
      const num = document.createElement('input');
      num.type = 'number';
      num.className = 'tac-anim-num';
      num.min = 0.1;
      num.step = 0.1;
      num.value = round2(seg.speed); // 显示两位小数，存储保持全精度
      num.addEventListener('change', () => {
        const v = parseFloat(num.value);
        if (!(v > 0)) return;
        const prev = structuredClone(obj.anim);
        const g = groups.find((gg) => Math.abs(gg.speed - v) < 1e-9);
        anim.speeds[i - 1] = { name: g ? g.name : translate("common.custom"), speed: v, buffs: seg.buffs };
        tacAnimPushUndo(obj, prev);
        rerun();
      });
      row.appendChild(num);
      const unitV = document.createElement('span');
      unitV.className = 'tac-anim-derive';
      unitV.textContent = 'm/s';
      row.appendChild(unitV);
      const dv = document.createElement('span');
      dv.className = 'tac-anim-derive';
      dv.textContent = segs[i - 1] ? `${round2(segs[i - 1].t1)}s` : '';
      row.appendChild(dv);

      // 加成 buff：chips 列表 + 按角色/姿态过滤的添加器（时长计算与测算卡片同款）
      const buffLine = document.createElement('div');
      buffLine.className = 'tac-box-line tac-anim-buffs';
      (seg.buffs || []).forEach((buff, bi) => {
        const chip = document.createElement('span');
        chip.className = 'tac-anim-chip';
        chip.textContent = buff.name;
        chip.title = `${Math.round(((buff.mult ?? 1) - 1) * 100)}%`
          + (buff.duration ? ` ${buff.duration}s` : '');
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'tac-anim-chip-x';
        x.textContent = '✕';
        x.addEventListener('click', () => {
          const prev = structuredClone(obj.anim);
          seg.buffs.splice(bi, 1);
          tacAnimPushUndo(obj, prev);
          rerun();
        });
        chip.appendChild(x);
        buffLine.appendChild(chip);
      });
      const opts = tacAnimBuffOptions(obj, seg);
      if (opts.length) {
        const bsel = document.createElement('select');
        bsel.className = 'tac-anim-buff-sel';
        const groupDefs = [
          ['trait', translate("application.velocity.buff.trait")],
          ['talent', translate("application.velocity.buff.talent")],
          ['other', translate("application.velocity.buff.other")],
        ];
        bsel.innerHTML = groupDefs.map(([type, label]) => {
          const list = opts.map((o, oi) => ({ ...o, oi })).filter((o) => o.type === type);
          if (!list.length) return '';
          return `<optgroup label="${label}">`
            + list.map((o) => `<option value="${o.oi}">${o.def.name}</option>`).join('')
            + '</optgroup>';
        }).join('');
        buffLine.appendChild(bsel);
        const lvSel = document.createElement('select');
        lvSel.className = 'tac-anim-buff-sel';
        const syncLv = () => {
          const o = opts[+bsel.value];
          lvSel.style.display = o && o.def.levels ? '' : 'none';
          if (o && o.def.levels) {
            lvSel.innerHTML = o.def.levels.map((_, li) =>
              `<option value="${li}"${li === o.def.levels.length - 1 ? ' selected' : ''}>`
              + `${translate("application.buff.common.level", { value: li + 1 })}</option>`).join('');
          }
        };
        bsel.addEventListener('change', syncLv);
        syncLv();
        buffLine.appendChild(lvSel);
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'tac-anim-btn tac-anim-buff-add';
        addBtn.textContent = translate("common.add");
        addBtn.addEventListener('click', () => {
          const o = opts[+bsel.value];
          if (!o) return;
          const def = o.def;
          const lv = def.levels ? +lvSel.value : null;
          const lvName = def.levels
            ? ` ${translate("application.buff.common.level", { value: lv + 1 })}` : '';
          const entry = { type: o.type, key: o.key, name: def.name + lvName,
            mult: def.levels ? def.levels[lv] : def.mult, duration: def.duration || 0 };
          if (def.postMult) entry.postMult = true;
          const prev = structuredClone(obj.anim);
          seg.buffs ||= [];
          seg.buffs.push(entry);
          if (def.extra) {
            const ex = { type: o.type, key: o.key, name: def.extra.name,
              mult: def.extra.mult, duration: def.extra.duration || 0 };
            if (def.extra.postMult) ex.postMult = true;
            seg.buffs.push(ex);
          }
          tacAnimPushUndo(obj, prev);
          rerun();
        });
        buffLine.appendChild(addBtn);
      }
      afterRow = buffLine;
    }

    // 删除路径点（首点删除后路径整体前移）
    if (anim.points.length > 1) {
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tac-manage-del';
      del.textContent = translate("common.delete");
      del.addEventListener('click', () => {
        const prev = structuredClone(obj.anim);
        anim.points.splice(i, 1);
        anim.times.splice(i, 1);
        if (anim.points.length) anim.speeds.splice(i === 0 ? 0 : i - 1, 1);
        // 段索引整体前移：与被删点相连的两段合并成新跨段（旧路径作废，回退直线），其余段平移
        if (anim.paths && anim.paths.length) {
          const old = anim.paths;
          const np = [];
          for (let k = 0; k < old.length - 1; k++) {
            if (k < i - 1) np[k] = old[k];
            else if (k === i - 1) np[k] = undefined;
            else np[k] = old[k + 1];
          }
          anim.paths = np;
        }
        tacAnimPushUndo(obj, prev);
        rerun();
      });
      row.appendChild(del);
    }
    box.appendChild(row);
    if (afterRow) box.appendChild(afterRow);
  });

  // 播放控制行：▶ 播放 / 重置 / 清除动画 + 总时长
  const ctl = document.createElement('div');
  ctl.className = 'tac-box-line tac-anim-ctl';
  // 播放/停止合并为一个按钮：未播放时「▶ 播放」，播放中变「停止」，再点停止并重置
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'tac-anim-btn tac-anim-play-btn';
  playBtn.textContent = translate(tacAnimPlay ? "ui.tac.anim.stop" : "ui.tac.anim.play");
  playBtn.disabled = !anim || anim.points.length < 2 || animDuration(anim, geom, segDurFn).total <= 0;
  playBtn.addEventListener('click', () => {
    if (tacAnimPlay) tacAnimReset();
    else {
      tacAnimPlayStart();
      if (tacAnimPlay) renderTacManage(); // 播放开始，按钮文字切为「停止」
    }
  });
  ctl.appendChild(playBtn);
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'tac-anim-btn';
  clearBtn.textContent = translate("ui.tac.anim.clear");
  clearBtn.addEventListener('click', () => {
    tacAnimStop(true);
    const prev = structuredClone(obj.anim);
    delete obj.anim;
    tacAnimPushUndo(obj, prev);
    rerun();
  });
  ctl.appendChild(clearBtn);
  const total = document.createElement('span');
  total.className = 'tac-anim-derive';
  total.textContent = translate("ui.tac.anim.totalTime",
    { seconds: anim ? round2(animDuration(anim, geom, segDurFn).total) : 0 });
  ctl.appendChild(total);
  box.appendChild(ctl);
}

export function setTacAnimArmed(value) {
  tacAnimArmed = value;
  return value;
}

export function setTacDragAnimDot(value) {
  tacDragAnimDot = value;
  return value;
}

export function bindTimeline() {
  tacTimelinePlay.addEventListener('click', tacTimelineToggle);

  if (tacTimelineFold) {
    tacTimelineFold.addEventListener('click', () => {
      const collapsed = tacTimelineEl.classList.toggle('collapsed');
      tacTimelineFold.textContent = collapsed ? '▴' : '▾';
      tacTimelineFold.title = translate(collapsed
        ? 'ui.tac.anim.timeline.unfold' : 'ui.tac.anim.timeline.fold');
    });
  }

  tacTimelineScrub.addEventListener('input', () => {
    tacTimelineStop(false);
    tacTimeline.t = parseFloat(tacTimelineScrub.value) || 0;
    tacTimelineApply(tacTimeline.t);
    tacTimelineSyncUI(tacTimelineTotal());
  });
}

export {
  buildTacAnimBox,
  renderTacAnimDots,
  renderTacTimeline,
  tacAnimArmed,
  tacAnimDefaultSpeed,
  tacAnimEnsure,
  tacAnimGeom,
  tacAnimPlay,
  tacAnimPlayStart,
  tacAnimPushUndo,
  tacAnimReset,
  tacAnimRouteSegment,
  tacAnimStop,
  tacAnimTargetOf,
  tacDragAnimDot,
  tacTimeline,
  tacTimelineStop,
};
