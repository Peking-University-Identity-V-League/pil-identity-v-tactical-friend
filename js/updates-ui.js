import { UPDATE_NOTES } from './updates.js';

// 简易 Markdown 渲染：只支持公告用到的语法，渲染前转义 HTML。
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderUpdateNotes(md) {
  const inline = (s) => escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const html = [];
  let inList = null;
  const closeList = () => { if (inList) { html.push(`</${inList}>`); inList = null; } };
  for (const raw of md.split('\n')) {
    const t = raw.trim();
    if (!t) { closeList(); continue; }
    let m;
    if ((m = t.match(/^(#{1,3})\s+(.*)$/))) {
      closeList();
      const lv = m[1].length;
      html.push(`<h${lv + 1} class="upd-h">${inline(m[2])}</h${lv + 1}>`);
    } else if ((m = t.match(/^[-*]\s+(.*)$/))) {
      if (inList !== 'ul') { closeList(); html.push('<ul class="upd-list">'); inList = 'ul'; }
      html.push(`<li>${inline(m[1])}</li>`);
    } else if ((m = t.match(/^\d+[.、)]\s*(.*)$/))) {
      if (inList !== 'ol') { closeList(); html.push('<ol class="upd-list">'); inList = 'ol'; }
      html.push(`<li>${inline(m[1])}</li>`);
    } else {
      closeList();
      html.push(`<p class="upd-p">${inline(t)}</p>`);
    }
  }
  closeList();
  return html.join('');
}

export function initUpdatesUI() {
  const btn = document.getElementById('footerUpdatesBtn');
  const overlay = document.getElementById('updatesOverlay');
  if (!btn || !overlay) return;
  const body = overlay.querySelector('.updates-body');
  const open = () => {
    if (body && !body.dataset.loaded) {
      body.innerHTML = renderUpdateNotes(UPDATE_NOTES);
      body.dataset.loaded = '1';
    }
    overlay.hidden = false;
  };
  const close = () => { overlay.hidden = true; };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (overlay.hidden) open();
    else close();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  const closeBtn = overlay.querySelector('.updates-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
}
