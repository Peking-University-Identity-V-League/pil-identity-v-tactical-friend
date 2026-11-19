// 精确导航栅格烘焙（方案C：构建时提取 3D 精确数据）。
// 与 scripts/build_nav_grid.py 的描边栅格化不同，本脚本直接复用
// maps-3d 运行页 worker 内的校验模块（胶囊扫掠 + 封闭组件内部判定），
// 对底图每 1px 做一次与 3D 端点校验完全同模型的可走性判定：
//   可走(px) = 地面层导航网格覆盖该点（提供脚部高度 Y）
//             ∧ 胶囊（半径 .23m）不与静态碰撞三角形相交
//             ∧ 不在封闭实体组件内部
// 窗口不做额外封堵：实测 3D 路由会穿过这些开口（胶囊能过即视为可过），
// 与 3D 结果保持一致；manifest 的 windows 仅作展示数据保留。
// 输出：grid-data/<scene>.png（cellPx=1，255=可走）并更新
// js/data/nav-grid-manifest.js（windows/basements 沿用旧清单的像素数据）。
//
// 用法：node scripts/build_nav_grid_exact.mjs [scene ...]（缺省全量）

import { deflateSync, gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CAL_PATH = join(ROOT, 'maps-3d', 'board-calibration.json');
const MAPS_JS = join(ROOT, 'js', 'data', 'maps.js');
const MANIFEST_JS = join(ROOT, 'js', 'data', 'nav-grid-manifest.js');
const OUT_DIR = join(ROOT, 'grid-data');

const SOURCE_UNITS_PER_METER = 11.85;
const BODY_M = { radius: 0.23, halfHeight: 0.825, centerHeight: 1.025 };
const BODY = Object.fromEntries(Object.entries(BODY_M)
  .map(([k, v]) => [k, v * SOURCE_UNITS_PER_METER]));
const GROUND_Y_MIN = -30.0;   // 地面层导航带（源单位），与 build_nav_grid.py 一致
const GROUND_Y_MAX = 45.0;

// ---------- runtime HTML 数据块 ----------
function extractBlock(html, id) {
  const m = html.match(new RegExp(`<script id="${id}" type="[^"]+">(.*?)</script>`, 's'));
  if (!m) throw new Error(`缺少数据块 ${id}`);
  return m[1].trim();
}

function extractWorkerModule(html, name) {
  const src = JSON.parse(extractBlock(html, 'worker-source')).base64;
  const js = Buffer.from(src, 'base64').toString('utf-8');
  const marker = `__pilModules["${name}"]=(()=>{`;
  const start = js.indexOf(marker);
  if (start < 0) throw new Error(`worker 模块未找到: ${name}`);
  const next = js.indexOf('__pilModules["', start + marker.length);
  const expr = js.slice(start + `__pilModules["${name}"]=`.length,
    next < 0 ? undefined : next).trim().replace(/\}\)\(\);\s*$/, '})()');
  return (0, eval)(expr);
}

function parseWallPayload(html) {
  const wp = JSON.parse(extractBlock(html, 'wall-payload'));
  return JSON.parse(gunzipSync(Buffer.from(wp.base64, 'base64')).toString('utf-8'));
}

// passage-data 中启用的 window 连接：返回翻越轨迹段列表，每段为源单位 [x,z] 点列
function parseWindowPaths(html) {
  const pd = JSON.parse(extractBlock(html, 'passage-data'));
  const out = [];
  for (const conn of pd.actionConnections || []) {
    if (conn.type !== 'window' || conn.enabled === false) continue;
    const pts = (conn.path && conn.path.length >= 2)
      ? conn.path
      : (conn.from && conn.to ? [conn.from.point, conn.to.point] : null);
    if (pts) out.push(pts.map((p) => [p[0], p[2]]));
  }
  return out;
}

function parseNavTriangles(html) {
  const raw = Buffer.from(extractBlock(html, 'nav-data'), 'base64');
  if (raw.toString('utf-8', 0, 4) !== 'glTF') throw new Error('nav-data 不是 GLB');
  const jlen = raw.readUInt32LE(12);
  const gltf = JSON.parse(raw.toString('utf-8', 20, 20 + jlen));
  const binStart = 20 + jlen + 8;
  const acc = gltf.accessors, bv = gltf.bufferViews, prim = gltf.meshes[0].primitives[0];
  const pa = acc[prim.attributes.POSITION], pbv = bv[pa.bufferView];
  const pOff = binStart + (pbv.byteOffset || 0) + (pa.byteOffset || 0);
  const positions = new Float32Array(raw.buffer, raw.byteOffset + pOff, pa.count * 3);
  const ia = acc[prim.indices], ibv = bv[ia.bufferView];
  const iOff = binStart + (ibv.byteOffset || 0) + (ia.byteOffset || 0);
  const indices = ia.componentType === 5123
    ? new Uint16Array(raw.buffer, raw.byteOffset + iOff, ia.count)
    : new Uint32Array(raw.buffer, raw.byteOffset + iOff, ia.count);
  const tris = [];
  for (let i = 0; i < indices.length; i += 3) {
    tris.push([indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3]);
  }
  return { positions, tris };
}

// ---------- 最小 PNG（8bit 灰度）编码 ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}
function encodeGrayPng(w, h, pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 0; // 8bit grayscale
  const raw = Buffer.alloc((w + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0;
    Buffer.from(pixels.buffer, y * w, w).copy(raw, y * (w + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- 导航网格地面高度采样 ----------
function makeGroundSampler(positions, tris) {
  // 地面带（质心 Y ∈ [GROUND_Y_MIN, GROUND_Y_MAX]）三角形按 XZ 桶索引
  const B = 20, buckets = new Map();
  const ground = [];
  for (const t of tris) {
    const [a, b, c] = t;
    const cy = (positions[a + 1] + positions[b + 1] + positions[c + 1]) / 3;
    if (cy < GROUND_Y_MIN || cy > GROUND_Y_MAX) continue;
    const minx = Math.min(positions[a], positions[b], positions[c]);
    const maxx = Math.max(positions[a], positions[b], positions[c]);
    const minz = Math.min(positions[a + 2], positions[b + 2], positions[c + 2]);
    const maxz = Math.max(positions[a + 2], positions[b + 2], positions[c + 2]);
    const rec = [a, b, c, minx, maxx, minz, maxz];
    ground.push(rec);
    for (let bx = Math.floor(minx / B); bx <= Math.floor(maxx / B); bx++) {
      for (let bz = Math.floor(minz / B); bz <= Math.floor(maxz / B); bz++) {
        const key = bx + ',' + bz;
        let arr = buckets.get(key);
        if (!arr) buckets.set(key, arr = []);
        arr.push(rec);
      }
    }
  }
  // 返回覆盖 (x,z) 的地面层高度；多重覆盖取最低（地面优先于矮台）
  return (x, z) => {
    const arr = buckets.get(Math.floor(x / B) + ',' + Math.floor(z / B));
    if (!arr) return null;
    let best = null;
    for (const [a, b, c] of arr) {
      const ax = positions[a], az = positions[a + 2];
      const bx = positions[b], bz = positions[b + 2];
      const cx = positions[c], cz = positions[c + 2];
      const d1 = (bx - ax) * (z - az) - (bz - az) * (x - ax);
      const d2 = (cx - bx) * (z - bz) - (cz - bz) * (x - bx);
      const d3 = (ax - cx) * (z - cz) - (az - cz) * (x - cx);
      if (!((d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0))) continue;
      const det = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
      if (Math.abs(det) < 1e-12) continue;
      // 重心坐标插值 Y
      const w1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / det;
      const w2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / det;
      const w0 = 1 - w1 - w2;
      const y = w0 * positions[a + 1] + w1 * positions[b + 1] + w2 * positions[c + 1];
      if (best === null || y < best) best = y;
    }
    return best;
  };
}

// ---------- 主流程 ----------
function readPanelWidths() {
  const src = readFileSync(MAPS_JS, 'utf-8');
  const widths = [...src.matchAll(/const widthM = ([\d.]+);/g)].map((m) => +m[1]);
  const sizes = [...src.matchAll(/const mapSize = \[(\d+), (\d+)\];/g)]
    .map((m) => [+m[1], +m[2]]);
  return { widths, sizes };
}

function readOldManifest() {
  const src = readFileSync(MANIFEST_JS, 'utf-8');
  const m = src.match(/= (\{[\s\S]*\});?\s*$/);
  return JSON.parse(m[1].replace(/;$/, ''));
}

function main() {
  const only = process.argv.slice(2);
  const cal = JSON.parse(readFileSync(CAL_PATH, 'utf-8'));
  const { widths, sizes } = readPanelWidths();
  const oldManifest = readOldManifest();
  mkdirSync(OUT_DIR, { recursive: true });

  const scenes = cal.maps.filter((e) => !only.length || only.includes(e.scene));
  // worker 校验模块只取一次（各图运行页内嵌一致）
  const firstRuntime = readdirSync(join(ROOT, 'maps-3d'))
    .find((f) => f.startsWith(`${scenes[0].scene}.runtime-`));
  const firstHtml = readFileSync(join(ROOT, 'maps-3d', firstRuntime), 'utf-8');
  const { createCoarseWallOracle } = extractWorkerModule(firstHtml, 'src/routing/coarse-walls.mjs');
  const { createEndpointSolidOracle } = extractWorkerModule(firstHtml, 'src/routing/endpoint-solids.mjs');

  const manifest = { ...oldManifest };
  for (const entry of scenes) {
    const { scene, mapId } = entry;
    const runtime = readdirSync(join(ROOT, 'maps-3d'))
      .find((f) => f.startsWith(`${scene}.runtime-`));
    if (!runtime) { console.log(`!! ${scene} 缺少 runtime 文件，跳过`); continue; }
    const t0 = Date.now();
    const html = readFileSync(join(ROOT, 'maps-3d', runtime), 'utf-8');
    const world = parseWallPayload(html);
    const { positions, tris } = parseNavTriangles(html);
    const groundY = makeGroundSampler(positions, tris);

    const walls = createCoarseWallOracle(world, {
      body: BODY, contactTolerance: SOURCE_UNITS_PER_METER * 0.0001,
    });
    const solids = createEndpointSolidOracle(world, { heightOffset: BODY.centerHeight });

    // worldToPixel 布局 [a,b,c,d,e,f]：u = a*x + c*z + e，v = b*x + d*z + f
    const [a, b, c, d, e, f] = entry.worldToPixel;
    const det = a * d - b * c;
    // 逆变换：像素 -> 世界
    const pxToWorld = (u, v) => {
      const du = u - e, dv = v - f;
      return [(d * du - c * dv) / det, (-b * du + a * dv) / det];
    };

    const [W, H] = entry.size;
    const grid = new Uint8Array(W * H);
    let walkable = 0, noNav = 0, wallHit = 0, solidHit = 0;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const [wx, wz] = pxToWorld(px + 0.5, py + 0.5);
        const y = groundY(wx, wz);
        if (y === null) { noNav++; continue; }
        const p = [wx, y, wz];
        if (!walls.pointAllowed(p)) { wallHit++; continue; }
        if (!solids.pointAllowed(p)) { solidHit++; continue; }
        grid[py * W + px] = 255;
        walkable++;
      }
      if (py % 200 === 199) {
        process.stdout.write(`\r${scene}: ${py + 1}/${H}`);
      }
    }
    // 窗户带标记（第三态 128）：passage-data 的 window 连接 path 是翻越轨迹，
    // 沿轨迹 ±0.35m 内的阻挡格标记为窗带；运行时按「允许翻窗」开关决定可走性
    // （默认可通过，与 3D 一致；不通过时退化为纯阻挡）。
    const old = oldManifest[String(mapId)] || {};
    const metersPerPx = widths[mapId] / W;
    const winR = 0.35 / metersPerPx;
    let winCells = 0;
    for (const pts of parseWindowPaths(html)) {
      for (let s = 1; s < pts.length; s++) {
        const au = a * pts[s - 1][0] + c * pts[s - 1][1] + e;
        const av = b * pts[s - 1][0] + d * pts[s - 1][1] + f;
        const bu = a * pts[s][0] + c * pts[s][1] + e;
        const bv = b * pts[s][0] + d * pts[s][1] + f;
        const segLen = Math.hypot(bu - au, bv - av);
        const steps = Math.max(1, Math.ceil(segLen * 2));
        for (let k = 0; k <= steps; k++) {
          const u = au + (bu - au) * (k / steps);
          const v = av + (bv - av) * (k / steps);
          const x0 = Math.max(0, Math.floor(u - winR)), x1 = Math.min(W - 1, Math.ceil(u + winR));
          const y0 = Math.max(0, Math.floor(v - winR)), y1 = Math.min(H - 1, Math.ceil(v + winR));
          for (let py = y0; py <= y1; py++) {
            for (let px = x0; px <= x1; px++) {
              const dx = px + 0.5 - u, dy = py + 0.5 - v;
              const i = py * W + px;
              if (dx * dx + dy * dy <= winR * winR && grid[i] === 0) { grid[i] = 128; winCells++; }
            }
          }
        }
      }
    }
    const png = encodeGrayPng(W, H, grid);
    const out = join(OUT_DIR, `${scene}.png`);
    writeFileSync(out, png);

    manifest[String(mapId)] = {
      scene,
      file: `grid-data/${scene}.png`,
      gridW: W, gridH: H, cellPx: 1,
      metersPerCell: +(widths[mapId] / W).toFixed(4),
      windows: old.windows || [],
      basements: old.basements || [],
    };
    console.log(`\n${scene}: ${W}x${H} 可走 ${walkable} `
      + `(${(walkable * 100 / (W * H)).toFixed(1)}%) `
      + `[无导航 ${noNav} 碰墙 ${wallHit} 实体内部 ${solidHit} 窗带 ${winCells}] `
      + `png ${(png.length / 1024).toFixed(0)}KB 用时 ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  const js = '// 由 scripts/build_nav_grid_exact.mjs 生成，勿手改\n'
    + 'export const NAV_GRID_MANIFEST = '
    + JSON.stringify(manifest, null, 2) + ';\n';
  writeFileSync(MANIFEST_JS, js);
  console.log(`清单已写入 ${MANIFEST_JS}`);
}

main();
