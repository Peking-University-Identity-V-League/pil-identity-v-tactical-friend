import { CARRY_BAND_COLORS, carryDropBudget } from '../core/carry-model.js';
import {
  showToast,
  tacArrowSvg,
  tacExportBtn,
  tacMapWrap,
  tacRot,
  tacSaveClose,
  tacSaveImg,
  tacSaveOverlay,
} from '../core/dom.js';
import { translate } from '../core/i18n.js';
import { tacBoard, tacDisplay } from '../core/persist.js';
import { S } from '../core/state.js';
import { TIDE_BAND_COLORS } from '../core/tide-model.js';
import { getTreasureRings } from '../core/treasure.js';
import { cipherOf, mapsZonesRelative } from '../data/geo.js';
import { COMMON_ICON_URL, TAC_COMMON_ITEM_TYPES } from '../data/items_common.js';
import { TAC_ITEM_TYPES } from '../data/items.js';
import { MAPS_DATA, rocketChairGroups, spawnPointGroups } from '../data/maps.js';
import { TAC_ROLES } from '../data/roles.js';
import { TAC_SVG_NS, TAC_TREASURE_RULE } from '../data/tactic-data.js';
import { CIPHER_ICON_URL } from '../map-icons.js';
import { tacCarryCanvas, tacCarryState } from './analysis-carry.js';
import { tacPathCanvas, tacPathState } from './analysis-path.js';
import {
  tacBasementList,
  tacCipherAllIds,
  tacCipherCombos,
  tacCipherPctOf,
  tacDoorPoints,
  tacRotK,
  tacZoomState,
} from './board.js';
import { tacLineStyle, tacMeasureSegColor } from './measure.js';
import { tacItemSizePercent, tacTokenByRole } from './roles-items.js';

function tacLoadImg(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function tacExportImage() {
  const map = MAPS_DATA[S.currentMapId];
  const treasureRings = getTreasureRings(map,
    tacBoard().tokens.find((t) => t.role === 'explorer' && t.showTreasureRange) || null,
    S.currentCipherIndex, TAC_TREASURE_RULE);
  const [W0, H0] = map.mapSize;
  // 以旋转层（地图原始宽高比）为地图空间参考
  const wrapW = (tacRot && tacRot.clientWidth) || tacMapWrap.clientWidth || 1;
  const wrapH = (tacRot && tacRot.clientHeight) || tacMapWrap.clientHeight || 1;

  const cropOn = tacDisplay.exportCrop && tacZoomState.scale > 1;
  // 导出「旋转后的地图」开关：关闭时导出未旋转的原始地图（本身正立）
  const rotK = tacDisplay.exportRot ? (tacRotK & 3) : 0;

  let W, H, vx, vy, vw, vh;
  if (cropOn && rotK === 0) {
    // 未旋转：保持原有参考（导出尺寸 = 屏幕地图像素尺寸）
    W = Math.round(wrapW);
    H = Math.round(wrapH);
    vx = -tacZoomState.tx / (tacZoomState.scale * wrapW);
    vy = -tacZoomState.ty / (tacZoomState.scale * wrapH);
    vw = 1 / tacZoomState.scale;
    vh = 1 / tacZoomState.scale;
  } else if (cropOn) {
    // 旋转：wrap 可见矩形映射回地图空间（逆变换），导出尺寸按地图像素
    const fu = -tacZoomState.tx / (tacZoomState.scale * wrapW);
    const fv = -tacZoomState.ty / (tacZoomState.scale * wrapH);
    const fw = 1 / tacZoomState.scale, fh = fw;
    const mr = rotK === 1 ? { x: 1 - fv - fh, y: fu, w: fh, h: fw }
      : rotK === 2 ? { x: 1 - fu - fw, y: 1 - fv - fh, w: fw, h: fh }
      : { x: fv, y: 1 - fu - fw, w: fh, h: fw };
    vx = mr.x; vy = mr.y; vw = mr.w; vh = mr.h;
    W = Math.max(1, Math.round(mr.w * W0));
    H = Math.max(1, Math.round(mr.h * H0));
  } else {
    W = W0;
    H = H0;
    vx = 0; vy = 0; vw = 1; vh = 1;
  }
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  const sx = W / wrapW, sy = H / wrapH;
  const K = 1 / vw;

  const PX = (rx) => (rx - vx) * W / vw;
  const PY = (ry) => (ry - vy) * H / vh;
  // 旋转导出时，图标/文字等正立叠加层绘制到旋转后的画布上；
  // PXY 把地图分数映射到「当前目标画布」的像素（k=0 时即 PX/PY）。
  let uctx = ctx;
  let PXY = (fx, fy) => [(fx - vx) * W / vw, (fy - vy) * H / vh];


  const chainFirst = {}, chainLast = {};
  tacBoard().measures.forEach((m, i) => {
    if (m.chain == null) return;
    if (chainFirst[m.chain] === undefined) chainFirst[m.chain] = i;
    chainLast[m.chain] = i;
  });


  const base = await tacLoadImg(map.mapImage);
  if (base) ctx.drawImage(base, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  else { ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, W, H); }

  // 挂人范围色带（地图对齐画布，随整图旋转步骤一起旋转）
  if (tacCarryCanvas && tacCarryState.resultMapId === S.currentMapId) {
    ctx.drawImage(tacCarryCanvas, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  }
  // 两点最优路径折线（同为地图对齐画布）
  if (tacPathCanvas && tacPathState.resultMapId === S.currentMapId) {
    ctx.drawImage(tacPathCanvas, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);
  }


  const svgClone = tacArrowSvg.cloneNode(true);
  if (!tacDisplay.exportRot) {
    // 屏幕旋转态下给 SVG 文字加的正立补偿，不适用于未旋转导出
    svgClone.querySelectorAll('text[transform]').forEach((t) => t.removeAttribute('transform'));
  }
  svgClone.setAttribute('xmlns', TAC_SVG_NS);
  svgClone.setAttribute('width', W0);
  svgClone.setAttribute('height', H0);
  const svgUrl = URL.createObjectURL(new Blob(
    [new XMLSerializer().serializeToString(svgClone)], { type: 'image/svg+xml' }));
  const svgImg = await tacLoadImg(svgUrl);
  URL.revokeObjectURL(svgUrl);
  if (svgImg) ctx.drawImage(svgImg, vx * W0, vy * H0, W0 * vw, H0 * vh, 0, 0, W, H);


  if (tacDisplay.zones) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = Math.max(1.5, W * K / 400);
    mapsZonesRelative[S.currentMapId].forEach((z) =>
      ctx.strokeRect(PX(z.x), PY(z.y), z.width * W / vw, z.height * H / vh));
  }

  // Treasure rings are DOM overlays, so the SVG clone above does not include them.
  // Scale their map-relative geometry with the same crop transform as landmarks.
  ctx.save();
  const ringScale = W / vw;
  const strokeScale = ringScale / wrapW;
  ctx.lineWidth = 2 * strokeScale;
  ctx.setLineDash([4 * strokeScale, 3 * strokeScale]);
  treasureRings.forEach((ring) => {
    const x = PX(ring.x), y = PY(ring.y);
    const outer = ring.outerRadius * ringScale;
    const inner = ring.innerRadius * ringScale;
    ctx.fillStyle = ring.excluded ? 'rgba(124, 196, 255, 0.28)' : 'rgba(255, 213, 79, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, outer, 0, Math.PI * 2);
    ctx.moveTo(x + inner, y);
    ctx.arc(x, y, inner, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
    ctx.strokeStyle = ring.excluded ? 'rgba(124, 196, 255, 0.9)' : 'rgba(255, 213, 79, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0, outer - ctx.lineWidth / 2), 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  const [ciphIcon, dungeonIcon, doorIcon, chairIcon, lockerIcon, boxIcon, phoneBoothIcon, springBoxIcon, spawnSurvIcon, spawnHuntIcon] = await Promise.all([
    tacLoadImg(CIPHER_ICON_URL), tacLoadImg(COMMON_ICON_URL.dungeon),
    tacLoadImg(COMMON_ICON_URL.escapeDoor), tacLoadImg(COMMON_ICON_URL.rocketChair),
    tacLoadImg(COMMON_ICON_URL.locker), tacLoadImg(COMMON_ICON_URL.box),
    tacLoadImg(COMMON_ICON_URL.phoneBooth),
    tacLoadImg(COMMON_ICON_URL.springBox),
    tacLoadImg(COMMON_ICON_URL.survivor), tacLoadImg(COMMON_ICON_URL.hunter)]);


  // 正立叠加层：地标/造物/角色图标与图文文字。
  // 旋转导出时在整图旋转完成后绘制到旋转后的画布上，保证图标与文字正立。
  const paintUprightOverlays = async () => {
    const [oW] = [uctx.canvas.width];
    const wrapX = (rotK % 2 === 1) ? wrapH : wrapW;
    if (tacDisplay.ciphers && ciphIcon) {
      const size = tacDisplay.cipherSize / 100 * W * K;
      const pctPx = 12 * (oW / wrapX) * K;
      uctx.save();
      uctx.font = `800 ${pctPx}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'top';
      uctx.lineJoin = 'round';
      (tacDisplay.cipherAll ? tacCipherAllIds(map) : tacCipherCombos(map)[S.currentCipherIndex]).forEach((cid) => {
        const c = cipherOf(S.currentMapId, cid);
        if (!c) return;
        const [x, y] = PXY(c.location[0] / W0, c.location[1] / H0);
        uctx.drawImage(ciphIcon, x - size / 2, y - size / 2, size, size);
        const pct = tacCipherPctOf(S.currentMapId, cid);
        if (pct != null) {
          const ty = y + size / 2 + pctPx * 0.1;
          uctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
          uctx.lineWidth = Math.max(1.5, pctPx / 6);
          uctx.strokeText(`${pct}%`, x, ty);
          uctx.fillStyle = '#f8fafc';
          uctx.fillText(`${pct}%`, x, ty);
        }
      });
      uctx.restore();
    }
    if (tacDisplay.dungeon && dungeonIcon && map.dungeons.length) {
      const dPts = tacDisplay.dungeonAll ? map.dungeons : [map.dungeons[S.tacDungeonIndex % map.dungeons.length]];
      const size = tacDisplay.dungeonSize / 100 * W * K;
      dPts.forEach((pt) => {
        const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
        uctx.drawImage(dungeonIcon, x - size / 2, y - size / 2, size, size);
      });
    }
    if (tacDisplay.escapeDoors && doorIcon) {
      const size = tacDisplay.escapeDoorSize / 100 * W * K;
      tacDoorPoints(map).forEach((pt) => {
        const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
        uctx.drawImage(doorIcon, x - size / 2, y - size / 2, size, size);
      });
    }
    if (tacDisplay.spawns && spawnSurvIcon && spawnHuntIcon && map.spawnPoints) {
      const size = tacDisplay.spawnSize / 100 * W * K;
      const drawSpawn = (pt, icon) => {
        if (!pt) return;
        const [x, y] = PXY(pt[0] / W0, pt[1] / H0);
        uctx.drawImage(icon, x - size / 2, y - size / 2, size, size);
      };
      if (tacDisplay.spawnDuo && map.spawnPointsHunterDuoHunters) {
        const survById = new Map(map.spawnPoints.survivor.map((pt) => [pt.id, pt.location]));
        const huntById = new Map(map.spawnPoints.hunter.map((pt) => [pt.id, pt.location]));
        const picks = tacDisplay.spawnDuoAll
          ? map.spawnPoints.survivor.map((pt) => pt.id) : S.spawnDuoPicks;
        picks.forEach((id) => drawSpawn(survById.get(id), spawnSurvIcon));
        const combos = map.spawnPointsHunterDuoHunters;
        combos[S.tacSpawnDuoHunterIndex % combos.length]
          .forEach((id) => drawSpawn(huntById.get(id), spawnHuntIcon));
      } else {
        const groups = spawnPointGroups(map);
        if (!groups.length) return;
        const group = groups[S.tacSpawnIndex % groups.length];
        group.survivor.forEach((pt) => drawSpawn(pt, spawnSurvIcon));
        drawSpawn(group.hunter, spawnHuntIcon);
      }
    }

    // 狂欢之椅：固定椅 + 当前刷点组 + 当前地下室组
    const xzOf = (pt) => (pt.length > 2 ? [pt[0], pt[2]] : pt);
    if (chairIcon && map.rocketChairCombinations) {
      const ch = rocketChairGroups(map);
      const size = tacDisplay.rocketChairSize / 100 * W * K;
      const drawChair = (pt) => {
        const [px, pz] = xzOf(pt);
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(chairIcon, x - size / 2, y - size / 2, size, size);
      };
      if (tacDisplay.rocketChairs) {
        if (tacDisplay.chairAll) {
          map.rocketChairs.forEach((rc) => drawChair(rc.location));
        } else {
          ch.fixed.forEach(drawChair);
          if (ch.sets.length) ch.sets[S.tacChairIndex % ch.sets.length].forEach(drawChair);
        }
      }
      const bs = tacBasementList();
      if (tacDisplay.rocketChairsBasement && bs.length) {
        bs[S.tacChairBasementIndex % bs.length].rocketChairs.forEach(drawChair);
      }
    }

    // 柜子：固定点位
    if (lockerIcon && tacDisplay.lockers && map.lockers) {
      const size = tacDisplay.lockerSize / 100 * W * K;
      map.lockers.forEach(([px, pz]) => {
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(lockerIcon, x - size / 2, y - size / 2, size, size);
      });
    }

    // 电话亭：固定点位
    if (springBoxIcon && map.springBox && (tacDisplay.springBoxes || tacDisplay.springBoxRange)) {
      const rangeM = (TAC_COMMON_ITEM_TYPES.customSpringBox.ranges.options[0] || {}).size_m;
      map.springBox.forEach(([px, pz]) => {
        const [sx2, sy2] = PXY(px / W0, pz / H0);
        if (tacDisplay.springBoxRange && rangeM && map.widthM) {
          const r = (rangeM / map.widthM) * W * K;
          uctx.save();
          uctx.strokeStyle = '#fff';
          uctx.setLineDash([6 * K, 4 * K]);
          uctx.lineWidth = Math.max(1.5, W * K / 400);
          uctx.beginPath();
          uctx.arc(sx2, sy2, r, 0, Math.PI * 2);
          uctx.stroke();
          uctx.restore();
        }
        if (tacDisplay.springBoxes) {
          const sz = tacDisplay.springBoxSize / 100 * W * K;
          uctx.drawImage(springBoxIcon, sx2 - sz / 2, sy2 - sz / 2, sz, sz);
        }
      });
    }

    if (phoneBoothIcon && tacDisplay.phoneBooths && map.phoneBooths) {
      const size = tacDisplay.phoneBoothSize / 100 * W * K;
      map.phoneBooths.forEach(([px, pz]) => {
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(phoneBoothIcon, x - size / 2, y - size / 2, size, size);
      });
    }

    // 箱子：固定箱 + 当前地下室组
    if (boxIcon && map.chests) {
      const bx = map.chests;
      const size = tacDisplay.boxSize / 100 * W * K;
      const drawBox = (pt) => {
        const [px, pz] = xzOf(pt);
        const [x, y] = PXY(px / W0, pz / H0);
        uctx.drawImage(boxIcon, x - size / 2, y - size / 2, size, size);
      };
      if (tacDisplay.boxes) bx.forEach(drawBox);
      const bs2 = tacBasementList();
      if (tacDisplay.boxesBasement && bs2.length) {
        bs2[S.tacChairBasementIndex % bs2.length].chest.forEach(drawBox);
      }
    }

    // 固定点位图标（教授鳞片 / 摄影师照相机 / 疯眼控制台 / 小丑零件 / 冒险家书页）
    for (const [role, cfg] of Object.entries(map.fixedSpawns || {})) {
      const token = tacTokenByRole(role);
      if (!token || !token.showFixedSpawns) continue;
      const fsItems = (Array.isArray(cfg.item) ? cfg.item : [cfg.item]).filter(Boolean);
      for (const item of fsItems) {
        for (const pt of item.points) {
          const p = Array.isArray(pt) ? pt : pt.p;
          const [x, y] = PXY(p[0] / W0, p[1] / H0);
          if (item.flag_orientation) {
            const fsIcon = (TAC_ITEM_TYPES[item.icon] || {}).icon || COMMON_ICON_URL[item.icon] || item.icon;
            if (fsIcon) {
              const isz = 0.03 * W * K;
              const camImg = await tacLoadImg(fsIcon);
              if (camImg) { uctx.drawImage(camImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
            }
            uctx.save();
            uctx.fillStyle = '#f8fafc';
            uctx.beginPath();
            uctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
            uctx.fill();
            uctx.restore();
          } else {
            const spawnDef = TAC_ITEM_TYPES[item.icon] || {};
            if (spawnDef.icon) {
              const isz = (spawnDef.iconSize || 3.4) / 100 * W * K;
              const iconImg = await tacLoadImg(spawnDef.icon);
              if (iconImg) { uctx.drawImage(iconImg, x - isz / 2, y - isz / 2, isz, isz); continue; }
            }
            uctx.save();
            uctx.fillStyle = '#f8fafc';
            uctx.beginPath();
            uctx.arc(x, y, Math.max(2, W * K / 150), 0, Math.PI * 2);
            uctx.fill();
            uctx.restore();
          }
        }
      }
    }

    // 造物图标与 fallback 圆点（范围圆在地图画布上随图旋转绘制）
    for (const it of board.items) {
      const def = TAC_ITEM_TYPES[it.kind];
      if (!def) continue;
      const [x, y] = PXY(it.x, it.y);
      const icon = itemIconCache[it.kind];
      if (icon) {
        const isz = (it.iconSize ?? 3.4) / 100 * W * K;
        uctx.drawImage(icon, x - isz / 2, y - isz / 2, isz, isz);
      } else if (!def.icon || it.hideIcon) {
        uctx.fillStyle = def.color || '#e2e8f0';
        uctx.beginPath();
        uctx.arc(x, y, Math.max(3, W * K / 200), 0, Math.PI * 2);
        uctx.fill();
      }
    }

    // 角色图标（或首字 fallback），保持正立
    for (const t of board.tokens) {
      const def = TAC_ROLES[t.role] || {};
      const [x, y] = PXY(t.x, t.y);
      const d = t.size / 100 * W * K;
      if (def.icon) {
        const img = await tacLoadImg(def.icon);
        if (img) { uctx.drawImage(img, x - d / 2, y - d / 2, d, d); continue; }
      }
      uctx.save();
      uctx.fillStyle = def.color || '#fff';
      uctx.beginPath();
      uctx.arc(x, y, d / 2, 0, Math.PI * 2);
      uctx.fill();
      uctx.fillStyle = '#0f172a';
      uctx.font = `800 ${d * 0.42}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'middle';
      uctx.fillText((def.name || t.role).charAt(0), x, y);
      uctx.restore();
    }

    // 图文文字（保持正立，多行沿输出纵向排开）
    uctx.save();
    uctx.textAlign = 'center';
    uctx.textBaseline = 'middle';
    uctx.lineJoin = 'round';
    board.texts.forEach((t) => {
      // 字号与屏幕 cqw 口径一致：units/100 * 地图宽（随导出缩放 K），与角色图标 d = size/100 * W * K 同基准
      const px = Math.max(1, t.size * 0.18) / 100 * W * K;
      uctx.font = `700 ${px}px 'Noto Sans SC', sans-serif`;
      const lines = String(t.text).split('\n');
      const lh = px * 1.35;
      const [tx, ty0] = PXY(t.x, t.y);
      lines.forEach((line, i) => {
        const ty = ty0 + (i - (lines.length - 1) / 2) * lh;
        uctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        uctx.lineWidth = Math.max(2, px / 6);
        uctx.strokeText(line, tx, ty);
        uctx.fillStyle = t.color;
        uctx.fillText(line, tx, ty);
      });
    });
    uctx.restore();

    // ---- 推算标注（红圈 / 圆点 / 时间文字，全部保持正立） ----
    // 屏幕上的固定 px 尺寸（圆点 12px、文字 10/11px、标签上移 15px）按输出比例换算
    const fx = (oW / wrapX) * K;
    const ringLw = Math.max(1.5, 2 * (W * K) / wrapW);
    const drawRing = (x, z) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      const d = tacDisplay.rocketChairSize * 1.5 / 100 * W * K;
      uctx.save();
      uctx.strokeStyle = '#ff5252';
      uctx.lineWidth = ringLw;
      uctx.beginPath();
      uctx.arc(cx, cy, Math.max(1, d / 2 - ringLw / 2), 0, Math.PI * 2);
      uctx.stroke();
      uctx.restore();
    };
    const drawDot = (x, z, color) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      uctx.save();
      uctx.fillStyle = color;
      uctx.strokeStyle = '#fff';
      uctx.lineWidth = Math.max(1, 2 * fx);
      uctx.beginPath();
      uctx.arc(cx, cy, Math.max(2, 6 * fx), 0, Math.PI * 2);
      uctx.fill();
      uctx.stroke();
      uctx.restore();
    };
    const drawLabel = (x, z, text, color, sizePx) => {
      const [cx, cy] = PXY(x / W0, z / H0);
      const px = sizePx * fx;
      uctx.save();
      uctx.font = `700 ${px}px 'Noto Sans SC', sans-serif`;
      uctx.textAlign = 'center';
      uctx.textBaseline = 'middle';
      uctx.lineJoin = 'round';
      uctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      uctx.lineWidth = Math.max(1.5, px / 5);
      uctx.strokeText(text, cx, cy - 15 * fx);
      uctx.fillStyle = color;
      uctx.fillText(text, cx, cy - 15 * fx);
      uctx.restore();
    };
    // 选中椅的正圆红框（与屏幕一致：椅子模式、未勾选隐藏选中圈、对应图标组显示中）
    const sel = tacCarryState.chair;
    if (sel && sel.kind !== 'point' && !tacDisplay.carryHideRing
        && (sel.kind === 'basement' ? tacDisplay.rocketChairsBasement : tacDisplay.rocketChairs)) {
      drawRing(sel.x, sel.z);
    }
    // 明细行点击的标记红圈
    const markRows = tacCarryState.cache?.chairRows;
    if (tacCarryState.detailMark != null && markRows?.[tacCarryState.detailMark]
        && tacCarryState.mode === 'point') {
      drawRing(markRows[tacCarryState.detailMark].x, markRows[tacCarryState.detailMark].z);
    }
    // 选点模式的起点圆点 / 路径规划的 A/B 端点圆点
    if (sel?.kind === 'point') drawDot(sel.x, sel.z, 'rgba(255, 82, 82, 0.9)');
    if (tacPathState.points.a) drawDot(tacPathState.points.a.x, tacPathState.points.a.z, 'rgba(255, 82, 82, 0.9)');
    if (tacPathState.points.b) drawDot(tacPathState.points.b.x, tacPathState.points.b.z, 'rgba(50, 139, 255, 0.9)');
    // 选点模式各椅时间标注（颜色随被关色带外推，与屏幕一致）
    const cache = tacCarryState.cache;
    if (cache && tacCarryState.resultMapId === S.currentMapId
        && tacCarryState.mode === 'point' && cache.chairRows) {
      const tide = cache.scenario === 'tide';
      const colors = tide ? TIDE_BAND_COLORS : CARRY_BAND_COLORS;
      const resolve = (band) => {
        let b = band;
        while (b < colors.length && tacCarryState.hiddenBands.has(b)) b++;
        return b < colors.length ? b : -1;
      };
      for (const r of cache.chairRows) {
        const shown = resolve(r.band);
        const text = tide
          ? translate(r.band === 4 ? 'ui.tac.rocketChair.tideTurner.point.map.timeMargin' : 'ui.tac.rocketChair.tideTurner.point.map.timeSeconds', { seconds: r.t.toFixed(1) })
          : translate(carryDropBudget(cache.profile, r.t).risk
            ? 'ui.tac.rocketChair.balloon.point.map.timeRisk' : 'ui.tac.rocketChair.balloon.point.map.timeSeconds', { seconds: r.t.toFixed(1) });
        drawLabel(r.x, r.z, text, shown >= 0 ? colors[shown] : '#a4afbb', 10);
      }
    }
    // 起点文字（牵气球起点 / 起点）与路径 A/B 端点文字
    if (sel?.kind === 'point') {
      drawLabel(sel.x, sel.z,
        translate(tacCarryState.scenario === 'tide' ? 'ui.tac.rocketChair.tideTurner.point.map.startLabel' : 'ui.tac.rocketChair.balloon.point.map.startLabel'),
        '#ff5252', 11);
    }
    if (tacPathState.points.a) {
      drawLabel(tacPathState.points.a.x, tacPathState.points.a.z,
        translate('ui.tac.path.map.point.A'), '#ff5252', 11);
    }
    if (tacPathState.points.b) {
      drawLabel(tacPathState.points.b.x, tacPathState.points.b.z,
        translate('ui.tac.path.map.piont.B'), '#328bff', 11);
    }
  };

  // 固定点位范围椭圆（教授鳞片 / 摄影师照相机 / 疯眼控制台及范围 / 小丑零件 / 冒险家书页）
  // 图标在 paintUprightOverlays 中正立绘制
  for (const [role, cfg] of Object.entries(map.fixedSpawns || {})) {
    const token = tacTokenByRole(role);
    if (!token) continue;
    const fsItems = (Array.isArray(cfg.item) ? cfg.item : [cfg.item]).filter(Boolean);
    fsItems.forEach((item) => {
      if (!(token.showFixedSpawnRange && item.rangeM && item.rangeScreenM && map.widthM)) return;
      const [screenW, screenH] = item.rangeScreenM[token.fixedSpawnDevice === 'ios' ? 'ios' : 'pc'];
      const metersToPxX = W / (vw * map.widthM);
      const metersToPxY = metersToPxX;
      const outerW = (item.rangeM * 2 + screenW) * metersToPxX;
      const outerH = (item.rangeM * 2 + screenH) * metersToPxY;
      ctx.save();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.fillStyle = 'rgba(125, 211, 252, 0.08)';
      ctx.lineWidth = Math.max(1.2, W * K / 500);
      ctx.setLineDash([W * K / 50, W * K / 80]);
      item.points.forEach((pt) => {
        const p = item.flag_orientation ? pt.p : pt;
        ctx.beginPath();
        ctx.ellipse(PX(p[0] / W0), PY(p[1] / H0), outerW / 2, outerH / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
      ctx.restore();
    });
    // 朝向箭头（随地图旋转绘制，指向与屏幕一致）
    if (token.showFixedSpawns) fsItems.forEach((item) => {
      if (!item.flag_orientation) return;
      item.points.forEach((pt) => {
        const x = PX(pt.p[0] / W0), y = PY(pt.p[1] / H0);
        const ang = Math.atan2(pt.d[1], pt.d[0]);
        const arrowLen = 0.022 * W * K;
        ctx.save();
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = Math.max(1.5, W * K / 300);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.stroke();
        const head = arrowLen * 0.42;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.lineTo(x + Math.cos(ang) * (arrowLen - head) + Math.cos(ang + Math.PI / 2) * head * 0.6,
          y + Math.sin(ang) * (arrowLen - head) + Math.sin(ang + Math.PI / 2) * head * 0.6);
        ctx.moveTo(x + Math.cos(ang) * arrowLen, y + Math.sin(ang) * arrowLen);
        ctx.lineTo(x + Math.cos(ang) * (arrowLen - head) + Math.cos(ang - Math.PI / 2) * head * 0.6,
          y + Math.sin(ang) * (arrowLen - head) + Math.sin(ang - Math.PI / 2) * head * 0.6);
        ctx.stroke();
        ctx.restore();
      });
    });
  }

  const board = tacBoard();

  const itemIconCache = {};
  await Promise.all(board.items.map(async (it) => {
    const def = TAC_ITEM_TYPES[it.kind];
    if (def && def.icon && !it.hideIcon && itemIconCache[it.kind] === undefined)
      itemIconCache[it.kind] = await tacLoadImg(def.icon);
  }));
  // 造物范围圆（随地图画布旋转绘制，圆旋转后仍为正圆）
  for (const it of board.items) {
    const def = TAC_ITEM_TYPES[it.kind];
    if (!def) continue;
    const x = PX(it.x), y = PY(it.y);
    const sizePct = tacItemSizePercent(it);
    if (sizePct !== null) {
      const d = sizePct / 100 * W * K;
      ctx.save();
      if (def.fill) { ctx.fillStyle = def.fill; }
      ctx.strokeStyle = def.color || '#e2e8f0';
      ctx.setLineDash([W * K / 60, W * K / 90]);
      ctx.lineWidth = Math.max(1.5, W * K / 350);
      ctx.beginPath();
      ctx.arc(x, y, d / 2, 0, Math.PI * 2);
      if (def.fill) ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.restore();
    }
  }

  // 图标与文字：k=0 直接绘制；旋转导出时在整图旋转完成后绘制（保持正立）
  if (rotK === 0) await paintUprightOverlays();


  ctx.save();
  ctx.lineWidth = Math.max(1.5, W * K / 400);
  board.measures.forEach((m, idx) => {
    if (!tacLineStyle(m).showEndpoints) return;
    const isChain = m.chain != null;
    if (isChain && !(chainFirst[m.chain] === idx || chainLast[m.chain] === idx)) return;
    const dotColor = tacMeasureSegColor(m);
    [['x1', 'y1'], ['x2', 'y2']].forEach(([kx, ky]) => {
      if (isChain) {
        const isStartEnd =
          (chainFirst[m.chain] === idx && kx === 'x1')
          || (chainLast[m.chain] === idx && kx === 'x2');
        if (!isStartEnd) return;
      }
      ctx.fillStyle = dotColor;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(PX(m[kx]), PY(m[ky]), 6 * sx * K, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  });
  ctx.restore();


  // 按当前旋转角度整图逆时针旋转；SVG 层文字已带正立补偿，
  // 图标/图文等正立叠加层在旋转后补绘到输出画布上
  let out = cv;
  if (rotK) {
    const rcv = document.createElement('canvas');
    rcv.width = rotK % 2 === 1 ? cv.height : cv.width;
    rcv.height = rotK % 2 === 1 ? cv.width : cv.height;
    const rctx = rcv.getContext('2d');
    rctx.save();
    rctx.translate(rcv.width / 2, rcv.height / 2);
    rctx.rotate(-Math.PI / 2 * rotK);
    rctx.drawImage(cv, -cv.width / 2, -cv.height / 2);
    rctx.restore();
    out = rcv;
    // uctx 与 rctx 是同一上下文：必须先恢复单位变换，正立层才能按输出坐标直绘
    uctx = out.getContext('2d');
    uctx.setTransform(1, 0, 0, 1, 0, 0);
    // 与像素拷贝共用同一几何：地图分数 → cv 像素 → 整图旋转到输出像素
    PXY = (fx, fy) => {
      const cx = (fx - vx) * W / vw, cy = (fy - vy) * H / vh;
      switch (rotK) {
        case 1: return [cy, W - cx];
        case 2: return [W - cx, H - cy];
        case 3: return [H - cy, cx];
        default: return [cx, cy];
      }
    };
    await paintUprightOverlays();
  }

  const fileName = translate("ui.tac.export.saveName", { name: map.mapName });
  // 微信 / B 站 App 的 webview 会拦截 <a download> 下载，改为弹出图片供长按保存
  const saveByLongPress = /MicroMessenger|bili/i.test(navigator.userAgent);
  const openSaveOverlay = (dataUrl) => {
    if (!tacSaveOverlay || !tacSaveImg) return false;
    tacSaveImg.src = dataUrl;
    tacSaveOverlay.hidden = false;
    return true;
  };
  const download = (blobUrl) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  try {
    if (saveByLongPress) {
      if (!openSaveOverlay(out.toDataURL('image/png'))) throw new Error('save overlay unavailable');
      showToast(translate("ui.tac.export.saveOverlay.toast"));
      return;
    }
    if (out.toBlob) {
      out.toBlob(async (blob) => {
        if (!blob) { showToast(translate("ui.tac.export.note.false1")); return; }
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
            return;
          } catch (err) {
            if (err && err.name === 'AbortError') return;
          }
        }
        const url = URL.createObjectURL(blob);
        download(url);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        showToast(translate("ui.tac.export.note.true"));
      }, 'image/png');
    } else {
      download(out.toDataURL('image/png'));
      showToast(translate("ui.tac.export.note.true"));
    }
  } catch (err) {
    showToast(translate("ui.tac.export.note.false2"));
  }
}

export function bindImageExport() {
  tacExportBtn.addEventListener('click', tacExportImage);

  // 长按保存弹层：关闭按钮 / 点背景 / Esc
  if (tacSaveOverlay && tacSaveClose) {
    const closeSaveOverlay = () => { tacSaveOverlay.hidden = true; };
    tacSaveClose.addEventListener('click', closeSaveOverlay);
    tacSaveOverlay.addEventListener('click', (event) => {
      if (event.target === tacSaveOverlay) closeSaveOverlay();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !tacSaveOverlay.hidden) closeSaveOverlay();
    });
  }
}

export {
  tacExportImage,
  tacLoadImg,
};
