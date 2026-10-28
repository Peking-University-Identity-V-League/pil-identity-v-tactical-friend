(function () {
  const website = 'd8c95849-978e-48d7-ba4d-7a783397609b';
  const events = new Set(['tf_map_open', 'tf_mode_change', 'tf_tool_select', 'tf_role_pick',
    'tf_item_pick', 'tf_edit_start', 'tf_edit_summary', 'tf_export_request',
    'tf_undo_request', 'tf_clear_request']);
  const categories = {
    entry: ['tactical-friend', 'zhanshuyanlian'],
    mode: ['tactic', 'region', 'deduce'],
    tool: ['select', 'roles', 'draw', 'measure', 'display', 'delete'],
    reason: ['idle', 'export', 'navigation', 'hidden'],
    via: ['button', 'keyboard'],
  };
  const numeric = new Set(['role_count', 'item_count', 'arrow_count', 'text_count',
    'measure_count', 'state_changes', 'elapsed_seconds',
    'zone_1', 'zone_2', 'zone_3', 'zone_4', 'zone_5', 'zone_6', 'zone_7', 'zone_8', 'zone_9']);

  window.pkuidvTelemetryBeforeSend = function (type, payload) {
    if (type !== 'event' || !payload || payload.website !== website
        || window.location.hostname !== 'pkuidv.com') return false;
    const result = {
      website,
      hostname: 'pkuidv.com',
      title: '第五人格战术演练学习工具',
      url: window.location.pathname,
      tag: 'tactical-friend',
    };
    if (/^[a-zA-Z-]{2,35}$/.test(payload.language || '')) result.language = payload.language;
    if (/^\d{1,5}x\d{1,5}$/.test(payload.screen || '')) result.screen = payload.screen;
    try { if (payload.referrer) result.referrer = new URL(payload.referrer).origin; } catch {}
    if (!payload.name) return result;
    if (!events.has(payload.name)) return false;
    result.name = payload.name;
    result.data = { application: 'tactical-friend' };
    const data = payload.data || {};
    for (const [key, values] of Object.entries(categories)) {
      if (values.includes(data[key])) result.data[key] = data[key];
    }
    if (Number.isInteger(data.map_id) && data.map_id >= 0 && data.map_id <= 8) {
      result.data.map_id = data.map_id;
    }
    for (const key of ['role', 'item']) {
      if (typeof data[key] === 'string' && /^[A-Za-z0-9_:.-]{1,50}$/.test(data[key])) {
        result.data[key] = data[key];
      }
    }
    for (const key of numeric) {
      if (Number.isInteger(data[key]) && data[key] >= 0 && data[key] <= 100000) {
        result.data[key] = data[key];
      }
    }
    return result;
  };
})();
