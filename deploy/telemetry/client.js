import { boardFingerprint, summarizeBoard } from './summary.js';

const modes = new Set(['tactic', 'region', 'deduce']);
const tools = new Set(['select', 'roles', 'draw', 'measure', 'display', 'delete']);
const entry = location.pathname.startsWith('/zhanshuyanlian') ? 'zhanshuyanlian' : 'tactical-friend';
const disabled = () => location.hostname !== 'pkuidv.com'
  || navigator.doNotTrack === '1' || navigator.msDoNotTrack === '1';
const pending = [];
const lastEvents = new Map();

function emit(name, data) {
  if (disabled()) return;
  const key = name + ':' + [data.map_id, data.mode, data.tool, data.role, data.item].join(':');
  const now = Date.now();
  if (now - (lastEvents.get(key) || 0) < 1000) return;
  lastEvents.set(key, now);
  const event = [name, { ...data, entry }];
  if (typeof window.umami?.track !== 'function') {
    if (pending.length < 32) pending.push(event);
    return;
  }
  try { Promise.resolve(window.umami.track(...event)).catch(() => {}); } catch {}
}

async function start(attempt = 0) {
  if (disabled()) return;
  if (!document.querySelector('#homeMapGrid')?.children.length) {
    if (attempt < 120) setTimeout(() => start(attempt + 1), 250);
    return;
  }
  try {
    const [{ S }, { tacBoards }, definitions] = await Promise.all([
      import('../js/core/state.js'), import('../js/core/persist.js'), import('../js/data/tactic-data.js'),
    ]);
    const roles = new Set(Object.keys(definitions.TAC_ROLES || {}));
    const items = new Set(Object.keys(definitions.TAC_ITEM_TYPES || {}));
    const sessions = new Map();
    let activeMap = null;
    let activeMode = null;

    const context = () => ({ map_id: S.currentMapId, mode: S.currentTab });
    const board = () => tacBoards[S.currentMapId] || {};
    const isEditingView = () => document.querySelector('#tacticView')?.classList.contains('active');

    function flush(reason, force = false) {
      const session = sessions.get(activeMap);
      if (!session?.dirty || (!force && Date.now() - session.sent < 15000)) return;
      emit('tf_edit_summary', {
        map_id: activeMap, mode: activeMode, reason,
        ...summarizeBoard(tacBoards[activeMap] || {}),
        state_changes: Math.min(10000, session.changes),
        elapsed_seconds: Math.min(86400, Math.round((Date.now() - session.started) / 10000) * 10),
      });
      session.dirty = false;
      session.sent = Date.now();
    }

    function sample() {
      if (disabled()) { pending.length = 0; return; }
      if (typeof window.umami?.track === 'function') {
        for (const event of pending.splice(0)) {
          try { Promise.resolve(window.umami.track(...event)).catch(() => {}); } catch {}
        }
      }
      const home = document.querySelector('#homeView')?.classList.contains('active');
      if (home || !Number.isInteger(S.currentMapId) || S.currentMapId < 0 || S.currentMapId > 8
          || !modes.has(S.currentTab)) {
        if (activeMap !== null) flush('navigation', true);
        activeMap = null;
        activeMode = null;
        return;
      }
      if (activeMap !== S.currentMapId) {
        flush('navigation', true);
        activeMap = S.currentMapId;
        emit('tf_map_open', context());
        const previous = sessions.get(activeMap);
        sessions.set(activeMap, previous || { started: 0, changes: 0, dirty: false, sent: 0 });
        sessions.get(activeMap).fingerprint = boardFingerprint(board());
      }
      if (activeMode !== S.currentTab) {
        activeMode = S.currentTab;
        emit('tf_mode_change', context());
      }
      const session = sessions.get(activeMap);
      const fingerprint = boardFingerprint(board());
      if (isEditingView() && fingerprint !== null && session.fingerprint !== null
          && fingerprint !== session.fingerprint) {
        session.changes += 1;
        session.dirty = true;
        session.changed = Date.now();
        if (!session.started) {
          session.started = Date.now();
          emit('tf_edit_start', { ...context(), ...summarizeBoard(board()) });
        }
      }
      session.fingerprint = fingerprint;
      if (session.dirty && Date.now() - session.changed >= 5000) flush('idle');
    }

    document.addEventListener('click', (event) => {
      const element = event.target?.closest?.('button, .home-card');
      if (!element || element.disabled) return;
      const tool = element.dataset.tool;
      const role = element.classList.contains('tac-role') ? element.dataset.role : null;
      const item = element.classList.contains('tac-item') ? element.dataset.kind : null;
      const id = element.id;
      setTimeout(() => {
        try {
          sample();
          if (activeMap === null) return;
          if (tools.has(tool)) emit('tf_tool_select', { ...context(), tool });
          if (roles.has(role)) emit('tf_role_pick', { ...context(), role });
          if (items.has(item)) emit('tf_item_pick', { ...context(), item });
          if (id === 'tacExportBtn') {
            emit('tf_export_request', { ...context(), ...summarizeBoard(board()), via: 'button' });
            flush('export', true);
          }
          if (id === 'tacUndoBtn') emit('tf_undo_request', { ...context(), via: 'button' });
          if (id === 'tacClearBtn') emit('tf_clear_request', { ...context(), via: 'button' });
        } catch {}
      }, 0);
    }, { capture: true, passive: true });
    for (const type of ['pointerup', 'change', 'keyup']) {
      document.addEventListener(type, () => { try { sample(); } catch {} }, { passive: true });
    }
    document.addEventListener('keydown', (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.key.toLowerCase() !== 'z'
          || !isEditingView() || event.target?.closest?.('input, textarea, [contenteditable="true"]')) return;
      setTimeout(() => {
        try { sample(); emit('tf_undo_request', { ...context(), via: 'keyboard' }); } catch {}
      }, 0);
    }, { capture: true, passive: true });
    document.addEventListener('visibilitychange', () => {
      try { if (document.visibilityState === 'hidden') flush('hidden', true); } catch {}
    });
    setInterval(() => {
      try { if (document.visibilityState === 'visible') sample(); } catch {}
    }, 1000);
    sample();
  } catch {
    // Analytics must never prevent the application from starting or editing.
  }
}

start();
