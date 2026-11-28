import { tacManageList, tacMapWrap } from '../core/dom.js';
import { translate, translateEn } from '../core/i18n.js';
import { tacBoard, tacSave } from '../core/persist.js';
import { S } from '../core/state.js';
import { TAC_ITEM_TYPES } from '../data/items.js';
import { MAPS_DATA } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_ABYSS_MAX_M, TAC_MANAGE_DEFAULT } from '../data/tactic-data.js';
import { buildTacAnimBox, setTacAnimArmed, tacAnimArmed } from './animation.js';
import {
  renderTacArrows,
  renderTacBoard,
  renderTacFixedSpawns,
  renderTacTreasure,
  setTacFontSize,
} from './board.js';
import { tacTool } from './panel.js';
import {
  TAC_HP_KIND,
  TAC_HP_MAX_M,
  TAC_HP_MIN_M,
  tacAutoLinkItem,
  tacAutoLinkToken,
  tacBreakItemLink,
  tacBreakTokenLinks,
  tacHostCamp,
  tacHpCloseShape,
  tacHpComponent,
  tacHpComponentOpen,
  tacHpDissolve,
  tacHpJoin,
  tacHpPeers,
  tacItemByIid,
  tacItemMetersToPercent,
  tacItemSizePercent,
  tacLinkPartner,
  tacLinkTokenOf,
  tacMirrorParts,
  tacOnItemRemoved,
  tacOnTokenRemoved,
  tacRangeEntries,
  tacRangeFmt,
  tacRbEnsure,
  tacRoleRangeMeters,
  tacSameLinkable,
  tacSyncMirror,
  tacTalentButtons,
  tacTalentRanges,
  tacTokenByTid,
  tacTokenLinkedItems,
} from './roles-items.js';
import {
  setTacSelected,
  setTacSelectedItem,
  tacSelected,
  tacSelectedItem,
  tacUndoStack,
} from './selection.js';

let tacManageSel = null;

function buildTacRangeRows(settings, cfg, inst, hideByDefault, opts) {
  opts = opts || {};
  const prefix = opts.labelPrefix || '';
  // 拉丁字母后缀（英文 Range、越南语 Phạm Vi）与范围名之间补空格；中文“范围”直接拼接
  const postfixRaw = opts.labelPostfix || '';
  const postfix = postfixRaw && /^[A-Za-zÀ-ÿ]/.test(postfixRaw) ? ` ${postfixRaw}` : postfixRaw;
  const defFill = !!opts.defFill;
  const hostRole = opts.hostRole;
  const hostCamp = tacHostCamp(hostRole);
  const groupKind = opts.groupKind
    || (cfg && cfg.key === 'showItem' ? 'item'
      : (cfg && cfg.key === 'showTrait' ? 'trait' : 'plain'));
  cfg = cfg || { key: groupKind === 'item' ? 'showItem'
    : groupKind === 'trait' ? 'showTrait' : 'show', options: [] };
  inst = inst || {};
  const rb = tacRbEnsure(cfg, inst, hideByDefault, defFill);

  const refresh = () => { renderTacBoard(); renderTacManage(); };

  const box = tacManageBox(settings, "ui.tac.manangeBox.range.title");

  const modeLine = document.createElement('div');
  const lv1Defs = [{ mk: 'range', label: cfg.key === 'showItem' ? translate("ui.tac.manangeBox.range.showItem")
    : cfg.key === 'showTrait' ? translate("ui.tac.manangeBox.range.showTrait")
    : translate("ui.tac.manangeBox.range.showPlain") }];
  if (groupKind === 'trait') {
    lv1Defs.push({ mk: 'talents', label: translate("ui.tac.manangeBox.range.showTalents") });
  }
  lv1Defs.push({ mk: 'hide', label: translate("ui.tac.manangeBox.range.hidePlain") });
  modeLine.className = 'tac-box-line';
  modeLine.innerHTML = `<div class="tac-range-opts">` + lv1Defs.map((d) =>
    `<button type="button" data-mk="${d.mk}" class="tac-range-opt`
    + `${rb.tab === d.mk ? ' active' : ''}">${d.label}</button>`).join('') + `</div>`;
  modeLine.querySelectorAll('.tac-range-opt').forEach((b) => {
    b.addEventListener('click', () => {
      const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
      const mk = b.dataset.mk;
      if (mk === 'hide') {
        rbx.tab = null;
        rbx.subs = [];
        rbx.talents = {};
      } else if (rbx.tab !== mk) {
        // 一级按钮仅切换分组：显示对应二级按钮，但不点亮（点亮由用户亲手操作）
        rbx.tab = mk;
      }
      refresh();
    });
  });
  box.appendChild(modeLine);


  function subBtn(active, attrs, label) {
    return `<button type="button" ${attrs} class="tac-range-opt tac-range-sub`
      + `${active ? ' active' : ''}">${label}</button>`;
  }

  if (rb.tab === 'talents') {
    const tLine = document.createElement('div');
    tLine.className = 'tac-box-line';
    tLine.innerHTML = `<div class="tac-range-opts">`
      + tacTalentButtons(hostRole, hostCamp).map((tb) =>
        subBtn(!!(rb.talents && rb.talents[tb.tk]), `data-tk="${tb.tk}"`, tb.label)).join('')
      + `</div>`;
    tLine.querySelectorAll('.tac-range-sub').forEach((b) => {
      b.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        if (rbx.talents[b.dataset.tk]) delete rbx.talents[b.dataset.tk];
        else rbx.talents[b.dataset.tk] = {};
        rbx.talentCur = b.dataset.tk;
        refresh();
      });
    });
      box.appendChild(tLine);
    // 三级按钮：只显示最近点亮的那个天赋的形态/档位
    tacTalentButtons(hostRole, hostCamp).forEach((tb) => {
      const sel = rb.talents[tb.tk];
      if (!sel || tb.tk !== rb.talentCur) return;
      const gLine = document.createElement('div');
      gLine.className = 'tac-box-line';
      if (tb.variants) {
        const cur = sel.variant || tb.variants[0].key;
        gLine.innerHTML = `<div class="tac-range-opts">`
          + tb.variants.map((v) =>
            subBtn(cur === v.key, `data-tv="${v.key}" data-tk="${tb.tk}"`, v.label)).join('')
          + `</div>`;
      } else if (tb.opt && Array.isArray(tb.opt.size_m)) {
        const vals = tb.opt.size_m;
        const cur = Number.isInteger(sel.gear) ? sel.gear : 0;
        gLine.innerHTML = `<div class="tac-range-opts">`
          + vals.map((v, gi) =>
            subBtn(cur === gi, `data-tg="${gi}" data-tk="${tb.tk}"`, `${v}m`)).join('')
          + `</div>`;
      } else {
        return;
      }
      gLine.querySelectorAll('.tac-range-sub').forEach((b2) => {
        b2.addEventListener('click', () => {
          const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
          const sel2 = rbx.talents[tb.tk];
          if (!sel2) return;
          if (b2.dataset.tv) sel2.variant = b2.dataset.tv;
          else sel2.gear = +b2.dataset.tg;
          refresh();
        });
      });
      box.appendChild(gLine);
    });
  } else if (rb.tab === 'range') {
    // 二级按钮统一：点已选中的取消，未选中的追加点亮（多个范围可同时显示）
    const lightSub = (rbx, i) => {
      rbx.subs = rbx.subs.includes(i)
        ? rbx.subs.filter((v) => v !== i)
        : [...rbx.subs, i];
    };
    // 全部二级按钮优先同一行（空间不足才换行）；点亮的选项在下方显示对应控制
    const subLine = document.createElement('div');
    subLine.className = 'tac-box-line';
    subLine.innerHTML = `<div class="tac-range-opts">`
      + cfg.options.map((opt, i) =>
        subBtn(rb.subs.includes(i), `data-v="${i}"`,
          opt.label ? opt.label + postfix : `${opt.size_m}m`)).join('')
      + `</div>`;
    subLine.querySelectorAll('.tac-range-sub').forEach((b) => {
      b.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        lightSub(rbx, +b.dataset.v);
        refresh();
      });
    });
    box.appendChild(subLine);
    // 点亮的选项：档位数组项出现互斥挡位组，滑杆项出现范围调节
    cfg.options.forEach((opt, i) => {
      if (!rb.subs.includes(i)) return;
      if (Array.isArray(opt.size_m)) {
        // 档位数组项（如牢笼 [9,12,15]）
        const vals = opt.size_m;
        const cur = Number.isInteger(rb.gear) ? rb.gear : 0;
        const gLine = document.createElement('div');
        gLine.className = 'tac-box-line';
        gLine.innerHTML = `<div class="tac-range-opts">`
          + vals.map((v, gi) =>
            subBtn(cur === gi, `data-g="${gi}"`, `${v}m`)).join('')
          + `</div>`;
        gLine.querySelectorAll('.tac-range-sub').forEach((b) => {
          b.addEventListener('click', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx.gear = +b.dataset.g;
            refresh();
          });
        });
        box.appendChild(gLine);
      } else if (opt.size_m && typeof opt.size_m === 'object') {
        // 滑杆项（{min,max}）
        const sm = opt.size_m;
        const sMin = sm.min != null ? sm.min : 0;
        const dynMax = sm.max != null ? sm.max
          : (MAPS_DATA[S.currentMapId] && MAPS_DATA[S.currentMapId].widthM) || 100;
        const cur = rb.m != null ? rb.m : dynMax;
        const slLine = document.createElement('div');
        slLine.className = 'tac-box-line';
        slLine.innerHTML = `<div class="tac-range-mid">`
          + `<span class="tac-range-end">${sMin}m</span>`
          + `<input type="range" min="${sMin}" max="${dynMax}" step="0.1" value="${cur}">`
          + `<span class="tac-range-end">${tacRangeFmt(dynMax)}m</span>`
          + `</div>`
          + `<span class="tac-range-val">${tacRangeFmt(cur)}m</span>`;
        const sl = slLine.querySelector('input');
        if (sl) {
          sl.addEventListener('input', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx.m = parseFloat(sl.value);
            slLine.querySelector('.tac-range-val').textContent = `${tacRangeFmt(rbx.m)}m`;
            updateDescs();
            if (opts.softUpdate) opts.softUpdate();
          });
          sl.addEventListener('change', () => { renderTacBoard(); renderTacManage(); });
        }
        box.appendChild(slLine);
      }
    });
    if (cfg.fearMods) {
      [['fearH', 'hunter'], ['fearS', 'survivor']].forEach(([field, gkey]) => {
        const gopts = cfg.fearMods[gkey];
        const defKey = gopts[0][0];
        const grpEl = document.createElement('div');
        grpEl.className = 'tac-box-line';
        grpEl.innerHTML = `<div class="tac-range-opts">`
          + gopts.map(([v, label]) =>
            subBtn((rb[field] || defKey) === v, `data-f="${field}" data-v="${v}"`, label)).join('')
          + `</div>`;
        grpEl.querySelectorAll('.tac-range-sub').forEach((b) => {
          b.addEventListener('click', () => {
            const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
            rbx[b.dataset.f] = b.dataset.v;
            refresh();
          });
        });
        box.appendChild(grpEl);
      });
    }
  }


  const descs = document.createElement('div');
  descs.className = 'tac-range-descs';
  function updateDescs() {
    descs.innerHTML = '';
    tacRangeEntries(cfg, inst, hideByDefault).forEach((e2) => {
      const row = document.createElement('div');
      row.className = 'tac-range-desc';
      const txt = document.createElement('span');
      txt.textContent = e2.opt.crossWidth != null
        ? `${(e2.opt.label || '') + postfix} ${translate("ui.tac.manangeBox.range.unit.radius")} ${tacRangeFmt(e2.meters)}m ${translate("ui.tac.manangeBox.range.unit.crossWidth")} ${tacRangeFmt(e2.opt.crossWidth)}m`
        : e2.opt.ringInner != null
          ? `${(e2.opt.label || '') + postfix} ${translate("ui.tac.manangeBox.range.unit.innerRadius")} ${tacRangeFmt(e2.opt.ringInner)}m ${translate("ui.tac.manangeBox.range.unit.outerRadius")} ${tacRangeFmt(e2.meters)}m`
          : `${(e2.opt.label || '') + postfix} ${translate("ui.tac.manangeBox.range.unit.radius")} ${tacRangeFmt(e2.meters)}m`;
      row.appendChild(txt);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tac-range-del';
      del.textContent = '×';
      del.title = translate("ui.tac.manangeBox.range.delete.message");
      del.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        rbx.subs = rbx.subs.filter((v) => v !== e2.i);
        refresh();
      });
      row.appendChild(del);
      descs.appendChild(row);
    });
    tacTalentRanges(inst, hostRole).forEach((tr) => {
      const row = document.createElement('div');
      row.className = 'tac-range-desc';
      const txt = document.createElement('span');
      txt.textContent = `${tr.label}${tr.sub ? '·' + tr.sub : postfix} ${translate("ui.tac.manangeBox.range.unit.radius")} ${tacRangeFmt(tr.meters)}m`;
      row.appendChild(txt);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tac-range-del';
      del.textContent = '×';
      del.title = translate("ui.tac.manangeBox.range.delete.message");
      del.addEventListener('click', () => {
        const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
        delete rbx.talents[tr.tk];
        refresh();
      });
      row.appendChild(del);
      descs.appendChild(row);
    });
  }
  updateDescs();
  box.appendChild(descs);


  const fillLabel = document.createElement('label');
  fillLabel.className = 'tac-range-fill';
  fillLabel.innerHTML = `<input type="checkbox"`
    + `${(rb ? rb.fill : defFill) ? ' checked' : ''}> ${translate("ui.tac.manangeBox.range.setting.fill")}`;
  const fillInput = fillLabel.querySelector('input');
  if (fillInput) fillInput.addEventListener('change', (ev) => {
    const rbx = tacRbEnsure(cfg, inst, hideByDefault, defFill);
    rbx.fill = ev.target.checked;
    refresh();
  });
  box.appendChild(fillLabel);
}

function tacManageDefaultEntries(board) {
  const campOrder = { survivor: 0, hunter: 1, other: 2 };
  const campOf = (role) => campOrder[(TAC_ROLES[role] || {}).camp] ?? 0;
  const roleIdx = {};
  Object.keys(TAC_ROLES).forEach((r, i) => { roleIdx[r] = i; });
  const entries = [];
  board.tokens.forEach((t) =>
    entries.push({ type: 'role', tid: t.tid, role: t.role, key: `r:${t.tid}` }));
  board.items.forEach((it, idx) =>
    entries.push({ type: 'item', idx, role: it.role, key: `i:${it.iid}` }));
  entries.sort((a, b) =>
    campOf(a.role) - campOf(b.role)
    || (roleIdx[a.role] ?? 999) - (roleIdx[b.role] ?? 999)
    || (a.type === 'role' && b.type === 'role' ? a.tid - b.tid
      : a.type === 'item' && b.type === 'item' ? a.idx - b.idx
      : a.type === 'role' ? -1 : 1));
  const occCount = new Map();
  entries.forEach((e) => {
    const k = tacEntryName(e);
    occCount.set(k, (occCount.get(k) || 0) + 1);
    e.occ = occCount.get(k);
  });
  entries.forEach((e, i) => { e.defIdx = i; });
  return entries;
}

// 造物在管理列表中的名称（角色/道具统一按显示名）
function tacEntryName(e) {
  const def = e.type === 'role'
    ? (TAC_ROLES[e.role] || {})
    : (TAC_ITEM_TYPES[(tacBoard().items[e.idx] || {}).kind] || {});
  return def.name || e.role;
}

// 重复造物（同名多个实例，角色与道具同名合并计数）在按钮名后加序号
function tacDispName(e) {
  const base = tacEntryName(e);
  const dup = tacManageDefaultEntries(tacBoard())
    .filter((o) => tacEntryName(o) === base).length > 1;
  return dup ? `${base} ${e.occ}` : base;
}

function tacSortedEntries(board) {
  const entries = tacManageDefaultEntries(board);
  const order = board.order || [];
  const pos = new Map(order.map((k, i) => [k, i]));
  entries.sort((a, b) => {
    const pa = pos.has(a.key) ? pos.get(a.key) : order.length + a.defIdx;
    const pb = pos.has(b.key) ? pos.get(b.key) : order.length + b.defIdx;
    return pa - pb;
  });
  return entries;
}

let manageDrag = null;

let suppressManageClick = 0;

function attachManageDrag(btn, key) {
  btn.addEventListener('pointerdown', (ev) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    manageDrag = { key, btn, x: ev.clientX, y: ev.clientY, active: false, target: null };
    const move = (e) => {
      if (!manageDrag) return;
      const dx = e.clientX - manageDrag.x;
      const dy = e.clientY - manageDrag.y;
      if (!manageDrag.active) {
        if (Math.hypot(dx, dy) <= 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { manageDrag = null; return; }
        manageDrag.active = true;
        btn.classList.add('dragging');
      }
      e.preventDefault();
      btn.style.setProperty('--dg-x', `${dx}px`);
      btn.style.setProperty('--dg-y', `${dy}px`);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const t = el && el.closest ? el.closest('.tac-manage-btn') : null;
      const nt = (t && t !== btn) ? t : null;
      if (manageDrag.target !== nt) {
        if (manageDrag.target) manageDrag.target.classList.remove('drag-over');
        manageDrag.target = nt;
        if (nt) nt.classList.add('drag-over');
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (manageDrag && manageDrag.active) {
        suppressManageClick = Date.now();
        const tgt = manageDrag.target;
        btn.classList.remove('dragging');
        btn.style.removeProperty('--dg-x');
        btn.style.removeProperty('--dg-y');
        if (tgt) tgt.classList.remove('drag-over');
        if (tgt) {
          const board = tacBoard();
          const keys = tacSortedEntries(board).map((en) => en.key);
          const from = keys.indexOf(key);
          const to = keys.indexOf(tgt.dataset.key);
          if (from > -1 && to > -1) {
            keys.splice(from, 1);
            keys.splice(to, 0, key);
            board.order = keys;
            tacSave();
            renderTacManage();
            renderTacBoard();
          }
        }
      }
      manageDrag = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
}

function tacManageBox(settings, titleKey) {
  const box = document.createElement('div');
  box.className = 'tac-manage-box';
  const title = document.createElement('span');
  title.className = 'tac-box-title';
  title.textContent = translate(titleKey, {  });
  box.appendChild(title);
  settings.appendChild(box);
  return box;
}

function tacBoxHint(box, html) {
  const hint = document.createElement('span');
  hint.className = 'tac-box-hint';
  hint.innerHTML = html;
  box.appendChild(hint);
  return hint;
}

function buildAngleManageBox(settings, inst, idx) {
  const box = tacManageBox(settings, "ui.tac.manangeBox.angle.title");
  const line = document.createElement('div');
  line.className = 'tac-box-line';
  const cur = ((inst.angle || 0) % 360 + 360) % 360;
  line.innerHTML = `<div class="tac-range-mid">`
    + `<input type="range" min="0" max="360" step="5" value="${cur}">`
    + `</div>`
    + `<span class="tac-range-val">${cur}°</span>`;
  const sl = line.querySelector('input');
  // 软更新：拖动时只旋转已有 DOM，不整板重绘（避免卡顿）；松手再全量刷新
  const softRotate = () => {
    const a = ((inst.angle || 0) % 360 + 360) % 360;
    tacMapWrap.querySelectorAll(`.tac-item-circle[data-idx="${idx}"]`).forEach((el) => {
      const g = el.querySelector('.tac-item-cross-svg g');
      if (g) g.setAttribute('transform', `rotate(${a} 50 50)`);
      const img = el.querySelector('img');
      if (img) img.style.transform = a
        ? `translate(-50%, -50%) rotate(${a}deg)` : '';
    });
  };
  sl.addEventListener('input', () => {
    inst.angle = parseFloat(sl.value) % 360;
    line.querySelector('.tac-range-val').textContent = `${inst.angle}°`;
    softRotate();
    tacSave();
  });
  sl.addEventListener('change', () => renderTacBoard());
  box.appendChild(line);
}

// 某造物实例在管理列表中的编号名（如 水镜1、红夫人2）
function tacInstDispName(inst) {
  if (!inst) return '';
  const entries = tacManageDefaultEntries(tacBoard());
  const e = inst.kind != null
    ? entries.find((o) => o.type === 'item' && tacBoard().items[o.idx]
      && tacBoard().items[o.idx].iid === inst.iid)
    : entries.find((o) => o.type === 'role' && o.tid === inst.tid);
  if (e) return tacDispName(e);
  return (TAC_ITEM_TYPES[inst.kind] || TAC_ROLES[inst.role] || {}).name || '';
}

// 镜像管理（红夫人 / 水镜 / 镜像 共享；与连线管理同一套相连语义，
// 按宿主（红夫人/水镜/镜像）解析其所属配对的水镜
function tacAqOfHost(host) {
  const b = tacBoard();
  if (host.kind === 'aquaMirror') return host;
  if (host.kind === 'mirrorImage') {
    return (host.aqIid != null && tacItemByIid(host.aqIid))
      || b.items.find((it) => it.kind === 'aquaMirror') || null;
  }
  return b.items.find((it) => it.kind === 'aquaMirror' && it.linkTid === host.tid) || null;
}

// 状态存于水镜造物上，显示连线/显示镜像/固定水镜位置/交换镜像由相连双方共享）
function buildMirrorManageBox(settings, host) {
  const board = tacBoard();
  const isTok = host.kind == null;
  // 配对解析：按 host 类型找到与其配对的红夫人/水镜
  let aq = null;
  let bq = null;
  if (host.kind === 'aquaMirror') {
    aq = host;
    bq = aq.linkTid != null ? tacTokenByTid(aq.linkTid) : null;
  } else if (host.kind === 'mirrorImage') {
    aq = tacAqOfHost(host);
    bq = aq && aq.linkTid != null ? tacTokenByTid(aq.linkTid) : null;
  } else {
    bq = host;
    aq = board.items.find((it) => it.kind === 'aquaMirror' && it.linkTid === bq.tid) || null;
  }
  const linked = !!(aq && bq);
  const mi = aq ? (board.items.find((it) => it.kind === 'mirrorImage' && it.aqIid === aq.iid)
    || board.items.find((it) => it.kind === 'mirrorImage' && it.aqIid == null)) : null;

  const box = tacManageBox(settings, "ui.tac.manangeBox.bloodyQueen.aquaMirror.title");
  const line = document.createElement('div');
  line.className = 'tac-box-line';
  box.appendChild(line);
  line.innerHTML =
    `<label class="tac-manage-glow"><input type="checkbox" data-mq="allow"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tac.manangeBox.link.allow")}</label>`
    + `<label class="tac-manage-glow"><input type="checkbox" data-mq="link"`
    + `${(linked ? aq.linkShow !== false && bq.linkShow !== false : host.linkShow !== false) ? ' checked' : ''}${linked ? '' : ' disabled'}>`
    + ` ${translate("ui.tac.manangeBox.link.show")}</label>`
    + `<label class="tac-manage-glow"><input type="checkbox" data-mq="show"`
    + `${aq && aq.showMirror ? ' checked' : ''}${aq ? '' : ' disabled'}>`
    + ` ${translate("ui.tac.manangeBox.bloodyQueen.aquaMirror.button.showMirrorImage")}</label>`
    + `<button type="button" class="tac-manage-toggle${aq && aq.fixedMirror ? ' on' : ''}" data-mq="fix"`
    + `${aq && aq.showMirror ? '' : ' disabled'}>`
    + translate("ui.tac.manangeBox.bloodyQueen.aquaMirror.button.fix", {  }) + `</button>`
    + `<button type="button" class="tac-manage-swap"`
    + `${aq && aq.showMirror && mi ? '' : ' disabled'}>`
    + translate("ui.tac.manangeBox.bloodyQueen.aquaMirror.button.swap", {  }) + `</button>`;

  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(linked
    ? "ui.tac.manangeBox.link.status.linked"
    : "ui.tac.manangeBox.link.status.none",
    { name: linked ? tacInstDispName(isTok ? aq : bq) : null });
  box.appendChild(status);
  tacBoxHint(box, translate("ui.tac.manangeBox.bloodyQueen.aquaMirror.hint", {  }));

  const refreshAll = () => {
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  };
  line.querySelector('input[data-mq="allow"]').addEventListener('change', (e) => {
    host.linkAuto = e.target.checked;
    if (e.target.checked) {
      if (isTok) tacAutoLinkToken(host);
      else tacAutoLinkItem(host);
    } else if (isTok) tacBreakTokenLinks(host, true);
    else tacBreakItemLink(host, true);
    tacSyncMirror(null, tacAqOfHost(host));
    refreshAll();
  });
  line.querySelector('input[data-mq="link"]').addEventListener('change', (e) => {
    if (!linked) return;
    aq.linkShow = e.target.checked;
    bq.linkShow = e.target.checked;
    renderTacArrows();
    tacSave();
  });
  line.querySelector('input[data-mq="show"]').addEventListener('change', (e) => {
    if (!aq) return;
    aq.showMirror = e.target.checked;
    if (!aq.showMirror) { aq.fixedMirror = false; delete aq.mirrorAxis; }
    tacSyncMirror(null, aq);
    refreshAll();
  });
  line.querySelector('button[data-mq="fix"]').addEventListener('click', () => {
    if (!aq || !aq.showMirror) return;
    aq.fixedMirror = !aq.fixedMirror;
    delete aq.mirrorAxis;
    tacSyncMirror(null, aq);
    refreshAll();
  });
  line.querySelector('button.tac-manage-swap').addEventListener('click', () => {
    if (!linked) return;
    const p2 = tacMirrorParts(aq);
    if (!p2 || !p2.mi) return;
    const bx = p2.bq.x, by = p2.bq.y;
    p2.bq.x = p2.mi.x; p2.bq.y = p2.mi.y;
    p2.mi.x = bx; p2.mi.y = by;
    tacSyncMirror('bq', aq);
    renderTacBoard();
    renderTacArrows();
    tacSave();
  });
}

// 击球点连线管理：允许连线 / 显示连线 / 提前闭合，三者由相连组件共享
function buildHittingPointBox(settings, host) {
  const comp = tacHpComponent(host);
  const opens = tacHpComponentOpen(comp);
  const canClose = !host.hpClosed && opens.length === 3;
  const box = tacManageBox(settings, 'ui.tac.manangeBox.cueist.contactPoint.title');
  const allowOn = host.linkAuto !== false;
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="allow"`
    + `${allowOn ? ' checked' : ''}> ${translate("ui.tac.manangeBox.link.allow")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="show"`
    + `${host.linkShow !== false ? ' checked' : ''}${allowOn ? '' : ' disabled'}>`
    + ` ${translate("ui.tac.manangeBox.link.show")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-hp="close"`
    + `${canClose ? '' : ' disabled'}> ${translate("ui.tac.manangeBox.cueist.contactPoint.button.close")}</label>`
    + `</div>`;
  const { reg, close } = tacHpPeers(host);
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  let sKey = 'ui.tac.manangeBox.link.status.none';
  let sVars = {};
  if (close.length && reg.length) {
    sKey = 'ui.tac.manangeBox.link.status.linkedClose';
    sVars = { a: tacInstDispName(reg[0]), b: tacInstDispName(close[0]) };
  } else if (reg.length >= 2) {
    sKey = 'ui.tac.manangeBox.link.status.linkedTwo';
    sVars = { a: tacInstDispName(reg[0]), b: tacInstDispName(reg[1]) };
  } else if (reg.length === 1) {
    sKey = 'ui.tac.manangeBox.link.status.linked';
    sVars = { name: tacInstDispName(reg[0]) };
  }
  status.textContent = translate(sKey, sVars);
  box.appendChild(status);
  const hKey = reg.length >= 2 ? 'ui.tac.manangeBox.link.hint.sameMulti' : 'ui.tac.manangeBox.link.hint.samePair';
  tacBoxHint(box, translate(hKey, {
    name: (TAC_ITEM_TYPES[TAC_HP_KIND] || {}).name,
    minM: TAC_HP_MIN_M,
    maxM: TAC_HP_MAX_M,
  }));
  box.querySelector('input[data-hp="allow"]').addEventListener('change', (e) => {
    if (e.target.checked) {
      host.linkAuto = true;
      tacHpJoin(host);
    } else {
      tacHpDissolve(host);
    }
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
  box.querySelector('input[data-hp="show"]').addEventListener('change', (e) => {
    tacHpComponent(host).forEach((o) => { o.linkShow = e.target.checked; });
    renderTacArrows();
    tacSave();
  });
  box.querySelector('input[data-hp="close"]').addEventListener('change', (e) => {
    if (!e.target.checked) return;
    tacHpCloseShape(host);
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
}

// 连线管理（同造物两两相连 / 异造物相连 共用）
// host: 道具实例或角色实例；info: { cross, roleName, itemName, maxM }
function buildLinkManageBox(settings, host, info) {
  const box = tacManageBox(settings, "ui.tac.manangeBox.link.title");
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-lk="auto"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tac.manangeBox.link.allow")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-lk="show"`
    + `${host.linkShow !== false ? ' checked' : ''}> ${translate("ui.tac.manangeBox.link.show")}</label>`
    + `</div>`;
  const isTok = !host.kind;
  let partnerName = null;
  if (isTok) {
    const its = tacTokenLinkedItems(host);
    if (its[0]) partnerName = tacInstDispName(its[0]);
  } else if (info.cross) {
    const tk = tacLinkTokenOf(host);
    if (tk) partnerName = tacInstDispName(tk);
  } else {
    const p = tacLinkPartner(host);
    if (p) partnerName = tacInstDispName(p);
  }
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(partnerName
    ? "ui.tac.manangeBox.link.status.linked" : "ui.tac.manangeBox.link.status.none", { name: partnerName });
  box.appendChild(status);
  const hintKey = info.cross
    ? (info.maxM ? "ui.tac.manangeBox.link.hint.crossMax" : "ui.tac.manangeBox.link.hint.crossNoMax")
    : (info.maxM ? "ui.tac.manangeBox.link.hint.samePairMax" : "ui.tac.manangeBox.link.hint.samePairNoMax");
  tacBoxHint(box, translate(hintKey, {
    name: info.itemName, item: info.itemName,
    role: info.roleName, maxM: info.maxM,
  }));
  box.querySelectorAll('input').forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.dataset.lk === 'show') {
        host.linkShow = cb.checked;
        if (isTok) {
          tacTokenLinkedItems(host).forEach((it) => { it.linkShow = cb.checked; });
        } else if (info.cross) {
          const tk = tacLinkTokenOf(host);
          if (tk) tk.linkShow = cb.checked;
        } else {
          const p = tacLinkPartner(host);
          if (p) p.linkShow = cb.checked;
        }
        renderTacArrows();
        tacSave();
        return;
      } else {
        host.linkAuto = cb.checked;
        if (cb.checked) {
          if (isTok) tacAutoLinkToken(host);
          else tacAutoLinkItem(host);
        } else if (isTok) tacBreakTokenLinks(host, true);
        else tacBreakItemLink(host, true);
      }
      renderTacBoard();
      tacSave();
    });
  });
}

// 水渊管理（渔女 / 渔猎 共享；与连线管理同一套相连语义，
// 允许连线各自持有，模拟水渊状态存于渔猎造物、由相连双方共享）
function buildAbyssManageBox(settings, host) {
  const board = tacBoard();
  const isTok = host.kind == null;
  let sp = null;
  let nt = null;
  if (isTok) {
    nt = host;
    sp = board.items.find((it) => it.kind === 'spearfishing' && it.linkTid === nt.tid) || null;
  } else {
    sp = host;
    nt = sp.linkTid != null ? tacTokenByTid(sp.linkTid) : null;
  }
  const linked = !!(sp && nt);
  const box = tacManageBox(settings, "ui.tac.manangeBox.naiad.puddles.title");
  box.innerHTML +=
    `<div class="tac-link-opts">`
    + `<label class="tac-link-opt"><input type="checkbox" data-ab="allow"`
    + `${host.linkAuto !== false ? ' checked' : ''}> ${translate("ui.tac.manangeBox.link.allow")}</label>`
    + `<label class="tac-link-opt"><input type="checkbox" data-ab="abyss"`
    + `${sp && sp.abyss && sp.abyss.on ? ' checked' : ''}${linked ? '' : ' disabled'}>`
    + ` ${translate("ui.tac.manangeBox.naiad.puddles.button.simulation")}</label>`
    + `</div>`;
  const partnerName = linked ? tacInstDispName(isTok ? sp : nt) : null;
  const status = document.createElement('span');
  status.className = 'tac-box-hint tac-link-status';
  status.textContent = translate(partnerName
    ? "ui.tac.manangeBox.link.status.linked" : "ui.tac.manangeBox.link.status.none", { name: partnerName });
  box.appendChild(status);
  tacBoxHint(box, translate("ui.tac.manangeBox.naiad.puddles.hint1", { maxM: TAC_ABYSS_MAX_M }));
  tacBoxHint(box, translate("ui.tac.manangeBox.naiad.puddles.hint2", {  }));
  box.querySelector('input[data-ab="allow"]').addEventListener('change', (e) => {
    host.linkAuto = e.target.checked;
    if (e.target.checked) {
      if (isTok) tacAutoLinkToken(host);
      else tacAutoLinkItem(host);
    } else if (isTok) tacBreakTokenLinks(host, true);
    else tacBreakItemLink(host, true);
    renderTacBoard();
    renderTacArrows();
    tacSave();
    renderTacManage();
  });
  box.querySelector('input[data-ab="abyss"]').addEventListener('change', (e) => {
    if (!linked || !sp) return;
    if (e.target.checked) sp.abyss = { on: true, recording: false, trail: [], done: null };
    else delete sp.abyss;
    renderTacArrows();
    tacSave();
  });
}

function renderTacManage() {
  const board = tacBoard();
  board.order ||= [];
  tacManageList.innerHTML = '';
  // 卡片标题随工具切换：动画工具下变为「造物动画」
  {
    const titleKey = tacTool === 'anim' ? "ui.tac.creation.title.anim" : "ui.tac.creation.title";
    const zhEl = document.querySelector('#tacManageCard .ded-sec-zh');
    const enEl = document.querySelector('#tacManageCard .ded-sec-en');
    if (zhEl) { zhEl.dataset.i18n = titleKey; zhEl.textContent = translate(titleKey); }
    if (enEl) {
      enEl.dataset.i18nEn = titleKey;
      enEl.textContent = translateEn(titleKey).replace(/^[^\p{L}\p{N}]+\s*/u, '');
    }
  }
  const entries = tacSortedEntries(board);

  if (!entries.length) {
    tacManageSel = null;
    tacManageList.innerHTML =
      `<div class="tac-manage-empty">${translate("ui.tac.creation.hint.none")}</div>`;
    return;
  }

  const info = document.createElement('div');
  info.className = 'tac-manage-info';
  info.innerHTML = `<span class="tac-manage-count">${
    translate("ui.tac.creation.count")}<b>${entries.length}</b></span>`;
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'tac-manage-reset';
  resetBtn.textContent = translate("ui.tac.creation.order.reset.button");
  resetBtn.addEventListener('click', () => {
    board.order = [];
    tacSave();
    renderTacManage();
    renderTacBoard();
  });
  const deselectBtn = document.createElement('button');
  deselectBtn.type = 'button';
  deselectBtn.className = 'tac-manage-reset';
  deselectBtn.textContent = translate("ui.tac.creation.deselect");
  deselectBtn.addEventListener('click', () => {
    // 取消所有造物选中（清除地图选中高亮，不影响造物本身的「高亮」属性），并退出动画的「添加路径点」状态
    tacManageSel = null;
    setTacSelected(null);
    setTacSelectedItem(null);
    if (tacAnimArmed) setTacAnimArmed(false);
    renderTacBoard();
    renderTacManage();
  });
  const side = document.createElement('span');
  side.className = 'tac-manage-side';
  const hint = document.createElement('span');
  hint.className = 'tac-manage-hint';
  hint.textContent = translate("ui.tac.creation.order.hint");
  side.appendChild(hint);
  side.appendChild(resetBtn);
  side.appendChild(deselectBtn);
  info.appendChild(side);
  tacManageList.appendChild(info);
  const isSelEntry = (e) => tacManageSel && e.type === tacManageSel.type
    && (e.type === 'role' ? e.tid === tacManageSel.tid : e.idx === tacManageSel.idx);
  if (tacManageSel && !entries.some(isSelEntry)) tacManageSel = null;


  const grid = document.createElement('div');
  grid.className = 'tac-manage-grid';
  entries.forEach((e) => {
    const isRole = e.type === 'role';
    const def = isRole
      ? (TAC_ROLES[e.role] || {})
      : (TAC_ITEM_TYPES[board.items[e.idx].kind] || {});
    const btn = document.createElement('button');
    btn.className = 'tac-manage-btn' + (isSelEntry(e) ? ' active' : '');
    const dispName = tacDispName(e);
    btn.title = dispName;
    btn.dataset.key = e.key;
    btn.innerHTML =
      `${def.icon ? `<img src="${def.icon}" alt="${def.name}" draggable="false">` : ''}`
      + `<span class="tac-manage-btn-name">${dispName}</span>`;
    attachManageDrag(btn, e.key);
    btn.addEventListener('click', () => {
      if (Date.now() - suppressManageClick < 300) return;
      tacManageSel = isRole ? { type: 'role', tid: e.tid } : { type: 'item', idx: e.idx };

      if (isRole) { setTacSelected(e.tid); setTacSelectedItem(null); }
      else { setTacSelectedItem(e.idx); setTacSelected(null); }
      renderTacBoard();
    });
    grid.appendChild(btn);
  });
  tacManageList.appendChild(grid);


  const settings = document.createElement('div');
  settings.className = 'tac-manage-settings';
  tacManageList.appendChild(settings);
  if (!tacManageSel) {
    const hintKey = tacTool === 'anim' ? "ui.tac.creation.hint.anim" : "ui.tac.creation.hint";
    settings.innerHTML =
      `<div class="tac-manage-empty">${translate(hintKey)}</div>`;
    return;
  }


  if (tacManageSel.type === 'role') {
    const token = board.tokens.find((t) => t.tid === tacManageSel.tid) || null;
    if (!token) return;
    const role = token.role;
    const rgCfg = (TAC_ROLES[role] || {}).ranges;
    const rangeShown = !!rgCfg && tacRangeEntries(rgCfg, token, true).length > 0;
    const isRoleDefault = () =>
      token.size === TAC_MANAGE_DEFAULT.roleSize && !rangeShown && !token.hideIcon;

    // 动画工具：管理卡片只保留「动画管理」，隐藏范围/图标等其它设置卡片
    if (tacTool === 'anim') {
      buildTacAnimBox(settings, token);
      return;
    }


    if (role === 'explorer') {
      const box = tacManageBox(settings, "ui.tac.manangeBox.explorer.passwordPage.title");
      box.innerHTML +=
        `<label class="tac-manage-glow"><input type="checkbox"`
        + `${token.showTreasureRange ? ' checked' : ''}>${translate("ui.tac.manangeBox.explorer.passwordPage.button.deduce")}</label>`;
      tacBoxHint(box, translate("ui.tac.manangeBox.explorer.passwordPage.hint", {  }));
      box.querySelector('input').addEventListener('change', (e) => {
        // 最多同时开启一个：开启当前冒险家时立即关闭其它所有冒险家
        if (e.target.checked) {
          board.tokens.forEach((o) => { if (o.role === 'explorer' && o !== token) o.showTreasureRange = false; });
        }
        token.showTreasureRange = e.target.checked;
        renderTacTreasure();
        tacSave();
      });
    }


    if (role === 'bloodyQueen') {
      buildMirrorManageBox(settings, token);
    }


    if (role === 'naiad') {
      buildAbyssManageBox(settings, token);
    }
const fixedSpawnCfg = (MAPS_DATA[S.currentMapId].fixedSpawns || {})[role];
    if (fixedSpawnCfg) {
      // 同角色多个造物共享固定点位设置（教授鳞片 / 摄影师照相机 / 疯眼控制台 / 小丑零件）
      const roleTokens = board.tokens.filter((t) => t.role === role);
      const anyFlag = (f) => roleTokens.some((t) => t[f]);
      const setAll = (f, v) => roleTokens.forEach((t) => { t[f] = v; });
      const fsTitleKey = role === 'professor' ? "ui.tac.manangeBox.professor.scale.title"
        : role === 'photographer' ? "ui.tac.manangeBox.photographer.camera.title"
        : role === 'madEyes' ? "ui.tac.manangeBox.madEyes.console.title"
        : role === 'smileyFace' ? "ui.tac.manangeBox.smileyFace.part.title" : null;
      const fsBox = fsTitleKey ? tacManageBox(settings, fsTitleKey) : settings;
      const fsRangeItem = (Array.isArray(fixedSpawnCfg.item)
        ? fixedSpawnCfg.item : [fixedSpawnCfg.item])
        .find((it) => it && it.rangeM && it.rangeScreenM);
      const fsRow = document.createElement('div');
      fsRow.className = fsTitleKey ? 'tac-box-line' : 'tac-manage-row';
      const hasOrient = (Array.isArray(fixedSpawnCfg.item)
        ? fixedSpawnCfg.item : [fixedSpawnCfg.item])
        .some((it) => it && it.flag_orientation);
      fsRow.innerHTML =
        `<label class="tac-manage-glow"><input type="checkbox"`
        + `${anyFlag('showFixedSpawns') ? ' checked' : ''}>${translate("common.show")}${fixedSpawnCfg.label}</label>`
        + (hasOrient
          ? `<label class="tac-manage-glow"><input type="checkbox" data-fsdir`
          + `${anyFlag('showSpawnDir') ? ' checked' : ''}> ${translate("ui.tac.manangeBox.character.showDir")}</label>`
          : '');
      fsRow.querySelector('input').addEventListener('change', (e) => {
        setAll('showFixedSpawns', e.target.checked);
        renderTacFixedSpawns();
        tacSave();
      });
      const dirCb = fsRow.querySelector('input[data-fsdir]');
      if (dirCb) dirCb.addEventListener('change', (e) => {
        setAll('showSpawnDir', e.target.checked);
        renderTacFixedSpawns();
        tacSave();
      });
      fsBox.appendChild(fsRow);


      if (fsRangeItem && MAPS_DATA[S.currentMapId].widthM) {
        const dev = roleTokens.find((t) => t.fixedSpawnDevice)?.fixedSpawnDevice || 'pc';
        const radioName = `tac-fsdev-${S.currentMapId}-${role}`;
        const rangeRow = document.createElement('div');
        rangeRow.className = fsTitleKey ? 'tac-box-line' : 'tac-manage-row';
        rangeRow.innerHTML =
          '<label class="tac-manage-glow"></label>'
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'pc' ? ' checked' : ''}>PC</label>`
          + `<label class="tac-manage-glow"><input type="radio" name="${radioName}"${dev === 'ios' ? ' checked' : ''}>IOS</label>`;
        // 复选框文字含理论范围（随 PC/IOS 切换重写整个标签并重新绑定事件）
        const cbLabel = rangeRow.querySelector('label.tac-manage-glow');
        const syncRangeLabel = (devKey) => {
          const [devW, devH] = fsRangeItem.rangeScreenM[devKey];
          cbLabel.innerHTML = `<input type="checkbox"${anyFlag('showFixedSpawnRange') ? ' checked' : ''}>`
            + translate("ui.tac.manangeBox.madEyes.console.showRange.button", { rangeM: fsRangeItem.rangeM, devW, devH });
          cbLabel.querySelector('input').addEventListener('change', (e) => {
            setAll('showFixedSpawnRange', e.target.checked);
            renderTacFixedSpawns();
            tacSave();
          });
        };
        syncRangeLabel(dev);
        const [pcRadio, iosRadio] = rangeRow.querySelectorAll('input[type="radio"]');
        const onDevChange = (next) => {
          setAll('fixedSpawnDevice', next);
          syncRangeLabel(next);
          renderTacFixedSpawns();
          tacSave();
        };
        pcRadio.addEventListener('change', () => { if (pcRadio.checked) onDevChange('pc'); });
        iosRadio.addEventListener('change', () => { if (iosRadio.checked) onDevChange('ios'); });
        fsBox.appendChild(rangeRow);
      }
    }

    const lkDef = Object.values(TAC_ITEM_TYPES).find((d) => d.linkToRole === role);
    if (lkDef && role !== 'bloodyQueen' && role !== 'naiad') {
      buildLinkManageBox(settings, token, {
        cross: true,
        roleName: (TAC_ROLES[role] || {}).name,
        itemName: lkDef.name,
        maxM: lkDef.linkMaxM,
      });
    }

    const roleCamp = (TAC_ROLES[role] || {}).camp;
    if (rgCfg || roleCamp === 'survivor' || roleCamp === 'hunter') {
      const syncRoleCircleWidth = () => {
        const el = tacMapWrap.querySelector(`.tac-role-circle[data-role="${role}"]`);
        const m = tacRoleRangeMeters(role, token);
        if (el && m !== null) el.style.width = `${tacItemMetersToPercent(m)}%`;
      };
      buildTacRangeRows(settings, rgCfg, token, true, { softUpdate: syncRoleCircleWidth, hostRole: role, groupKind: (roleCamp === 'survivor' || roleCamp === 'hunter') ? 'trait' : 'plain', labelPrefix: translate("common.show"), labelPostfix: translate("common.range") });
    }

    const row = document.createElement('div');
    row.className = 'tac-manage-row';
    row.innerHTML =
      `<label class="tac-manage-slider">${translate("application.common.icon.size")}`
      + `<input type="range" min="3" max="12" step="0.5" value="${token.size}"></label>`
      + `<label class="tac-manage-hide"><input type="checkbox"`
      + `${token.hideIcon ? ' checked' : ''}>${translate("application.common.icon.hide")}</label>`
      + `<label class="tac-manage-glow"><input type="checkbox"`
      + `${token.glow ? ' checked' : ''}>${translate("application.common.highlight")}</label>`
      + `<label class="tac-manage-def"><input type="checkbox"`
      + `${isRoleDefault() ? ' checked' : ''}>${translate("common.default")}</label>`
      + `<button type="button" class="tac-manage-del">${translate("common.delete")}</button>`;
    const slider = row.querySelector('input[type="range"]');
    const [hideCb, glowCb, defCb] = row.querySelectorAll('input[type="checkbox"]');
    slider.addEventListener('input', () => {
      token.size = parseFloat(slider.value);
      const el = tacMapWrap.querySelector(`.tac-token[data-role="${role}"]`);
      if (el) {
        el.style.width = `${token.size}%`;
        setTacFontSize(el, token.size * 0.42, 26);
      }
      defCb.checked = isRoleDefault();
    });

    hideCb.addEventListener('change', () => {
      token.hideIcon = hideCb.checked;
      renderTacBoard();
    });

    glowCb.addEventListener('change', () => {
      token.glow = glowCb.checked;
      renderTacBoard();
    });
    defCb.addEventListener('change', () => {
      if (!defCb.checked) return;
      token.size = TAC_MANAGE_DEFAULT.roleSize;
      token.hideIcon = false;
      if (rgCfg) {
        delete token.rangeMode;
        delete token.rangeMeters;
        delete token.rangeBox;
      }
      renderTacBoard();
    });

    row.querySelector('.tac-manage-del').addEventListener('click', () => {
      const ti = board.tokens.findIndex((t) => t.tid === token.tid);
      if (ti < 0) return;
      const snapshot = { ...board.tokens[ti] };
      const removed = board.tokens[ti];
      board.tokens.splice(ti, 1);
      tacOnTokenRemoved(removed);
      tacUndoStack.push({ type: 'remove', token: snapshot });
      if (tacSelected === token.tid) setTacSelected(null);
      tacManageSel = null;
      renderTacBoard();
    });
    settings.appendChild(row);
    return;
  }


  const idx = tacManageSel.idx;
  const it = board.items[idx];
  const itDef = TAC_ITEM_TYPES[it.kind] || {};
  const rgCfg = (itDef.ranges && Array.isArray(itDef.ranges.options)) ? itDef.ranges : null;
  const curIcon = it.iconSize ?? TAC_MANAGE_DEFAULT.iconSize;

  const syncCircleWidth = () => {
    const el = tacMapWrap.querySelector(`.tac-item-circle[data-idx="${idx}"]`);
    if (el) el.style.width = `${tacItemSizePercent(it)}%`;
  };

  const itemRangeIsDefault = () => {
    if (!rgCfg) return true;
    const rb = it.rangeBox;
    if (!rb) return true;
    // 道具范围默认形态：第一项显示、无天赋/档位/自定义半径/恐惧修正，填充与定义一致
    if (rb.tab !== 'range') return false;
    if (!Array.isArray(rb.subs) || rb.subs.length !== 1 || rb.subs[0] !== 0) return false;
    if (rb.talents && Object.keys(rb.talents).length) return false;
    if (rb.m != null || rb.fearH != null || rb.fearS != null) return false;
    if (rb.gear != null && rb.gear !== 0) return false;
    if (rb.fill !== undefined && rb.fill !== !!itDef.fill) return false;
    return true;
  };
  const isDefault = !it.hideIcon
    && curIcon === TAC_MANAGE_DEFAULT.iconSize
    && itemRangeIsDefault()
    && (it.angle == null || it.angle === 0);


  const refreshDefault = () => {
    defCb.checked = !it.hideIcon
      && (it.iconSize ?? TAC_MANAGE_DEFAULT.iconSize)
        === TAC_MANAGE_DEFAULT.iconSize
      && itemRangeIsDefault()
      && (it.angle == null || it.angle === 0);
  };

  // 动画工具：管理卡片只保留「动画管理」，隐藏范围/图标等其它设置卡片
  if (tacTool === 'anim') {
    buildTacAnimBox(settings, it);
    return;
  }


  if (it.kind === 'aquaMirror' || it.kind === 'mirrorImage') {
    buildMirrorManageBox(settings, it);
  }
  if (it.kind === 'spearfishing') {
    buildAbyssManageBox(settings, it);
  }
  if (it.kind === TAC_HP_KIND) {
    buildHittingPointBox(settings, it);
  }
  if (it.kind === 'timeBomb' || it.kind === 'remoteControlledBomb') {
    buildAngleManageBox(settings, it, idx);
  }


  if (it.kind !== 'aquaMirror' && it.kind !== 'mirrorImage'
    && it.kind !== 'spearfishing'
    && (itDef.linkToRole || tacSameLinkable(itDef))) {
    buildLinkManageBox(settings, it, {
      cross: !!itDef.linkToRole,
      roleName: itDef.linkToRole ? (TAC_ROLES[itDef.linkToRole] || {}).name : null,
      itemName: itDef.name,
      maxM: itDef.linkMaxM,
    });
  }

  if (rgCfg) {
    buildTacRangeRows(settings, rgCfg, it, false,
      { softUpdate: () => { syncCircleWidth(); refreshDefault(); },
        hostRole: it.role,
        groupKind: 'item',
        defFill: !!itDef.fill,
        labelPrefix: translate("common.show"),
        labelPostfix: translate("common.range") });
  }


  const row = document.createElement('div');
  row.className = 'tac-manage-row';
  row.innerHTML =
    `<label class="tac-manage-slider">${translate("application.common.icon.size")}`
    + `<input type="range" min="1.5" max="10" step="0.2" value="${curIcon}"></label>`
    + `<label class="tac-manage-hide"><input type="checkbox"`
    + `${it.hideIcon ? ' checked' : ''}>${translate("application.common.icon.hide")}</label>`
    + `<label class="tac-manage-glow"><input type="checkbox"`
    + `${it.glow ? ' checked' : ''}>${translate("application.common.highlight")}</label>`
    + `<label class="tac-manage-def"><input type="checkbox"`
    + `${isDefault ? ' checked' : ''}>${translate("common.default")}</label>`
    + `<button type="button" class="tac-manage-del">${translate("common.delete")}</button>`;
  settings.appendChild(row);
  const sizeSlider = row.querySelector('input[type="range"]');
  const [hideCb, glowCb, defCb] = row.querySelectorAll('input[type="checkbox"]');

  sizeSlider.addEventListener('input', () => {
    it.iconSize = parseFloat(sizeSlider.value);
    const el = tacMapWrap.querySelector(
      `.tac-item-circle[data-idx="${idx}"] img, .tac-item-pin[data-idx="${idx}"] img`);
    if (el) {
      const px = it.iconSize / 100 * tacMapWrap.clientWidth;
      el.style.width = `${px}px`;
      el.style.height = `${px}px`;
    }
    refreshDefault();
  });
  hideCb.addEventListener('change', () => {
    it.hideIcon = hideCb.checked;
    renderTacBoard();
  });

  glowCb.addEventListener('change', () => {
    it.glow = glowCb.checked;
    renderTacBoard();
  });
  defCb.addEventListener('change', () => {
    if (!defCb.checked) return;


    delete it.rangeMode;
    delete it.rangeMeters;
    delete it.hideRange;
    delete it.meters;
    delete it.fearHunter;
    delete it.fearSurv;
    delete it.rangeBox;
    delete it.angle;it.iconSize = TAC_MANAGE_DEFAULT.iconSize;
    it.hideIcon = false;
    renderTacBoard();
  });

  row.querySelector('.tac-manage-del').addEventListener('click', () => {
    const removed = board.items[idx];
    board.items.splice(idx, 1);
    tacOnItemRemoved(removed);
    tacUndoStack.push({ type: 'delItem', item: { ...removed }, idx });
    if (tacSelectedItem === idx) setTacSelectedItem(null);
    tacManageSel = null;
    renderTacBoard();
  });
}

export function setTacManageSel(value) {
  tacManageSel = value;
  return value;
}

export {
  buildTacRangeRows,
  renderTacManage,
  tacAqOfHost,
  tacBoxHint,
  tacInstDispName,
  tacManageBox,
  tacManageSel,
  tacSortedEntries,
};
