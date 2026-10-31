import { parseHandoff, surfaceCandidates } from './handoff-protocol.js';

const host = document.createElement('section');
host.className = 'pil-handoff';
host.dataset.state = 'loading';
const back = document.createElement('a');
back.className = 'pil-handoff-back';
back.href = location.pathname.startsWith('/zhanshuyanlian/3d/') ? '/zhanshuyanlian/' : '/tactical-friend/';
back.textContent = '← 返回二维战术板';
const status = document.createElement('p');
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');
const rows = document.createElement('div');
host.append(back, status, rows);
document.querySelector('.panel')?.prepend(host);

async function ready() {
  const deadline = performance.now() + 60000;
  while (performance.now() < deadline) {
    if (window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready && window.tacticsAPI.planar) return;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('三维地图尚未载入完成，请重新载入或稍后重试。');
}

async function start() {
  const scene = JSON.parse(document.querySelector('#map-info').textContent).mapId;
  const response = await fetch(new URL('./board-calibration.json', import.meta.url));
  if (!response.ok) throw Error('无法载入地图坐标，请重新载入。');
  const profile = (await response.json()).maps.find(p => p.scene === scene);
  if (profile) back.href += '?map=' + profile.mapId;
  const endpoints = parseHandoff(location.hash, profile);
  status.textContent = endpoints ? '正在载入三维地图，随后同步测距起终点…' : '';
  await ready();
  const api = window.measureAPI, planar = window.tacticsAPI.planar;
  planar.setMode('3d');
  if (!endpoints) { host.dataset.state = 'map-only'; return; }
  const layers = [...document.querySelector('#planar-floor').options].map(o => ({ id: o.value, label: o.textContent }));
  const originalLayer = planar.getState().layerId;
  const selections = [];
  for (const [which, point] of Object.entries(endpoints)) {
    const candidates = surfaceCandidates(point, profile, layers, (layer, p) => {
      planar.setLayer(layer);
      return planar.locate(p);
    });
    const label = which === 'start' ? '起点 A' : '终点 B';
    const record = { which, label, candidates, chosen: candidates.length === 1 ? candidates[0] : null, applied: false };
    selections.push(record);
    if (candidates.length > 1) {
      const row = document.createElement('label');
      row.textContent = label + '：请选择楼层';
      const select = document.createElement('select');
      select.dataset.endpoint = which;
      select.setAttribute('aria-label', label + '楼层');
      select.add(new Option('请选择楼层', ''));
      candidates.forEach((candidate, i) => select.add(new Option(candidate.layer.label, String(i))));
      select.addEventListener('change', () => {
        record.chosen = select.value === '' ? null : candidates[Number(select.value)];
        record.applied = false;
        // Removing this floor choice clears only this logical endpoint. Preserve
        // any edits the user has already made to the other endpoint.
        if (!record.chosen) {
          const other = which === 'start' ? 'end' : 'start', retained = api.stats()[other];
          api.clear();
          if (retained) api.setPoint(other, retained);
        }
        apply();
      });
      row.append(select); rows.append(row);
    } else if (!candidates.length) {
      const message = document.createElement('p');
      message.textContent = label + '在此位置没有可用通行面，原二维选点已保留。';
      const repick = document.createElement('button');
      repick.type = 'button'; repick.className = 'secondary';
      repick.textContent = '在三维重选' + label;
      repick.addEventListener('click', () => api.setMode(which));
      rows.append(message, repick);
    }
  }
  planar.setLayer(originalLayer);
  function apply() {
    const selected = [];
    for (const record of selections) {
      if (!record.chosen || record.applied) continue;
      const result = api.setPoint(record.which, record.chosen.hit);
      record.applied = result.status === 'ok';
      if (record.applied) selected.push(record.chosen.hit.point);
    }
    if (selected.length) {
      const points = selections.filter(s => s.applied).map(s => s.chosen.hit.point);
      window.viewerAPI.focusBounds([0, 1].map(side => [0, 1, 2].map(axis =>
        (side ? Math.max(...points.map(p => p[axis])) : Math.min(...points.map(p => p[axis]))) + (side ? 45 : -45))));
    }
    const ambiguous = selections.some(s => s.candidates.length > 1 && !s.chosen);
    const complete = selections.every(s => s.applied);
    host.dataset.state = ambiguous ? 'awaiting-floor' : complete ? 'applied' : 'partial';
    status.textContent = ambiguous ? '二维选点在此处对应多个楼层，请确认楼层后计算。'
      : complete ? (endpoints.end ? '已同步起终点，三维路线按当前场景重新计算。' : '已同步起点 A，请在三维选择终点 B。')
      : '部分选点未通过当前场景的通行面校验，请在三维重新选点；二维记录已保留。';
    api.setMode(!endpoints.end && complete ? 'end' : 'browse');
  }
  apply();
}

start().catch(error => {
  host.dataset.state = 'invalid';
  status.textContent = error.message || '选点导入失败，请从二维工具重新进入。';
});
