// Pageviews only. Never forward handoff coordinates, annotations or URL tokens.
(function () {
  const website = 'd8c95849-978e-48d7-ba4d-7a783397609b';
  const scenes = new Set(['h55_chinatown', 'h55_deadforest_sp', 'h55_demo', 'h55_demo2',
    'h55_fishingvillage', 'h55_hospital2', 'h55_playground', 'h55_sleepingtown3',
    'ordnance_factory1', 'ordnance_factory2']);
  const match = location.pathname.match(/^\/(tactical-friend|zhanshuyanlian)\/3d\/(?:([a-z0-9_]+)\.html)?$/);
  const valid = match && (!match[2] || match[2] === 'index' || scenes.has(match[2]));
  const enabled = () => location.hostname === 'pkuidv.com' && valid
    && ![navigator.doNotTrack, navigator.msDoNotTrack, window.doNotTrack].includes('1');
  window.pilMapsBeforeSend = function (type, payload) {
    if (!enabled() || type !== 'event' || !payload || payload.website !== website || payload.name) return false;
    const result = {
      website, hostname: 'pkuidv.com', tag: 'tactical-3d',
      title: '第五人格三维地图',
      url: '/' + match[1] + '/3d/' + (scenes.has(match[2]) ? match[2] + '.html' : ''),
    };
    if (/^[a-zA-Z-]{2,35}$/.test(payload.language || '')) result.language = payload.language;
    if (/^\d{1,5}x\d{1,5}$/.test(payload.screen || '')) result.screen = payload.screen;
    try { if (payload.referrer) result.referrer = new URL(payload.referrer).origin; } catch {}
    return result;
  };
  if (!enabled()) return;
  const tracker = document.createElement('script');
  tracker.async = true;
  tracker.src = 'https://umami.pkuidv.com/script.js';
  for (const [key, value] of Object.entries({
    'data-website-id': website, 'data-domains': 'pkuidv.com', 'data-tag': 'tactical-3d',
    'data-exclude-search': 'true', 'data-exclude-hash': 'true', 'data-do-not-track': 'true',
    'data-before-send': 'pilMapsBeforeSend',
  })) tracker.setAttribute(key, value);
  document.head.append(tracker);
})();
