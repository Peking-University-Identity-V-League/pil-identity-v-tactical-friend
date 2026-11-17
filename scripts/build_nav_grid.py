"""把 maps-3d 运行页内嵌的导航/碰撞数据栅格化为二维可行走位图。

每张地图输出 grid-data/<scene>.png（8bit 灰度，255=地面层可行走），
并生成 js/data/nav-grid-manifest.js 供前端按 mapId 查找栅格参数。

模型与三维端 worker 保持一致：
- 可走地面：nav-data 导航网格地面层（源坐标 Y ∈ [-30, 45]，约 -2.5m ~ +3.8m），
  地下室与二楼不参与；
- 阻挡：wall-payload 碰撞三角形中「近竖直面」(|法线y|/|法线| < 0.5)，
  对象过滤 (group & 68) 排除、(layer & 1) 必需，与 coarse-walls 一致；
  仅取 Y 范围与站立高度带 [2, 25] 相交的墙，避免地下室/二楼墙误伤地面；
- 窗口封堵：passage-data 的 window 连接在牵气球时不可通过，
  在窗口中点按半径封格。
坐标经 board-calibration.json 的 worldToPixel 仿射直接落到二维底图像素坐标系。
"""
import base64
import gzip
import json
import math
import re
import struct
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CAL_PATH = ROOT / 'maps-3d' / 'board-calibration.json'
MAPS_JS = ROOT / 'js' / 'data' / 'maps.js'
OUT_DIR = ROOT / 'grid-data'
MANIFEST_JS = ROOT / 'js' / 'data' / 'nav-grid-manifest.js'

CELL_PX = 2            # 每格对应底图 2x2 像素
GROUND_Y_MIN = -30.0   # 导航网格地面层（源坐标单位，11.85 ≈ 1m）
GROUND_Y_MAX = 45.0
WALL_Y_MIN = 2.0       # 墙体生效的站立高度带
WALL_Y_MAX = 25.0
WALL_MIN_Y_SPAN = 8.0  # 墙面最小高度（源单位），排除台阶竖板
WINDOW_SEAL_METERS = 0.7   # 窗口封堵半径
SOURCE_UNITS_PER_METER = 11.85


def extract_block(html: str, block_id: str, block_type: str) -> str:
    m = re.search(
        rf'<script id="{block_id}" type="{block_type}">(.*?)</script>', html, re.S)
    if not m:
        raise ValueError(f'缺少数据块 {block_id}')
    return m.group(1).strip()


def extract_nav_triangles(html: str):
    raw = base64.b64decode(extract_block(html, 'nav-data', 'application/octet-stream'))
    if raw[:4] != b'glTF':
        raise ValueError('nav-data 不是 GLB')
    jlen, jtype = struct.unpack('<I4s', raw[12:20])
    assert jtype == b'JSON'
    gltf = json.loads(raw[20:20 + jlen])
    boff = 20 + jlen
    blen, btype = struct.unpack('<I4s', raw[boff:boff + 8])
    assert btype == b'BIN\x00'
    bin_start = boff + 8
    prim = gltf['meshes'][0]['primitives'][0]

    def accessor_data(idx):
        acc = gltf['accessors'][idx]
        bv = gltf['bufferViews'][acc['bufferView']]
        off = bin_start + bv.get('byteOffset', 0) + acc.get('byteOffset', 0)
        n = acc['count']
        if acc['componentType'] == 5126 and acc['type'] == 'VEC3':
            vals = struct.unpack(f'<{n * 3}f', raw[off:off + n * 12])
            return [tuple(vals[i * 3:(i + 1) * 3]) for i in range(n)]
        if acc['componentType'] == 5123 and acc['type'] == 'SCALAR':
            return struct.unpack(f'<{n}H', raw[off:off + n * 2])
        raise ValueError(f'不支持的 accessor: {acc}')

    positions = accessor_data(prim['attributes']['POSITION'])
    indices = accessor_data(prim['indices'])
    return [(positions[i0], positions[i1], positions[i2])
            for i0, i1, i2 in zip(indices[::3], indices[1::3], indices[2::3])]


def extract_wall_triangles(html: str):
    wp = json.loads(extract_block(html, 'wall-payload', 'application/json'))
    data = json.loads(gzip.decompress(base64.b64decode(wp['base64'])))
    assert data['schema'] == 'pil-source-collision-triangles-v1'
    assert data['coordinateSystem'] == 'viewer-x-reflected-y-up'
    verts, indices = data['vertices'], data['indices']
    walls = []
    cursor = 0
    for obj in data['objects']:
        start, count = obj['faceStart'], obj['faceCount']
        assert start == cursor
        cursor += count
        if (obj['group'] & 68) or not (obj['layer'] & 1):
            continue
        for f in range(start, start + count):
            i0, i1, i2 = indices[f * 3:f * 3 + 3]
            p0 = verts[i0 * 3:i0 * 3 + 3]
            p1 = verts[i1 * 3:i1 * 3 + 3]
            p2 = verts[i2 * 3:i2 * 3 + 3]
            ax, ay, az = p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]
            bx, by, bz = p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]
            nx, ny, nz = ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx
            ln = math.sqrt(nx * nx + ny * ny + nz * nz)
            if ln == 0 or abs(ny) / ln >= 0.5:
                continue
            ymin = min(p0[1], p1[1], p2[1])
            ymax = max(p0[1], p1[1], p2[1])
            if ymax < WALL_Y_MIN or ymin > WALL_Y_MAX:
                continue
            # 排除台阶竖板等矮面，只保留真正阻挡通行的墙
            if ymax - ymin < WALL_MIN_Y_SPAN:
                continue
            walls.append((p0, p1, p2))
    return walls


def extract_window_points(html: str):
    pd = json.loads(extract_block(html, 'passage-data', 'application/json'))
    pts = []
    for conn in pd.get('actionConnections', []):
        if conn.get('type') != 'window' or not conn.get('enabled', True):
            continue
        path = conn.get('path') or []
        if not path:
            continue
        mx = sum(p[0] for p in path) / len(path)
        mz = sum(p[2] for p in path) / len(path)
        pts.append((mx, mz))
    return pts


def make_projector(world_to_pixel, cell_px):
    a, b, c, d, e, f = world_to_pixel

    def to_cell(x, z):
        return ((a * x + c * z + e) / cell_px, (b * x + d * z + f) / cell_px)

    return to_cell


def fill_triangle(grid, gw, gh, p0, p1, p2, value):
    def cross2(p, q, r):
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])

    area = cross2(p0, p1, p2)
    if abs(area) < 1e-12:
        return
    minx = max(0, int(min(p0[0], p1[0], p2[0])))
    maxx = min(gw - 1, int(max(p0[0], p1[0], p2[0])))
    miny = max(0, int(min(p0[1], p1[1], p2[1])))
    maxy = min(gh - 1, int(max(p0[1], p1[1], p2[1])))
    for gy in range(miny, maxy + 1):
        for gx in range(minx, maxx + 1):
            pt = (gx + 0.5, gy + 0.5)
            if (cross2(p1, p2, pt) * area >= 0 and cross2(p2, p0, pt) * area >= 0
                    and cross2(p0, p1, pt) * area >= 0):
                grid[gy * gw + gx] = value


def fill_disc(grid, gw, gh, cx, cy, radius_cells, value):
    r = int(math.ceil(radius_cells))
    for gy in range(max(0, int(cy) - r), min(gh, int(cy) + r + 1)):
        for gx in range(max(0, int(cx) - r), min(gw, int(cx) + r + 1)):
            if (gx + 0.5 - cx) ** 2 + (gy + 0.5 - cy) ** 2 <= radius_cells ** 2:
                grid[gy * gw + gx] = value


def stroke_segment(grid, gw, gh, p, q, radius_cells, value):
    """沿 2D 线段按 0.5 格步长打点封格，用于近竖直墙的退化投影。"""
    length = math.hypot(q[0] - p[0], q[1] - p[1])
    steps = max(1, int(length / 0.5) + 1)
    for i in range(steps + 1):
        t = i / steps
        fill_disc(grid, gw, gh, p[0] + (q[0] - p[0]) * t,
                  p[1] + (q[1] - p[1]) * t, radius_cells, value)


def rasterize(html, entry, cell_px):
    map_w, map_h = entry['size']
    gw, gh = (map_w + cell_px - 1) // cell_px, (map_h + cell_px - 1) // cell_px
    grid = bytearray(gw * gh)
    to_cell = make_projector(entry['worldToPixel'], cell_px)

    nav_tris = extract_nav_triangles(html)
    nav_kept = 0
    for t0, t1, t2 in nav_tris:
        cy = (t0[1] + t1[1] + t2[1]) / 3
        if not (GROUND_Y_MIN <= cy <= GROUND_Y_MAX):
            continue
        nav_kept += 1
        fill_triangle(grid, gw, gh, to_cell(t0[0], t0[2]),
                      to_cell(t1[0], t1[2]), to_cell(t2[0], t2[2]), 255)

    walls = extract_wall_triangles(html)
    for t0, t1, t2 in walls:
        q0, q1, q2 = to_cell(t0[0], t0[2]), to_cell(t1[0], t1[2]), to_cell(t2[0], t2[2])
        # 投影面积（格²）：斜面填充投影，近竖直面（退化）沿三边描边
        proj_area = abs((q1[0] - q0[0]) * (q2[1] - q0[1])
                        - (q2[0] - q0[0]) * (q1[1] - q0[1])) / 2
        if proj_area >= 0.35:
            fill_triangle(grid, gw, gh, q0, q1, q2, 0)
        else:
            stroke_segment(grid, gw, gh, q0, q1, 0.75, 0)
            stroke_segment(grid, gw, gh, q1, q2, 0.75, 0)
            stroke_segment(grid, gw, gh, q2, q0, 0.75, 0)

    meters_per_px = None  # 由调用方补充
    return gw, gh, grid, nav_kept, len(walls), to_cell


def read_panel_widths():
    src = MAPS_JS.read_text(encoding='utf-8')
    widths = [float(v) for v in re.findall(r'const widthM = ([\d.]+);', src)]
    sizes = re.findall(r'const mapSize = \[(\d+), (\d+)\];', src)
    return widths, [(int(w), int(h)) for w, h in sizes]


def main():
    cal = json.loads(CAL_PATH.read_text(encoding='utf-8'))
    widths_m, panel_sizes = read_panel_widths()
    OUT_DIR.mkdir(exist_ok=True)
    manifest = {}
    for entry in cal['maps']:
        scene, map_id = entry['scene'], entry['mapId']
        runtime = next((ROOT / 'maps-3d').glob(f'{scene}.runtime-*.html'), None)
        if not runtime:
            print(f'!! {scene} 缺少 runtime 文件，跳过')
            continue
        html = runtime.read_text(encoding='utf-8')
        width_m = widths_m[map_id]
        panel_w, panel_h = panel_sizes[map_id]
        assert (panel_w, panel_h) == tuple(entry['size']), f'{scene} 底图尺寸不一致'
        meters_per_cell = width_m / panel_w * CELL_PX

        gw, gh, grid, nav_kept, wall_count, to_cell = rasterize(html, entry, CELL_PX)

        # 封堵窗口（牵气球不可翻窗）
        windows = extract_window_points(html)
        seal_r = WINDOW_SEAL_METERS / meters_per_cell
        for wx, wz in windows:
            cx, cy = to_cell(wx, wz)
            if 0 <= cx < gw and 0 <= cy < gh:
                fill_disc(grid, gw, gh, cx, cy, seal_r, 0)

        walkable = sum(1 for v in grid if v)
        img = Image.frombytes('L', (gw, gh), bytes(grid))
        out = OUT_DIR / f'{scene}.png'
        img.save(out, optimize=True)
        manifest[str(map_id)] = {
            'scene': scene,
            'file': f'grid-data/{scene}.png',
            'gridW': gw,
            'gridH': gh,
            'cellPx': CELL_PX,
            'metersPerCell': round(meters_per_cell, 4),
        }
        print(f'{scene}: 导航三角 {nav_kept} 墙 {wall_count} 窗 {len(windows)} '
              f'栅格 {gw}x{gh} 可行走 {walkable} ({walkable * 100 // (gw * gh)}%) '
              f'png {out.stat().st_size // 1024}KB')
    js = ('// 由 scripts/build_nav_grid.py 生成，勿手改\n'
          'export const NAV_GRID_MANIFEST = '
          + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n')
    MANIFEST_JS.write_text(js, encoding='utf-8')
    print(f'清单已写入 {MANIFEST_JS}')


if __name__ == '__main__':
    sys.exit(main())
