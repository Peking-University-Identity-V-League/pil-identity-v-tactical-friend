import { readFile } from 'node:fs/promises';
import { test, expect, tool, clickPoint, point, drag, switchMap, waitForSave, pickRole } from './helpers.js';

async function enableTreasure(page) {
  // Choose a central cipher so its excluded ring remains inside the cropped view.
  const position = await page.evaluate(async () => {
    const { MAPS_DATA } = await import('/js/data/maps.js');
    const map = MAPS_DATA[0];
    const candidates = map.cipherCombinations[0].map(id => map.ciphers.find(c => c.id === id));
    const [width, height] = map.mapSize;
    candidates.sort((a, b) =>
      Math.hypot(a.location[0] / width - 0.5, a.location[1] / height - 0.5)
      - Math.hypot(b.location[0] / width - 0.5, b.location[1] / height - 0.5));
    return { x: candidates[0].location[0] / width, y: candidates[0].location[1] / height };
  });
  await tool(page, 'roles');
  await pickRole(page, 'explorer');
  await clickPoint(page, position.x, position.y);
  await tool(page, 'select');
  await treasureToggle(page).check();
  await expect(page.locator('.tac-treasure-ring.excluded')).toHaveCount(1);
  return position;
}

const treasureToggle = page => page.locator('.tac-manage-row')
  .filter({ hasText: '推算可能刷密码书页' }).locator('input');
const rings = page => page.locator('.tac-treasure-ring').evaluateAll(elements =>
  elements.map(el => [el.style.left, el.style.top, el.style.width, el.classList.contains('excluded')]));

async function exportPNG(page, testInfo, name) {
  const pending = page.waitForEvent('download');
  await page.locator('#tacExportBtn').click();
  const download = await pending;
  const path = testInfo.outputPath(`${name}.png`);
  await download.saveAs(path);
  return (await readFile(path)).toString('base64');
}

// Decode actual downloaded PNGs in a detached canvas. Application state is not changed.
async function inspectPNG(page, png, reference = null, crop = null) {
  return page.evaluate(async ({ png, reference, crop }) => {
    const decode = async data => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      return image;
    };
    const image = await decode(png);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const color = (data, i) => {
      const [r, g, b] = data.slice(i, i + 3);
      if (r > g + 5 && g > b + 15) return 1;
      if (b > r + 15 && g > r + 5) return 2;
      return 0;
    };
    const counts = [0, 0, 0];
    for (let i = 0; i < pixels.length; i += 4) counts[color(pixels, i)]++;
    let overlap = null;
    if (reference) {
      const full = await decode(reference);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(full, crop.x * full.naturalWidth, crop.y * full.naturalHeight,
        crop.width * full.naturalWidth, crop.height * full.naturalHeight,
        0, 0, canvas.width, canvas.height);
      const expected = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let matching = 0, expectedColored = 0;
      for (let i = 0; i < expected.length; i += 4) {
        const c = color(expected, i);
        if (c) {
          expectedColored++;
          if (color(pixels, i) === c) matching++;
        }
      }
      overlap = matching / expectedColored;
    }
    return { width: canvas.width, height: canvas.height, gold: counts[1], blue: counts[2], overlap };
  }, { png, reference, crop });
}

test('treasure prediction refreshes when cipher groups change with icons hidden', async ({ page }) => {
  await enableTreasure(page);
  const first = await rings(page);
  await tool(page, 'display');
  await page.locator('#tacShowCiphers').uncheck();
  await page.locator('#tacDispCipherNext').click();
  const hidden = await rings(page);
  expect(hidden.length).toBeGreaterThan(0);
  expect(hidden).not.toEqual(first);
  await expect(page.locator('.tac-cipher')).toHaveCount(0);
  await page.locator('#tacShowCiphers').check();
  expect(await rings(page)).toEqual(hidden);
});

test('disabling, switching maps and deleting the explorer remove stale treasure overlays', async ({ page }) => {
  const position = await enableTreasure(page);
  await treasureToggle(page).uncheck();
  await expect(page.locator('.tac-treasure-ring')).toHaveCount(0);
  await treasureToggle(page).check();
  const original = await rings(page);
  await waitForSave(page);
  await switchMap(page, 1);
  await expect(page.locator('.tac-treasure-ring')).toHaveCount(0);
  await switchMap(page, 0);
  expect(await rings(page)).toEqual(original);
  await tool(page, 'delete');
  await clickPoint(page, position.x, position.y);
  await expect(page.locator('.tac-treasure-ring')).toHaveCount(0);
});

test('export includes both normal and excluded treasure rings only while enabled', async ({ page }, testInfo) => {
  await enableTreasure(page);
  const mapSize = await page.evaluate(async () => {
    const { MAPS_DATA } = await import('/js/data/maps.js');
    return MAPS_DATA[0].mapSize;
  });
  const enabled = await exportPNG(page, testInfo, 'treasure-enabled');
  const shown = await inspectPNG(page, enabled);
  // exportCrop off (default): the full map at its native resolution.
  expect(shown.width).toBe(mapSize[0]);
  expect(shown.height).toBe(mapSize[1]);
  expect(shown.gold).toBeGreaterThan(100);
  expect(shown.blue).toBeGreaterThan(100);
  await treasureToggle(page).uncheck();
  const disabled = await exportPNG(page, testInfo, 'treasure-disabled');
  expect(disabled).not.toBe(enabled);
  const hidden = await inspectPNG(page, disabled);
  expect(hidden.gold).toBe(0);
  expect(hidden.blue).toBe(0);
});

test('zoomed and panned PNG crops keep treasure rings aligned and correctly sized', async ({ page }, testInfo) => {
  await enableTreasure(page);
  const full = await exportPNG(page, testInfo, 'treasure-full');
  const wrap = await page.evaluate(() => {
    const el = document.querySelector('#tacMapWrap');
    return { width: el.clientWidth, height: el.clientHeight };
  });
  await tool(page, 'display');
  await page.locator('#tacExportCrop').check();
  await page.locator('#tacZoomIn').click();
  await page.locator('#tacZoomIn').click();
  await page.locator('#tacZoomPan').click();
  const centre = await point(page, 0.5, 0.5);
  await drag(page, centre, { x: centre.x + 30, y: centre.y - 20 });
  const crop = await page.evaluate(async () => {
    const { tacZoomState: zoom } = await import('/js/tactic.js');
    const wrap = document.querySelector('#tacMapWrap');
    return { x: -zoom.tx / (zoom.scale * wrap.clientWidth), y: -zoom.ty / (zoom.scale * wrap.clientHeight),
      width: 1 / zoom.scale, height: 1 / zoom.scale };
  });
  const cropped = await exportPNG(page, testInfo, 'treasure-cropped');
  const result = await inspectPNG(page, cropped, full, crop);
  // The export always matches the on-screen map size, regardless of zoom.
  expect(result.width).toBe(wrap.width);
  expect(result.height).toBe(wrap.height);
  expect(result.gold).toBeGreaterThan(100);
  expect(result.blue).toBeGreaterThan(100);
  // Compare the ring colors to a crop of the actual full-map PNG, allowing
  // rasterization differences at borders and existing icon-size differences.
  expect(result.overlap).toBeGreaterThan(0.9);
});
