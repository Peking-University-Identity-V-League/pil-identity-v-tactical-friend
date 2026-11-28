import {
  tacColorsEl,
  tacShapesEl,
  tacTextAddBtn,
  tacTextColorsEl,
  tacTextHint,
  tacTextList,
  tacTextSizeEl,
  tacTextSizeVal,
  tacTextStyle,
  tacWidthEl,
  tacWidthVal,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { tacBoard } from '../core/persist.js';
import { TAC_SVG_NS } from '../data/tactic-data.js';
import { renderTacBoard } from './board.js';
import { setTacPlaceItem, setTacPlaceRole, tacUndoStack } from './selection.js';

export function arrowNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  const headLen = Math.min(a.width * 4.2, len * 0.8);
  const headW = a.width * 3;
  const bx = x2 - ux * headLen, by = y2 - uy * headLen;

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'line');
  hit.setAttribute('x1', x1); hit.setAttribute('y1', y1);
  hit.setAttribute('x2', x2); hit.setAttribute('y2', y2);
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const line = document.createElementNS(TAC_SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', bx); line.setAttribute('y2', by);
  line.setAttribute('stroke', a.color);
  line.setAttribute('stroke-width', a.width);
  line.setAttribute('stroke-linecap', 'round');

  const head = document.createElementNS(TAC_SVG_NS, 'polygon');
  head.setAttribute('points',
    `${x2},${y2} ${bx + px * headW / 2},${by + py * headW / 2} `
    + `${bx - px * headW / 2},${by - py * headW / 2}`);
  head.setAttribute('fill', a.color);

  g.append(hit, line, head);
  return g;
}


export function circleNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
  const rx = Math.abs(x2 - x1) / 2, ry = Math.abs(y2 - y1) / 2;

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'ellipse');
  hit.setAttribute('cx', cx); hit.setAttribute('cy', cy);
  hit.setAttribute('rx', rx); hit.setAttribute('ry', ry);
  hit.setAttribute('fill', 'none');
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const ring = document.createElementNS(TAC_SVG_NS, 'ellipse');
  ring.setAttribute('cx', cx); ring.setAttribute('cy', cy);
  ring.setAttribute('rx', rx); ring.setAttribute('ry', ry);
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', a.color);
  ring.setAttribute('stroke-width', a.width);
  ring.setAttribute('stroke-dasharray', `${a.width * 3} ${a.width * 2}`);

  g.append(hit, ring);
  return g;
}


export function rectNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'rect');
  hit.setAttribute('x', x); hit.setAttribute('y', y);
  hit.setAttribute('width', w); hit.setAttribute('height', h);
  hit.setAttribute('fill', 'none');
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const box = document.createElementNS(TAC_SVG_NS, 'rect');
  box.setAttribute('x', x); box.setAttribute('y', y);
  box.setAttribute('width', w); box.setAttribute('height', h);
  box.setAttribute('fill', 'none');
  box.setAttribute('stroke', a.color);
  box.setAttribute('stroke-width', a.width);
  box.setAttribute('stroke-dasharray', `${a.width * 3} ${a.width * 2}`);

  g.append(hit, box);
  return g;
}


export function lineNode(a, W, H, idx) {
  const x1 = a.x1 * W, y1 = a.y1 * H;
  const x2 = a.x2 * W, y2 = a.y2 * H;

  const g = document.createElementNS(TAC_SVG_NS, 'g');
  if (idx >= 0) g.dataset.idx = idx;

  const hit = document.createElementNS(TAC_SVG_NS, 'line');
  hit.setAttribute('x1', x1); hit.setAttribute('y1', y1);
  hit.setAttribute('x2', x2); hit.setAttribute('y2', y2);
  hit.setAttribute('stroke', 'rgba(0,0,0,0)');
  hit.setAttribute('stroke-width', Math.max(16, a.width * 4));

  const line = document.createElementNS(TAC_SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', a.color);
  line.setAttribute('stroke-width', a.width);
  line.setAttribute('stroke-linecap', 'round');

  g.append(hit, line);
  return g;
}


export function shapeNode(a, W, H, idx) {
  if (a.shape === 'line') return lineNode(a, W, H, idx);
  if (a.shape === 'circle') return circleNode(a, W, H, idx);
  if (a.shape === 'rect') return rectNode(a, W, H, idx);
  return arrowNode(a, W, H, idx);
}

let tacArrowColor = '#ef4444';

let tacArrowWidth = 2;

let tacDrawShape = 'arrow';

let tacDrawing = null;

let tacSelectedText = null;

let tacDragText = null;

let tacTextPlacing = false;

function tacHexRgba(hex, a) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function updateTacTextUi() {
  tacTextAddBtn.classList.toggle('active', tacTextPlacing);
  tacTextAddBtn.textContent = tacTextPlacing ? translate("ui.tac.text.add.button2") : translate("ui.tac.text.add.button");
  tacTextHint.textContent = tacTextPlacing
    ? translate("ui.tac.text.note2")
    : translate("ui.tac.text.note");
}

function renderTacTextList() {

  const ae = document.activeElement;
  if (ae && ae.tagName === 'INPUT' && tacTextList.contains(ae)) return;
  const texts = tacBoard().texts;
  tacTextList.innerHTML = '';
  if (!texts.length) {
    tacTextList.innerHTML =
      `<div class="tac-manage-empty">${translate("ui.tac.text.add.status")}</div>`;
    return;
  }
  if (tacSelectedText !== null && !texts[tacSelectedText]) tacSelectedText = null;
  texts.forEach((t, idx) => {
    const row = document.createElement('div');
    row.className = 'tac-text-row' + (tacSelectedText === idx ? ' sel' : '');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = t.text;
    input.maxLength = 60;
    input.addEventListener('input', () => {
      t.text = input.value;
      renderTacBoard();
    });
    input.addEventListener('focus', () => {
      tacSelectedText = idx;

      tacTextStyle.color = t.color;
      tacTextStyle.size = t.size;
      tacTextSizeEl.value = t.size;
      tacTextSizeVal.textContent = t.size;
      tacTextColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b.dataset.color === t.color));
      renderTacBoard();
      renderTacTextList();
    });
    const done = document.createElement('button');
    done.className = 'tac-text-done';
    done.type = 'button';
    done.textContent = '√';
    done.title = translate("ui.tac.text.add.confirm.message");
    done.addEventListener('click', () => {
      if (tacSelectedText === idx) tacSelectedText = null;
      if (document.activeElement && tacTextList.contains(document.activeElement))
        document.activeElement.blur();
      renderTacBoard();
    });
    const del = document.createElement('button');
    del.className = 'tac-text-del';
    del.type = 'button';
    del.textContent = '✕';
    del.title = translate("ui.tac.text.add.delete.message");
    del.addEventListener('click', () => {
      const removed = tacBoard().texts[idx];
      tacBoard().texts.splice(idx, 1);
      tacUndoStack.push({ type: 'delText', text: { ...removed }, idx });
      if (tacSelectedText === idx) tacSelectedText = null;
      renderTacBoard();
    });
    row.append(input, done, del);
    tacTextList.appendChild(row);
  });
}

export function setTacDragText(value) {
  tacDragText = value;
  return value;
}

export function setTacDrawing(value) {
  tacDrawing = value;
  return value;
}

export function setTacSelectedText(value) {
  tacSelectedText = value;
  return value;
}

export function setTacTextPlacing(value) {
  tacTextPlacing = value;
  return value;
}

export function bindDrawingTools() {
  tacShapesEl.querySelectorAll('.tac-shape').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacDrawShape = btn.dataset.shape;
      tacShapesEl.querySelectorAll('.tac-shape').forEach((b) =>
        b.classList.toggle('active', b === btn));
    });
  });

  tacColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacArrowColor = btn.dataset.color;
      tacColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b === btn));
    });
  });

  tacWidthEl.addEventListener('input', () => {
    tacArrowWidth = parseInt(tacWidthEl.value, 10);
    tacWidthVal.textContent = tacArrowWidth;
  });

  tacTextColorsEl.querySelectorAll('.tac-color').forEach((btn) => {
    btn.addEventListener('click', () => {
      tacTextStyle.color = btn.dataset.color;
      tacTextColorsEl.querySelectorAll('.tac-color').forEach((b) =>
        b.classList.toggle('active', b === btn));

      if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
        tacBoard().texts[tacSelectedText].color = btn.dataset.color;
        renderTacBoard();
      }
    });
  });

  tacTextSizeEl.addEventListener('input', () => {
    tacTextStyle.size = parseInt(tacTextSizeEl.value, 10);
    tacTextSizeVal.textContent = tacTextStyle.size;
    if (tacSelectedText !== null && tacBoard().texts[tacSelectedText]) {
      tacBoard().texts[tacSelectedText].size = tacTextStyle.size;
      renderTacBoard();
    }
  });

  tacTextAddBtn.addEventListener('click', () => {
    if (tacTextPlacing) {
      tacTextPlacing = false;
    } else {
      tacTextPlacing = true;
      setTacPlaceRole(null);
      setTacPlaceItem(null);
    }
    updateTacTextUi();
  });
}

export {
  renderTacTextList,
  tacArrowColor,
  tacArrowWidth,
  tacDragText,
  tacDrawShape,
  tacDrawing,
  tacHexRgba,
  tacSelectedText,
  tacTextPlacing,
  updateTacTextUi,
};
