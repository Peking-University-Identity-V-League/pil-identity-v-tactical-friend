// 造物动画的纯计算核心：不依赖 DOM 与页面状态，几何信息通过 geom 传入，可直接单元测试。
//
// anim 数据结构（存放在造物 token/item 的 anim 字段，可直接 JSON 序列化）：
//   { mode: 'time' | 'speed',
//     points: [{ x, y }],              // 0~1 相对坐标
//     times: [t0, t1, ...],            // mode=time：各点到达时刻（秒），与 points 等长
//     speeds: [{ name, speed }, ...] } // mode=speed：每段移速（m/s），长度 = points.length - 1
//
// geom: { dw, dh, widthM } —— 底图原始像素宽、高与地图横向米数（缺 widthM 时按相对单位计算）


// 两点间距离（米）：与 tactic.js tacMeasureLen 同一换算（横向像素 ↔ widthM）
export function animSegmentLenM(a, b, geom) {
  const units = Math.hypot((b.x - a.x) * geom.dw, (b.y - a.y) * geom.dh);
  return geom.widthM ? (units / geom.dw) * geom.widthM : units;
}


// 各段时间表：[{ t0, t1, dur, lenM, avgSpeed }]
// dur<=0 的段视为瞬移；avgSpeed 在 dur>0 时为 lenM/dur（米/秒），否则为 null
// segDurFn(segIdx, lenM, baseSpeed) 可覆盖移速模式的段时长（用于加成 buff 计算）
export function animSegments(anim, geom, segDurFn) {
  const pts = anim.points || [];
  const out = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const lenM = animSegmentLenM(pts[i], pts[i + 1], geom);
    let t0;
    let t1;
    if (anim.mode === 'speed') {
      const prev = out[i - 1];
      t0 = prev ? prev.t1 : 0;
      const v = ((anim.speeds || [])[i] || {}).speed;
      const dur = segDurFn ? segDurFn(i, lenM, v) : (v > 0 ? lenM / v : 0);
      t1 = t0 + Math.max(0, dur || 0);
    } else {
      const times = anim.times || [];
      t0 = times[i] ?? (out[i - 1] ? out[i - 1].t1 : 0);
      t1 = Math.max(t0, times[i + 1] ?? t0);
    }
    const dur = t1 - t0;
    out.push({ t0, t1, dur, lenM, avgSpeed: dur > 0 ? lenM / dur : null });
  }
  return out;
}


// 播放起止时刻：{ start, end, total }；路径不足两点时 total 为 0
export function animDuration(anim, geom, segDurFn) {
  const segs = animSegments(anim, geom, segDurFn);
  if (!segs.length) return { start: 0, end: 0, total: 0 };
  const start = segs[0].t0;
  const end = segs[segs.length - 1].t1;
  return { start, end, total: end - start };
}


// t 时刻的位置：{ x, y, done }
// t 在起点时刻之前时停在第一个点，超过终点时刻时停在最后一个点且 done=true
export function animPositionAt(anim, geom, t, segDurFn) {
  const pts = anim.points || [];
  if (!pts.length) return null;
  if (pts.length === 1) return { x: pts[0].x, y: pts[0].y, done: true };
  const segs = animSegments(anim, geom, segDurFn);
  const { start, end } = animDuration(anim, geom, segDurFn);
  if (t <= start) return { x: pts[0].x, y: pts[0].y, done: end <= start };
  if (t >= end) {
    const last = pts[pts.length - 1];
    return { x: last.x, y: last.y, done: true };
  }
  // 跳过瞬移段，找到 t 所在的运动段
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s.dur <= 0) continue;
    if (t >= s.t0 && t <= s.t1) {
      const r = (t - s.t0) / s.dur;
      return {
        x: pts[i].x + (pts[i + 1].x - pts[i].x) * r,
        y: pts[i].y + (pts[i + 1].y - pts[i].y) * r,
        done: false,
      };
    }
  }
  // t 落在瞬移段缝隙：取下一段的起点
  for (let i = 0; i < segs.length; i++) {
    if (t <= segs[i].t1) return { x: pts[i + 1].x, y: pts[i + 1].y, done: false };
  }
  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, done: true };
}


// 某段的平均速度（米/秒，dur<=0 返回 null）：供界面派生显示
export function animAvgSpeed(anim, geom, segIdx, segDurFn) {
  const s = animSegments(anim, geom, segDurFn)[segIdx];
  return s ? s.avgSpeed : null;
}
