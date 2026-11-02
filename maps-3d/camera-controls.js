import {createRouteDummy} from 'route-dummy';
// V16 module based on the V3.3 camera. Geometry remains in source coordinates.
export function installKeyboardCamera({ THREE, camera, controls, canvas, scene, unitsPerMeter: u,
  isReady, invalidate, getNavigation, getCameraMeshes, getSceneBoxes, getBlockedPolygons, getStartPoint, getWorldCollision = () => null,
  getMovementProfile = () => null, isInputActive = () => true,
  translate = (text, values = {}) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? ''),
  onManualMove = () => {}, onSpeedChange = () => {}, onModeChange = () => {} }) {
  const q = selector => document.querySelector(selector);
  const t = (text, values) => translate(text, values);
  const enabledInput = q('#camera-keyboard-enabled'), speedInput = q('#camera-move-speed');
  const speedOutput = q('#camera-speed-value'), status = q('#camera-mode-status');
  const lockButton = q('#camera-lock'), fromStart = q('#camera-from-start');
  const keys = new Set(), touchKeys = new Set();
  const moveKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE']);
  const shiftKeys = new Set(['ShiftLeft', 'ShiftRight']);
  const right = new THREE.Vector3(), forward = new THREE.Vector3(), motion = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0), ray = new THREE.Raycaster();
  const anchor = new THREE.Vector3(), desired = new THREE.Vector3(), direction = new THREE.Vector3();
  const triangle = new THREE.Triangle(), temp = new THREE.Vector3(), closest = new THREE.Vector3();
  const pitchMin = -Math.PI / 12, pitchMax = Math.PI * .4;
  // Metres; a vertical capsule around the stand-in body and head. The .2m
  // ground clearance lets source navigation follow individual stair treads.
  // This is a browsing avatar, not a measured in-game character hitbox.
  const standingBody = { shape: 'capsule', radius: .23, halfHeight: .825, centerHeight: 1.025 };
  let lastWorldState='';
  let spawnNotice='';
  // Basic survivor running speed: 45 source units/s; 11.85 source units = 1 game metre.
  // BWIKI: 底层机制 and 幸运儿 (checked 2026-10-27).
  const survivorSpeed = 45 / u;
  // Published game-metre values are rounded. Keep verified source rates exact.
  const profiles = [
    { id: 'wildling', name: '野人（未骑乘）', value: 3.65, description: '野人未骑乘时的基础跑动，采用公开近似值 3.65 米/秒。' },
    { id: 'survivor', name: '普通求生者', value: survivorSpeed, description: '普通求生者基础跑动 · 45 坐标单位/秒 ≈ 3.80 游戏米/秒。' },
    { id: 'hunter54', name: '监管一档', value: 54 / u, description: '约 4.56 米/秒，例如小丑、梦之女巫原生与寄生信徒；不含信徒脱控跟随加速。' },
    { id: 'hunter55', name: '监管二档', value: 55 / u, description: '约 4.64 米/秒，例如红夫人；采用无其他加减速的基础移动档位。' },
    { id: 'hunter56', name: '监管三档', value: 56 / u, description: '约 4.73 米/秒，例如厂长、杰克；不含厂长技能加速或杰克雾隐、雾区加速。' },
    { id: 'hullabaloo', name: '喧嚣', value: 5.10, description: '喧嚣基础移动，采用公开近似值 5.10 米/秒，不含其他加减速。' },
    { id: 'dreamwitch', name: '梦之女巫·本体', value: 72 / u, description: '女巫本体约 6.08 米/秒；原生和寄生信徒属于监管一档，不是本体速度。' },
    { id: 'yithian', name: '时空之影·伊斯人', value: 90 / u, description: '伊斯人灵体约 7.59 米/秒，仅选择移速；不改变当前路线的角色交互规则。' },
  ];
  function profileSpeed(profile) {
    const value = profile?.runMetersPerSecond * (profile?.runMultiplier ?? 1);
    return Number.isFinite(value) && value > 0 && value <= 1000 ? value : null;
  }
  let movementProfile = getMovementProfile();
  let speedMode = profileSpeed(movementProfile) !== null ? 'profile' : 'snap';
  let selectedSpeed = profileSpeed(movementProfile) ?? survivorSpeed, lastFreeSpeed = null;
  const speedCustom = q('#camera-speed-custom'), speedPreset = q('#camera-speed-preset');
  const overviewSpeedStorageKey='pil.camera.overview-speed.v1';
  let overviewMetersPerSecond=selectedSpeed;
  try {
    const remembered=Number(localStorage.getItem(overviewSpeedStorageKey));
    if(Number.isFinite(remembered)&&remembered>=1&&remembered<=100)overviewMetersPerSecond=remembered;
  } catch (_) { /* Camera controls also work when local storage is unavailable. */ }
  // Older standalone maps contain the previous panel markup. Add this control
  // from the module so both existing pages and future offline builds support it.
  if(!q('#camera-overview-speed-controls')&&typeof document.createElement==='function'){
    const group=document.createElement('section');group.id='camera-overview-speed-controls';group.style.margin='10px 0';
    const label=document.createElement('label');label.className='camera-speed-label';label.htmlFor='camera-overview-speed';
    const title=document.createElement('span');title.dataset.roamingText='';title.textContent='俯瞰移动速度';
    const output=document.createElement('output');output.id='camera-overview-speed-value';output.setAttribute('for','camera-overview-speed');label.append(title,output);
    const slider=document.createElement('input');slider.id='camera-overview-speed';slider.type='range';slider.min='1';slider.max='100';slider.step='any';slider.dataset.roamingAria='俯瞰相机移动速度';
    const numberLabel=document.createElement('label');numberLabel.className='small';numberLabel.htmlFor='camera-overview-speed-custom';
    const numberTitle=document.createElement('span');numberTitle.dataset.roamingText='';numberTitle.textContent='数值（1–100 米/秒）';
    const number=document.createElement('input');number.id='camera-overview-speed-custom';number.type='number';number.min='1';number.max='100';number.step='any';number.dataset.roamingAria='俯瞰相机移动速度数值';numberLabel.append(numberTitle,number);
    const help=document.createElement('p');help.className='small';help.dataset.roamingText='';help.textContent='仅用于俯瞰相机移动；Shift 可临时加速。设置自动保存。';
    group.append(label,slider,numberLabel,help);status.insertAdjacentElement('afterend',group);
  }
  const overviewSpeedControls=q('#camera-overview-speed-controls'),overviewSpeedInput=q('#camera-overview-speed');
  const overviewSpeedCustom=q('#camera-overview-speed-custom'),overviewSpeedOutput=q('#camera-overview-speed-value');
  let mode = 'overview', previousTime = performance.now(), savedOverview = null;
  let actor = null, avatar = null, routeDummy = null, navigation = null, polygons = null, surfaceTriangles = null;
  const surfaceGrid=new Map(),surfaceCellSize=64;
  let yaw = 0, pitch = .22, followDistance = 5.5 * u, drag = null;
  let lastSceneSize = 0, movementBlocked = false, lockFailure = '', obstructionReason = '';
  let routePoseActive = false, lastRouteHeading = null;
  let cameraObstructed = false;
  let contact = null, sliding = false, falling = false, verticalSpeed = 0, fallStart = null, lastLanding = null;
  const gravity = 9.8*u, terminalFallSpeed = 30*u; // Browsing approximation, not game timing.

  function editing(target) {
    if (!(target instanceof Element)) return false;
    return target.isContentEditable || Boolean(target.closest('textarea, select, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit])'));
  }
  function clearKeys() { keys.clear(); touchKeys.clear(); }
  function speed() { return selectedSpeed; }
  function overviewSpeed() {return overviewMetersPerSecond;}
  function updateOverviewSpeed() {
    const value=String(overviewMetersPerSecond);
    overviewSpeedInput.value=value;
    if(document.activeElement!==overviewSpeedCustom)overviewSpeedCustom.value=value;
    overviewSpeedOutput.value=t('{speed} 米/秒',{speed:overviewMetersPerSecond.toFixed(2).replace(/[.]?0+$/,'')});
    overviewSpeedInput.setAttribute('aria-valuetext',overviewSpeedOutput.value);
  }
  function setOverviewSpeed(value) {
    if(!Number.isFinite(value))return false;
    overviewMetersPerSecond=Math.max(1,Math.min(100,value));
    try {localStorage.setItem(overviewSpeedStorageKey,String(overviewMetersPerSecond));} catch (_) { /* Keep the current camera setting without persistence. */ }
    updateOverviewSpeed();invalidate();return true;
  }
  function nearestProfile(value) {
    return profiles.reduce((best, p, i) => Math.abs(p.value - value) < Math.abs(profiles[best].value - value) ? i : best, 0);
  }
  function updateSpeed() {
    const index = nearestProfile(selectedSpeed), profile = profiles[index];
    speedOutput.value = t('{speed} 米/秒', {speed:selectedSpeed.toFixed(2).replace(/[.]?0+$/, '')});
    speedInput.min = speedMode === 'snap' ? '0' : '1'; speedInput.max = speedMode === 'snap' ? String(profiles.length - 1) : '40';
    speedInput.step = speedMode === 'snap' ? '1' : 'any'; speedInput.value = speedMode === 'snap' ? index : selectedSpeed;
    speedInput.disabled = speedMode === 'profile';
    speedInput.setAttribute('aria-valuetext', t('{speed} 米/秒', {speed:selectedSpeed.toFixed(2)}));
    speedPreset.value = profile.id; speedPreset.hidden = speedMode !== 'snap';
    q('#camera-speed-ticks').hidden = speedMode !== 'snap';
    q('#camera-preset-field').hidden = speedMode !== 'snap';
    q('#camera-free-speed').hidden = speedMode !== 'free';
    if (document.activeElement !== speedCustom) speedCustom.value = String(selectedSpeed);
    q('#camera-speed-snap').setAttribute('aria-pressed', String(speedMode === 'snap'));
    q('#camera-speed-free').setAttribute('aria-pressed', String(speedMode === 'free'));
    q('#camera-speed-profile-mode')?.setAttribute('aria-pressed', String(speedMode === 'profile'));
    q('#camera-speed-profile').textContent = speedMode === 'profile' ? t('跟随当前测算角色') : speedMode === 'snap' ? t(profile.name) : t('自由调速');
    q('#camera-speed-note').textContent = (speedMode === 'profile' ? t('采用当前角色的基础跑速与持续倍率；翻越后天赋加速由路线时间轴表现。') : speedMode === 'snap' ? t(profile.description) : t('自定义速度仅用于手动漫游。')) + ' ' + t('Shift 为三倍浏览加速；漫游设置不改变路线计算或播放时间。');
    onSpeedChange();
  }
  function setSpeedMode(next) {
    if (!['profile', 'snap', 'free'].includes(next)) return false;
    if (next === 'profile' && profileSpeed(movementProfile) === null) return false;
    if (next === speedMode) return true;
    if (speedMode === 'free') lastFreeSpeed = selectedSpeed;
    if (next === 'snap') selectedSpeed = profiles[nearestProfile(selectedSpeed)].value;
    else if (next === 'profile') selectedSpeed = profileSpeed(movementProfile);
    else selectedSpeed = Math.max(1, Math.min(40, lastFreeSpeed ?? selectedSpeed));
    speedMode = next; updateSpeed(); return true;
  }
  function syncMovementProfile(profile = getMovementProfile()) {
    if (profileSpeed(profile) === null) return false;
    movementProfile = profile;
    if (speedMode === 'profile') { selectedSpeed = profileSpeed(profile); updateSpeed(); }
    return true;
  }
  function refreshSpeedOptions() {
    speedPreset.innerHTML = profiles.map(p => `<option value="${p.id}">${t(p.name)} · ${t('{speed} 米/秒',{speed:p.value.toFixed(2)})}</option>`).join('');
  }
  function setLanguage() {
    refreshSpeedOptions(); updateSpeed(); updateOverviewSpeed(); updateUI();
  }
  function locked() { return document.pointerLockElement === canvas; }
  function stopRotation() { controls.autoRotate = false; if (q('#rotate')) q('#rotate').checked = false; }
  function updateUI() {
    q('#camera-mode-overview').setAttribute('aria-pressed', String(mode === 'overview'));
    q('#camera-mode-third').setAttribute('aria-pressed', String(mode === 'third'));
    q('#camera-third-tools').hidden = mode !== 'third';
    q('#camera-overview-help').hidden = mode !== 'overview';
    q('#camera-third-help').hidden = mode !== 'third';
    overviewSpeedControls.hidden=mode!=='overview';
    q('#camera-crosshair').hidden = !locked();
    q('#camera-touch-pad').hidden = mode !== 'third';
    if (q('#rotate')) q('#rotate').disabled = mode === 'third';
    lockButton.textContent = t(locked() ? '释放鼠标 · Esc' : '开启鼠标控制');
    const world = getWorldCollision()?.stats();
    const collisionMessage = world?.state === 'loading' ? t('正在载入全图碰撞，完成后可行走。') : world?.state === 'error' ? t('全图碰撞载入失败：{error}。请刷新页面重试。',{error:t(world.error)}) : '';
    status.textContent = mode === 'overview' ? t('俯瞰：鼠标拖动旋转，WASD 水平平移') : collisionMessage || t(lockFailure) ||
      (spawnNotice ? t(spawnNotice)+' ' : '') + t(locked() ? '鼠标控制中 · Esc 释放后可标点' : '光标已释放 · 可标点，或右键拖动环视');
    invalidate();
  }
  function ensureNavigation() {
    if (navigation) return;
    navigation = getNavigation();
    polygons = new Map(navigation.polygons.map(p => [p.id, p]));
    surfaceTriangles = navigation.triangles.map((t, id) => ({ ...t, id })).filter(t => navigable(t.polygon) && t.walkable !== false);
    for(const t of surfaceTriangles){const xs=t.vertices.map(v=>v[0]),zs=t.vertices.map(v=>v[2]);
      for(let x=Math.floor(Math.min(...xs)/surfaceCellSize);x<=Math.floor(Math.max(...xs)/surfaceCellSize);x++)
        for(let z=Math.floor(Math.min(...zs)/surfaceCellSize);z<=Math.floor(Math.max(...zs)/surfaceCellSize);z++){const key=`${x},${z}`;if(!surfaceGrid.has(key))surfaceGrid.set(key,[]);surfaceGrid.get(key).push(t);}}
  }
  function surfacesAt(x,z){return surfaceGrid.get(`${Math.floor(x/surfaceCellSize)},${Math.floor(z/surfaceCellSize)}`)??[];}
  function navigable(id) {
    const p = polygons.get(id);
    return p && p.walkable !== false && (p.flags === undefined || (p.flags & 1)) &&
      (p.area === undefined || p.area === 0) && (p.type === undefined || p.type === 0);
  }
  // Interpolate detail-triangle heights rather than flattening sloped terrain.
  function triangleHeight(t, x, z) {
    const [a, b, c] = t.vertices;
    const bx = b[0] - a[0], bz = b[2] - a[2], cx = c[0] - a[0], cz = c[2] - a[2];
    const den = bx * cz - bz * cx;
    if (Math.abs(den) < 1e-9) return null;
    const px = x - a[0], pz = z - a[2];
    const s = (px * cz - pz * cx) / den, t2 = (bx * pz - bz * px) / den;
    // Detour hull portals and detail edges differ by tiny rounding errors.
    // Test distance in SOURCE UNITS, matching the existing route solver, rather
    // than a fixed barycentric tolerance that rejects short stair triangles.
    const area = Math.abs(den);
    const outside = Math.max(0, -s * area / Math.hypot(cx, cz), -t2 * area / Math.hypot(bx, bz),
      -(1 - s - t2) * area / Math.hypot(c[0] - b[0], c[2] - b[2]));
    if (outside > 2e-4) return null;
    return a[1] + s * (b[1] - a[1]) + t2 * (c[1] - a[1]);
  }
  function onPolygon(id, x, z, nearY) {
    const p = polygons.get(id);
    if (!navigable(id) || getBlockedPolygons().has(id)) return null;
    let best = null;
    for (const triangleId of p.triangles) {
      const y = triangleHeight(navigation.triangles[triangleId], x, z);
      if (y !== null && (!best || Math.abs(y - nearY) < Math.abs(best.point[1] - nearY)))
        best = { point: [x, y, z], polygonId: id, triangleId };
    }
    return best;
  }
  function nearestSurface(point, polygonId) {
    ensureNavigation(); temp.fromArray(point);
    let best = null, bestDistance = Infinity;
    for (const t of surfaceTriangles) {
      if ((polygonId !== undefined && polygonId !== t.polygon) || getBlockedPolygons().has(t.polygon)) continue;
      triangle.a.fromArray(t.vertices[0]); triangle.b.fromArray(t.vertices[1]); triangle.c.fromArray(t.vertices[2]);
      triangle.closestPointToPoint(temp, closest);
      const distance = closest.distanceToSquared(temp);
      if (distance < bestDistance) {
        bestDistance = distance; best = { point: closest.toArray(), polygonId: t.polygon, triangleId: t.id };
      }
    }
    return best;
  }
  function groundAt(x, z, nearY) {
    let best = null;
    for (const t of surfacesAt(x,z)) {
      const y = triangleHeight(t, x, z);
      // An overhead storey is a ceiling, not a floor to lift this camera onto.
      if (y !== null && y <= nearY + 1.8 * u && (best === null || Math.abs(y - nearY) < Math.abs(best - nearY))) best = y;
    }
    return best;
  }
  function supportAt(x,z,ceiling,bottom=-Infinity) {
    let best=null;
    for(const t of surfacesAt(x,z)){
      const y=triangleHeight(t,x,z);
      if(y===null||y>ceiling+2e-4||y<bottom||best&&y<=best.point[1])continue;
      best={point:[x,y,z],polygonId:t.polygon,triangleId:t.id,blocked:getBlockedPolygons().has(t.polygon)};
    }
    return best;
  }
  function boundaryContact(start,dx,dz) {
    const p=polygons.get(start.polygonId);if(!p)return null;
    let best=null,distance=Infinity;
    for(let i=0;i<p.vertices.length;i++){
      const a=p.vertices[i],b=p.vertices[(i+1)%p.vertices.length],ex=b[0]-a[0],ez=b[2]-a[2],length2=ex*ex+ez*ez;
      if(length2<1e-12)continue;
      const t=Math.max(0,Math.min(1,((start.point[0]-a[0])*ex+(start.point[2]-a[2])*ez)/length2));
      const d=Math.hypot(start.point[0]-a[0]-t*ex,start.point[2]-a[2]-t*ez);
      let nx=-ez/Math.sqrt(length2),nz=ex/Math.sqrt(length2);
      if(nx*dx+nz*dz>0){nx=-nx;nz=-nz;}
      if(d<distance){distance=d;best={normal:[nx,0,nz],reason:'navigation-boundary'};}
    }
    return best;
  }
  function portalCrossing(a, b, portal, minimumT = 0) {
    const [c, d] = portal, rx = b[0] - a[0], rz = b[2] - a[2];
    const sx = d[0] - c[0], sz = d[2] - c[2], den = rx * sz - rz * sx;
    const qx = c[0] - a[0], qz = c[2] - a[2];
    const tTolerance = 2e-4 / Math.max(Math.hypot(rx, rz), 1e-8);
    const sTolerance = 2e-4 / Math.max(Math.hypot(sx, sz), 1e-8);
    let t, s;
    if (Math.abs(den) < 1e-10) {
      // A walk can follow a tile seam exactly, including a shared fan vertex.
      const length2 = rx * rx + rz * rz;
      if (length2 < 1e-16 || Math.abs(qx * rz - qz * rx) > 2e-4 * Math.sqrt(length2)) return null;
      const t0 = (qx * rx + qz * rz) / length2, t1 = t0 + (sx * rx + sz * rz) / length2;
      t = Math.max(0, minimumT, Math.min(t0, t1));
      if (t > Math.min(1, Math.max(t0, t1)) + tTolerance) return null;
      const edgeLength2 = sx * sx + sz * sz;
      s = edgeLength2 ? ((a[0] + t * rx - c[0]) * sx + (a[2] + t * rz - c[2]) * sz) / edgeLength2 : 0;
    } else {
      t = (qx * sz - qz * sx) / den; s = (qx * rz - qz * rx) / den;
      if (t < minimumT - tTolerance || t < -tTolerance || t > 1 + tTolerance || s < -sTolerance || s > 1 + sTolerance) return null;
    }
    // onPolygon accepts the same tiny source-distance roundoff. If the previous
    // endpoint is already a fraction beyond a seam, cross it at t=0.
    t = THREE.MathUtils.clamp(Math.max(minimumT, t), 0, 1);
    s = THREE.MathUtils.clamp(s, 0, 1);
    return { point: [a[0] + t * rx, c[1] + s * (d[1] - c[1]), a[2] + t * rz], t };
  }
  function throughPortals(start, target) {
    // One short step can cross several thin polygons. At a fan vertex their
    // crossings even have the same t, so checking only one neighbour stalls.
    // Follow only source-verified portals along this segment, in travel order.
    const pending = [{ id: start.polygonId, t: 0, y: start.point[1] }];
    const visited = new Map([[start.polygonId, 0]]);
    for (let i = 0; i < pending.length && i < 128; i++) {
      const current = pending[i];
      if (i) {
        const found = onPolygon(current.id, target[0], target[2], current.y);
        if (found) return found;
      }
      for (const edge of polygons.get(current.id).neighbors || []) {
        if (!navigable(edge.polygon) || getBlockedPolygons().has(edge.polygon)) continue;
        const cross = portalCrossing(start.point, target, edge.portal, current.t);
        if (!cross || (visited.get(edge.polygon) ?? Infinity) <= cross.t + 1e-6) continue;
        const from = onPolygon(current.id, cross.point[0], cross.point[2], current.y);
        const to = from && onPolygon(edge.polygon, cross.point[0], cross.point[2], from.point[1]);
        if (!to || Math.abs(from.point[1] - to.point[1]) > .8 * u) continue;
        visited.set(edge.polygon, cross.t);
        pending.push({ id: edge.polygon, t: Math.max(current.t, cross.t), y: to.point[1] });
      }
    }
    return null;
  }
  // Conservative standing-volume checks for extra scene / basement boxes.
  function blockedByBoxes(a, b) {
    for (const box of getSceneBoxes()) {
      let lo = 0, hi = 1, entryNormal=null;
      for (let i = 0; i < 3; i++) {
        const axis = box.axes[i];
        const extent = box.halfExtents[i] + Math.abs(axis[1]) * standingBody.halfHeight * u + Math.hypot(axis[0], axis[2]) * standingBody.radius * u;
        const origin = (a[0] - box.center[0]) * axis[0] + (a[1] + standingBody.centerHeight * u - box.center[1]) * axis[1] + (a[2] - box.center[2]) * axis[2];
        const delta = (b[0] - a[0]) * axis[0] + (b[1] - a[1]) * axis[1] + (b[2] - a[2]) * axis[2];
        if (Math.abs(delta) < 1e-10) { if (Math.abs(origin) > extent) { hi = -1; break; } }
        else {
          let start = (-extent - origin) / delta, end = (extent - origin) / delta;
          if (start > end) [start, end] = [end, start];
          if(start>=lo){entryNormal=axis.map(v=>v*(delta>0?-1:1));lo=start;}
          hi = Math.min(hi, end); if (lo > hi) break;
        }
      }
      if (lo <= hi && hi >= 0 && lo <= 1) {
        obstructionReason = `scene-box:${box.id}`;
        if(!entryNormal){
          let gap=Infinity;
          for(let i=0;i<3;i++){const axis=box.axes[i];if(Math.hypot(axis[0],axis[2])<.5)continue;
            const d=(a[0]-box.center[0])*axis[0]+(a[1]+standingBody.centerHeight*u-box.center[1])*axis[1]+(a[2]-box.center[2])*axis[2];
            const extent=box.halfExtents[i]+Math.abs(axis[1])*standingBody.halfHeight*u+Math.hypot(axis[0],axis[2])*standingBody.radius*u;
            if(extent-Math.abs(d)<gap){gap=extent-Math.abs(d);entryNormal=axis.map(v=>v*(d>=0?1:-1));}
          }
        }
        contact={normal:entryNormal??[0,1,0],reason:obstructionReason};return true;
      }
    }
    return false;
  }
  function blockedByWorld(a,b) {
    const world=getWorldCollision(),hit=world?.sweep(a,b,standingBody,u);if(!hit)return false;
    obstructionReason=`source-mesh:${hit.faceId}:${hit.objectId}`;
    const normal=world.contactNormal?.(hit.faceId,a,standingBody,u);
    contact={normal:normal??[0,0,0],reason:obstructionReason};return true;
  }
  function safeStandingPoint(candidate) {
    if(!candidate||getBlockedPolygons().has(candidate.polygonId))return false;
    // Querying spawn candidates must not change the live movement diagnostics.
    const savedContact=contact,savedReason=obstructionReason;
    try {
      const p=candidate.point;
      if(blockedByBoxes(p,p)||blockedByWorld(p,p))return false;
      // A clear point can still be isolated in a tiny navigation sliver. Require
      // a grounded one-metre exit using the same portals and swept capsule.
      for(let i=0;i<8;i++){
        const angle=i*Math.PI/4,dx=Math.cos(angle)*u,dz=Math.sin(angle)*u;
        const target=[p[0]+dx,p[1],p[2]+dz];
        const next=onPolygon(candidate.polygonId,target[0],target[2],p[1])||throughPortals(candidate,target);
        if(next&&!getBlockedPolygons().has(next.polygonId)&&Math.abs(next.point[1]-p[1])<=.8*u
          &&!blockedByBoxes(p,next.point)&&!blockedByWorld(p,next.point))return true;
      }
      return false;
    } finally {contact=savedContact;obstructionReason=savedReason;}
  }
  function safeSpawn(reference,{polygonId,nearA=false}={}) {
    const seed=nearestSurface(reference,polygonId);
    if(!seed||nearA&&Math.hypot(...seed.point.map((v,i)=>v-reference[i]))>.5*u)return null;
    if(safeStandingPoint(seed))return seed;
    // Do not move a start to a different storey to escape a collision.
    const [x,y,z]=seed.point;
    for(const radius of [.5,1,2,3,5])for(let i=0;i<16;i++){
      const angle=i*Math.PI/8;
      const candidate=supportAt(x+Math.cos(angle)*radius*u,z+Math.sin(angle)*radius*u,y+.8*u,y-.8*u);
      if(candidate&&!candidate.blocked&&safeStandingPoint(candidate))return candidate;
    }
    if(nearA)return null;
    // The map centre may be inside a large building. For a default entry only,
    // consider nearby same-level triangle interiors in distance order.
    const candidates=surfaceTriangles.filter(t=>!getBlockedPolygons().has(t.polygon)).map(t=>{
      const point=[0,1,2].map(axis=>(t.vertices[0][axis]+t.vertices[1][axis]+t.vertices[2][axis])/3);
      return {point,polygonId:t.polygon,triangleId:t.id,distance:(point[0]-x)**2+(point[2]-z)**2};
    }).filter(p=>Math.abs(p.point[1]-y)<=.8*u).sort((a,b)=>a.distance-b.distance);
    for(const candidate of candidates.slice(0,256))if(safeStandingPoint(candidate))return candidate;
    return null;
  }
  function collisionReadyForSpawn() {
    const state=getWorldCollision()?.stats().state;
    if(state&&state!=='ready'){
      status.textContent=t('全图碰撞尚未就绪，手动行走已暂停。');return false;
    }
    return true;
  }
  function beginFall(start,target) {
    // A nav edge alone cannot distinguish a cliff from a wall. Require lower
    // ground underneath and sweep the body through the edge before leaving.
    const below=supportAt(target[0],target[2],start.point[1]+.05*u);
    if(!below||below.blocked||below.point[1]>=start.point[1]-.8*u)return false;
    if(blockedByBoxes(start.point,target)||blockedByWorld(start.point,target))return false;
    actor={point:target,polygonId:null,triangleId:null};falling=true;verticalSpeed=0;fallStart=start.point.slice();lastLanding=null;return true;
  }
  function tryStep(dx, dz, depth = 0) {
    contact=null;
    const start = actor, [x, y, z] = start.point, target = [x + dx, y, z + dz];
    let next=null;
    if(start.polygonId!==null){next=onPolygon(start.polygonId,target[0],target[2],y);if(!next)next=throughPortals(start,target);}
    else {
      // Source geometry can extend a short distance beyond the authored nav
      // hull. Walk along that actual ledge until the support really ends.
      const nav=supportAt(target[0],target[2],y+.8*u,y-.8*u);
      if(nav&&!nav.blocked)next={point:nav.point,polygonId:nav.polygonId,triangleId:nav.triangleId};
      else if(!nav?.blocked){const floor=getWorldCollision()?.floorAt?.(target[0],target[2],y+.8*u,y-.8*u);
        if(floor)next={point:[target[0],floor.y+.01*u,target[2]],polygonId:null,triangleId:null};}
    }
    if (!next && beginFall(start,target))return true;
    if (!next && !contact) {obstructionReason = 'navigation-boundary';contact=boundaryContact(start,dx,dz);}
    else if (next && Math.abs(next.point[1] - y) > Math.hypot(dx, dz) * 2 + .8 * u) obstructionReason = 'height-discontinuity';
    if (next && Math.abs(next.point[1] - y) <= Math.hypot(dx, dz) * 2 + .8 * u && !blockedByBoxes(start.point, next.point)) {
      if (!blockedByWorld(start.point,next.point)) { actor = next; return true; }
    }
    if (depth < 4 && Math.hypot(dx, dz) > .015 * u) {
      const first = tryStep(dx / 2, dz / 2, depth + 1);
      if(falling)return first;
      const second = first&&tryStep(dx / 2, dz / 2, depth + 1);
      return first || second;
    }
    return false;
  }
  function moveActor(dx, dz) {
    const state = getWorldCollision()?.stats().state;
    if (state && state !== 'ready') { movementBlocked = true; obstructionReason = `source-${state}`; updateUI(); return; }
    const length = Math.hypot(dx, dz), steps = Math.max(1, Math.ceil(length / (.18 * u))), before = actor.point.slice();
    for (let i = 0; i < steps; i++) {
      const previous=actor.point.slice();
      slideStep(dx/steps,dz/steps);
      if(falling)break;
      // At a complete stop every remaining substep has the same constraints.
      // Avoid repeating a blocked high-speed sweep hundreds of times per frame.
      if(Math.hypot(actor.point[0]-previous[0],actor.point[2]-previous[2])<1e-10)break;
    }
    movementBlocked = Math.hypot(actor.point[0] - before[0], actor.point[2] - before[2]) < length * .1;
    if (!movementBlocked) obstructionReason = '';
  }
  function slideStep(dx,dz,air=false) {
    let rx=dx,rz=dz;const normals=[];
    for(let iteration=0;iteration<5&&Math.hypot(rx,rz)>1e-7;iteration++){
      const before=actor.point.slice();contact=null;
      if(air)tryAirStep(rx,rz);else tryStep(rx,rz);
      if(iteration>0&&Math.hypot(actor.point[0]-before[0],actor.point[2]-before[2])>1e-7)sliding=true;
      if(falling&&!air)return;
      rx-=actor.point[0]-before[0];rz-=actor.point[2]-before[2];
      if(!contact||Math.hypot(rx,rz)<1e-7)return;
      const length=Math.hypot(contact.normal[0],contact.normal[2]);if(length<.1)return;
      const n=[contact.normal[0]/length,contact.normal[2]/length];
      normals.push(n);
      const oldLength=Math.hypot(rx,rz);
      // Retain tangent speed, without normalizing it back to running speed.
      for(let pass=0;pass<3;pass++)for(const [nx,nz] of normals){const dot=rx*nx+rz*nz;if(dot<0){rx-=dot*nx;rz-=dot*nz;}}
      if(Math.hypot(rx,rz)<1e-7||oldLength-Math.hypot(rx,rz)<1e-8)return;
    }
  }
  function tryAirStep(dx,dz) {
    const before=actor.point.slice(),target=[before[0]+dx,before[1],before[2]+dz];
    const support=supportAt(target[0],target[2],before[1]+.1*u);
    if(!support||support.blocked){obstructionReason='navigation-boundary';return false;}
    if(!blockedByBoxes(before,target)&&!blockedByWorld(before,target)){actor.point=target;return true;}
    const hit=contact;let lo=0,hi=1;
    for(let i=0;i<9;i++){const t=(lo+hi)/2,p=[before[0]+dx*t,before[1],before[2]+dz*t];
      if(blockedByBoxes(before,p)||blockedByWorld(before,p))hi=t;else lo=t;}
    actor.point=[before[0]+dx*lo,before[1],before[2]+dz*lo];contact=hit;return lo>0;
  }
  function updateFall(dt) {
    if(!falling)return;
    const before=actor.point.slice();
    const nextSpeed=Math.max(-terminalFallSpeed,verticalSpeed-gravity*dt);
    let nextY=before[1]+(verticalSpeed+nextSpeed)*dt/2;verticalSpeed=nextSpeed;
    const support=supportAt(before[0],before[2],before[1]+2e-4,nextY-.05*u);
    if(support&&!support.blocked&&nextY<=support.point[1]){
      nextY=support.point[1];
      if(!blockedByBoxes(before,[before[0],nextY,before[2]])&&!blockedByWorld(before,[before[0],nextY,before[2]])){
        actor={point:support.point,polygonId:support.polygonId,triangleId:support.triangleId};
        falling=false;verticalSpeed=0;lastLanding={from:fallStart,point:actor.point.slice()};obstructionReason='';return;
      }
    }
    const target=[before[0],nextY,before[2]];
    if(!blockedByBoxes(before,target)&&!blockedByWorld(before,target)){actor.point=target;return;}
    // A solid ledge/roof may sit above the navigation. Stay on the safe side
    // of that contact and allow horizontal movement to continue off it.
    let lo=0,hi=1;const hit=contact;
    for(let i=0;i<10;i++){const t=(lo+hi)/2,p=[before[0],before[1]+(nextY-before[1])*t,before[2]];
      if(blockedByBoxes(before,p)||blockedByWorld(before,p))hi=t;else lo=t;}
    actor.point=[before[0],before[1]+(nextY-before[1])*lo,before[2]];contact=hit;verticalSpeed=0;
    if(hit?.normal[1]>.5){
      const floor=getWorldCollision()?.floorAt?.(before[0],before[2],actor.point[1]+.3*u,actor.point[1]-.1*u);
      if(floor){actor={point:[before[0],floor.y+.01*u,before[2]],polygonId:null,triangleId:null};falling=false;lastLanding={from:fallStart,point:actor.point.slice(),sourceSupport:true};obstructionReason='';}
    }
  }
  function makeAvatar() {
    if (avatar) return;
    routeDummy=createRouteDummy(THREE,u);avatar=routeDummy.group;scene.add(avatar);
  }
  function followCamera() {
    if (!actor) return;
    avatar.position.fromArray(actor.point); anchor.fromArray(actor.point); anchor.y += 1.35 * u;
    desired.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    desired.multiplyScalar(followDistance).add(anchor);
    const floor = groundAt(desired.x, desired.z, actor.point[1]);
    desired.y = Math.max(desired.y, actor.point[1] + .4 * u, (floor ?? actor.point[1]) + .4 * u);
    direction.subVectors(desired, anchor); const distance = direction.length(); direction.normalize();
    const meshes = getCameraMeshes();
    ray.set(anchor, direction); ray.near = .15 * u; ray.far = distance;
    let obstruction = ray.intersectObjects(meshes, false)[0]?.distance ?? Infinity;
    // Reverse rays also detect the back of one-sided walls and ceilings.
    ray.set(desired, direction.clone().negate()); ray.near = 0; ray.far = Math.max(0, distance - .15 * u);
    for (const hit of ray.intersectObjects(meshes, false)) obstruction = Math.min(obstruction, distance - hit.distance);
    cameraObstructed = obstruction < distance;
    if (cameraObstructed) desired.copy(anchor).addScaledVector(direction, Math.max(.35 * u, obstruction - .25 * u));
    desired.y = Math.max(desired.y, actor.point[1] + .35 * u);
    camera.position.copy(desired); controls.target.copy(anchor); camera.lookAt(anchor); camera.updateMatrixWorld();
    // Fade out the stand-in when a wall brings the camera close to its body.
    const opacity = THREE.MathUtils.clamp((camera.position.distanceTo(anchor) / u - 1.8) / 1.2, 0, 1);
    avatar.visible = opacity > .01;
    avatar.traverse(child=>{if(!child.isMesh)return;child.material.transparent=true;child.material.opacity=opacity;child.material.depthWrite=opacity>.98;child.material.depthTest=true;child.renderOrder=0;});
    invalidate();
  }
  function releaseMouse() { if (locked()) document.exitPointerLock(); }
  function requestMouse() {
    if (mode !== 'third') return; lockFailure = '';
    if (!canvas.requestPointerLock) { lockFailure = '浏览器不支持鼠标锁定，可按住右键拖动环视。'; updateUI(); return; }
    const failure = () => { lockFailure = '鼠标锁定未成功；可再点一次，或按住右键拖动环视。'; updateUI(); };
    try { canvas.requestPointerLock()?.catch(failure); } catch (_) { failure(); }
  }
  function setMode(nextMode) {
    if (!['overview', 'third'].includes(nextMode) || !isReady()) return false;
    if (mode === nextMode && (mode!=='third'||routePoseActive||falling)) return true;
    const previousMode=mode;
    clearKeys(); drag = null; stopRotation(); lockFailure = '';
    if (nextMode === 'third') {
      ensureNavigation();
      if(!routePoseActive&&!falling){
        if(!collisionReadyForSpawn())return false;
        const reference=actor?.point??controls.target.toArray(),next=safeSpawn(reference);
        if(!next){status.textContent=t('附近没有可安全站立并移动的位置，请换一个位置再进入第三人称。');return false;}
        spawnNotice=Math.hypot(...next.point.map((v,i)=>v-reference[i]))>.1*u?'已将漫游人物放到同层附近可行走的位置。':'';
        actor=next;movementBlocked=false;obstructionReason='';
      }
      if (!actor) { status.textContent = t('没有可用通行面，暂时无法进入第三人称。'); return false; }
      if(previousMode==='third'){followCamera();updateUI();return true;}
      const damping = controls.enableDamping; controls.enableDamping = false; controls.update(); controls.enableDamping = damping;
      savedOverview = { position: camera.position.clone(), target: controls.target.clone(), near: camera.near };
      camera.getWorldDirection(direction); yaw = Math.atan2(direction.x, -direction.z); pitch = .22; controls.enabled = false;
      camera.near = .03 * u; camera.updateProjectionMatrix(); makeAvatar(); avatar.visible = true;
    } else {
      releaseMouse(); avatar.visible = routePoseActive; controls.enabled = true;
      if (savedOverview) { camera.position.copy(savedOverview.position); controls.target.copy(savedOverview.target); camera.near = savedOverview.near; camera.updateProjectionMatrix(); }
      const damping = controls.enableDamping; controls.enableDamping = false; controls.update(); controls.enableDamping = damping;
    }
    mode = nextMode; if (mode === 'third') followCamera(); updateUI(); onModeChange(mode); return true;
  }
  function startFromA() {
    onManualMove();
    const start = getStartPoint();
    if (!start?.point) { status.textContent = t('请先在地图上标记 A 点，再从 A 点出发。'); return false; }
    ensureNavigation();if(!collisionReadyForSpawn())return false;
    const next = safeSpawn(start.point,{polygonId:start.polygonId,nearA:true});
    if (!next) { status.textContent = t('A 点附近没有可安全站立并移动的位置，请重新选择出发位置。'); return false; }
    actor = next; falling=false;verticalSpeed=0;fallStart=null;lastLanding=null;movementBlocked = false; obstructionReason = '';
    if (mode !== 'third'&&!setMode('third'))return false;
    spawnNotice=Math.hypot(...next.point.map((v,i)=>v-start.point[i]))>.1*u?'已从 A 点附近的可行走位置出发，测距点保持原位。':'';
    followCamera(); updateUI(); return true;
  }
  function look(dx, dy) {
    yaw += dx * .0025; yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    pitch = THREE.MathUtils.clamp(pitch + dy * .0025, pitchMin, pitchMax); followCamera();
  }
  function showRoutePose(point, heading, frame={}) {
    if (!Array.isArray(point) || point.length !== 3 || !point.every(Number.isFinite)) return false;
    if (!Number.isFinite(heading)) heading = lastRouteHeading ?? yaw;
    ensureNavigation(); makeAvatar(); routePoseActive = true;
    falling=false;verticalSpeed=0;
    actor = { point: point.slice(), polygonId: null, triangleId: null };
    if (lastRouteHeading === null) yaw = heading;
    else yaw += Math.atan2(Math.sin(heading - lastRouteHeading), Math.cos(heading - lastRouteHeading));
    lastRouteHeading = heading; avatar.position.fromArray(point); avatar.rotation.y = -heading;
    routeDummy.pose(frame);
    movementBlocked = false; obstructionReason = '';
    if (mode === 'third') followCamera();
    else {
      avatar.visible = true;
      // Like the route line, keep the moving marker readable above map layers.
      avatar.traverse(child=>{if(!child.isMesh)return;child.material.opacity=1;child.material.transparent=true;child.material.depthTest=false;child.material.depthWrite=false;child.renderOrder=60;});
      invalidate();
    }
  }
  function releaseRoutePose() {
    if (!routePoseActive) return;
    routePoseActive = false; lastRouteHeading = null;
    routeDummy?.pose();
    // A timed vault or drop can end its preview between storeys. Preserve the
    // current pose on takeover instead of snapping to an unrelated nearest floor.
    const point = actor.point.slice(), support = supportAt(point[0], point[2], point[1] + 2e-4, point[1] - .05 * u);
    actor = support && !support.blocked ? {point, polygonId:support.polygonId, triangleId:support.triangleId} : {point, polygonId:null, triangleId:null};
    falling = !support || support.blocked; verticalSpeed=0; fallStart=falling?point.slice():null;lastLanding=null;
    if (mode === 'third' && actor) followCamera(); else avatar.visible = false;
    invalidate();
  }

  window.addEventListener('keydown', event => {
    if (event.code === 'Escape') { clearKeys(); releaseMouse(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey) { clearKeys(); return; }
    if (!isInputActive()) { clearKeys(); return; }
    if (!enabledInput.checked || !isReady() || event.defaultPrevented || editing(event.target) || editing(document.activeElement)) return;
    if (!moveKeys.has(event.code) && !shiftKeys.has(event.code)) return;
    if (mode === 'third' && ['KeyQ', 'KeyE'].includes(event.code)) return;
    if (moveKeys.has(event.code)) { onManualMove(); event.preventDefault(); stopRotation(); }
    keys.add(event.code); if (event.shiftKey && moveKeys.has(event.code)) keys.add('ShiftLeft');
  });
  window.addEventListener('keyup', event => { keys.delete(event.code); if (shiftKeys.has(event.code) && !event.shiftKey) { keys.delete('ShiftLeft'); keys.delete('ShiftRight'); } });
  window.addEventListener('blur', () => { clearKeys(); drag = null; releaseMouse(); });
  document.addEventListener('visibilitychange', () => { clearKeys(); drag = null; if (document.hidden) releaseMouse(); });
  document.addEventListener('focusin', event => { if (editing(event.target)) clearKeys(); });
  enabledInput.addEventListener('change', clearKeys);
  overviewSpeedInput.addEventListener('input',()=>setOverviewSpeed(Number(overviewSpeedInput.value)));
  overviewSpeedCustom.addEventListener('input',()=>{
    if(Number.isFinite(overviewSpeedCustom.valueAsNumber))setOverviewSpeed(overviewSpeedCustom.valueAsNumber);
  });
  overviewSpeedCustom.addEventListener('change',()=>{overviewSpeedCustom.value=String(overviewMetersPerSecond);});
  refreshSpeedOptions();
  q('#camera-speed-profile-mode')?.addEventListener('click', () => setSpeedMode('profile'));
  q('#camera-speed-snap').addEventListener('click', () => setSpeedMode('snap'));
  q('#camera-speed-free').addEventListener('click', () => setSpeedMode('free'));
  speedInput.addEventListener('input', () => {
    if (speedMode === 'profile') return;
    selectedSpeed = speedMode === 'snap' ? profiles[Math.max(0, Math.min(profiles.length - 1, Math.round(Number(speedInput.value))))].value : Math.max(1, Math.min(40, Number(speedInput.value)));
    updateSpeed();
  });
  speedPreset.addEventListener('change', () => { selectedSpeed = profiles.find(p => p.id === speedPreset.value)?.value ?? survivorSpeed; updateSpeed(); });
  speedCustom.addEventListener('input', () => {
    if (speedMode === 'free' && Number.isFinite(speedCustom.valueAsNumber)) { selectedSpeed = Math.max(1, Math.min(40, speedCustom.valueAsNumber)); updateSpeed(); }
  });
  speedCustom.addEventListener('change', () => { speedCustom.value = String(selectedSpeed); });
  q('#camera-survivor-speed').addEventListener('click', () => {
    if (profileSpeed(movementProfile) !== null) { speedMode='profile'; selectedSpeed=profileSpeed(movementProfile); }
    else { speedMode='snap'; selectedSpeed=survivorSpeed; }
    updateSpeed();
  });
  document.addEventListener('change', () => { if (mode === 'third') followCamera(); });
  for (const id of ['#cut-low', '#cut-high']) q(id)?.addEventListener('input', () => { if (mode === 'third') followCamera(); });
  document.addEventListener('pointerlockchange', () => { lockFailure = ''; drag = null; updateUI(); });
  document.addEventListener('pointerlockerror', () => { lockFailure = '鼠标锁定未成功；可再点一次，或按住右键拖动环视。'; updateUI(); });
  document.addEventListener('mousemove', event => { if (mode === 'third' && locked()) look(event.movementX, event.movementY); });
  q('#camera-mode-overview').addEventListener('click', () => setMode('overview'));
  q('#camera-mode-third').addEventListener('click', () => { if (setMode('third') && !matchMedia('(pointer: coarse)').matches) requestMouse(); });
  lockButton.addEventListener('click', () => locked() ? releaseMouse() : requestMouse()); fromStart.addEventListener('click', startFromA);
  canvas.addEventListener('contextmenu', event => { if (mode === 'third') event.preventDefault(); });
  canvas.addEventListener('pointerdown', event => {
    if (editing(document.activeElement)) document.activeElement.blur(); if (mode !== 'third') return;
    if (locked()) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (event.button === 2 || event.pointerType === 'touch') { drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0 }; canvas.setPointerCapture(event.pointerId); }
  }, true);
  canvas.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId || locked()) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y; drag.moved += Math.hypot(dx, dy); drag.x = event.clientX; drag.y = event.clientY; look(dx, dy);
  });
  canvas.addEventListener('pointerup', event => {
    if (mode !== 'third') return; if (locked() || drag?.moved > 6) { event.preventDefault(); event.stopImmediatePropagation(); } if (drag?.id === event.pointerId) drag = null;
  }, true);
  canvas.addEventListener('pointercancel', () => { drag = null; });
  canvas.addEventListener('wheel', event => {
    if (mode !== 'third') return; event.preventDefault(); followDistance = THREE.MathUtils.clamp(followDistance * Math.exp(Math.sign(event.deltaY) * .12), 1.5 * u, 12 * u); followCamera();
  }, { passive: false });
  for (const button of document.querySelectorAll('[data-camera-key]')) {
    const key = button.dataset.cameraKey;
    button.addEventListener('pointerdown', event => { event.preventDefault(); if (!isInputActive()) {clearKeys();return;} if (mode !== 'third' || !enabledInput.checked) return; onManualMove(); touchKeys.add(key); button.setPointerCapture(event.pointerId); });
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(event, () => touchKeys.delete(key));
  }
  updateSpeed(); updateOverviewSpeed(); updateUI();

  function update(now = performance.now()) {
    const elapsedSeconds = Math.max(0, (now - previousTime) / 1000); previousTime = now; if (!isReady()) return false;
    const worldState=getWorldCollision()?.stats().state;
    if(worldState!==lastWorldState){lastWorldState=worldState;updateUI();}
    // Preserve wall-clock movement at low FPS; long suspended frames clear input
    // instead of teleporting the character after the page resumes.
    if (elapsedSeconds > 1) { clearKeys(); return false; }
    const deltaSeconds = elapsedSeconds;
    if (!isInputActive() || !enabledInput.checked || document.hidden || editing(document.activeElement)) clearKeys();
    const has = code => keys.has(code) || touchKeys.has(code);
    const x = Number(has('KeyD')) - Number(has('KeyA')), z = Number(has('KeyW')) - Number(has('KeyS'));
    const y = mode === 'overview' ? Number(has('KeyE')) - Number(has('KeyQ')) : 0, boost = has('ShiftLeft') || has('ShiftRight') ? 3 : 1;
    if (x || y || z) {
      if (mode === 'third') { right.set(Math.cos(yaw), 0, Math.sin(yaw)); forward.set(Math.sin(yaw), 0, -Math.cos(yaw)); }
      else { camera.updateMatrixWorld(); right.setFromMatrixColumn(camera.matrixWorld, 0); right.y = 0; if (right.lengthSq() < 1e-12) right.set(1, 0, 0); else right.normalize(); forward.crossVectors(up, right).normalize(); }
      motion.copy(right).multiplyScalar(x).addScaledVector(forward, z); motion.y = y; motion.normalize(); motion.multiplyScalar((mode==='overview'?overviewMetersPerSecond:speed()) * u * boost * deltaSeconds);
      if (mode === 'third') { if (motion.lengthSq()) avatar.rotation.y = Math.atan2(-motion.x, -motion.z); }
      else {
        camera.position.add(motion); controls.target.x += motion.x; controls.target.z += motion.z;
        // Q/E change elevation around the fixed-height observation target.
        camera.position.y = Math.max(camera.position.y, controls.target.y + .5 * u);
      }
      invalidate();
    }
    if(mode==='third'&&actor&&!routePoseActive){
      const state=getWorldCollision()?.stats().state;
      sliding=false;
      if(!state||state==='ready'){
        const dx=x||z?motion.x:0,dz=x||z?motion.z:0;
        const count=Math.max(1,Math.ceil(deltaSeconds*60-1e-8),Math.ceil(Math.hypot(dx,dz)/(.18*u)));
        for(let i=0;i<count;i++){
          if(falling){if(dx||dz)slideStep(dx/count,dz/count,true);updateFall(deltaSeconds/count);}
          else if(dx||dz){moveActor(dx/count,dz/count);if(falling)updateFall(deltaSeconds/count);}
        }
      }else if(x||z){movementBlocked=true;obstructionReason=`source-${state}`;}
    }
    if (mode === 'third' && actor) {
      if (x || z || falling || lastLanding || lastSceneSize !== scene.children.length) { followCamera(); lastSceneSize = scene.children.length; }
      return true;
    }
    return Boolean(x || y || z);
  }
  return {
    update, setMode, startFromA, showRoutePose, releaseRoutePose, clearKeys, speed,overviewSpeed,setOverviewSpeed, setSpeedMode, syncMovementProfile, setLanguage, isThirdPerson: () => mode === 'third',
    speedState() { return { mode: speedMode, value: selectedSpeed,overviewMetersPerSecond, presetId: speedMode === 'snap' ? profiles[nearestProfile(selectedSpeed)].id : null, profiles: profiles.map(p => ({ ...p })) }; },
    collisionState() { return { mode, actorPoint: actor?.point.slice() ?? null, body: { ...standingBody },
      routePoseActive, movementBlocked, obstructionReason,falling,sliding, cameraObstructed: mode === 'third' && cameraObstructed }; },
    stats() {
      return { enabled: enabledInput.checked, mode, pointerLocked: locked(), metersPerSecond: speed(),overviewMetersPerSecond, activeKeys: [...new Set([...keys, ...touchKeys])],
        position: camera.position.toArray(), target: controls.target.toArray(), direction: camera.getWorldDirection(new THREE.Vector3()).toArray(), actor: actor && { ...actor, point: actor.point.slice() },
        yaw, pitch, followDistanceMeters: followDistance / u, actualFollowDistanceMeters: mode === 'third' ? camera.position.distanceTo(anchor) / u : null,
        avatarVisible: Boolean(avatar?.visible), avatarOpacity: avatar?.children[0]?.material.opacity ?? 0, dummyPose:avatar?.userData.pose??null, movementBlocked, obstructionReason,
        falling,verticalSpeedMetersPerSecond:verticalSpeed/u,sliding,lastLanding };
    },
  };
}
