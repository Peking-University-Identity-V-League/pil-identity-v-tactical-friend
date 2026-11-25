import { test, expect, tool, clickPoint } from './helpers.js';

// 回归：切图时新底图加载完成前，旋转层（#tacRot）仍保持上一张地图的宽高比，
// 图片加载完成后旋转层高度才变化。外层容器固定正方形（aspect-ratio:1），
// 旧代码的 ResizeObserver 挂在外层容器上，捕获不到旋转层内部的尺寸变化，
// 导致 SVG viewBox 停留在旧地图宽高比，测距线/路径线与地图错位。
// 这里直接改变旋转层高度模拟该场景，验证 viewBox 跟随旋转层。

test('arrow svg viewBox follows rot layer resize', async ({ page }) => {
  await tool(page, 'measure');
  await clickPoint(page, 0.2, 0.4);
  await clickPoint(page, 0.8, 0.4);
  await page.keyboard.press('Escape');
  await expect(page.locator('#tacArrowSvg g[data-midx]')).toHaveCount(1);

  const read = () => page.evaluate(() => {
    const svg = document.getElementById('tacArrowSvg');
    const rot = document.getElementById('tacRot');
    const vb = (svg.getAttribute('viewBox') || '').split(' ').map(Number);
    return { vbW: vb[2], vbH: vb[3], rotW: rot.clientWidth, rotH: rot.clientHeight };
  });
  const aligned = (r) => Math.abs(r.vbW - r.rotW) < 2 && Math.abs(r.vbH - r.rotH) < 2;
  expect(aligned(await read())).toBe(true);

  // 模拟新底图加载后旋转层高度变化（宽度不变，与切图场景一致）
  await page.evaluate(() => {
    const rot = document.getElementById('tacRot');
    rot.style.height = `${Math.round(rot.clientHeight * 0.8)}px`;
  });
  await page.waitForTimeout(300);
  expect(aligned(await read())).toBe(true);

  // 还原
  await page.evaluate(() => {
    document.getElementById('tacRot').style.height = '';
  });
  await page.waitForTimeout(300);
  expect(aligned(await read())).toBe(true);
});
