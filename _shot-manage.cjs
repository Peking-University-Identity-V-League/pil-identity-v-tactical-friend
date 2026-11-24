const { spawn } = require('child_process');
const { chromium } = require('playwright');
const path = require('path');

const root = process.cwd();
const srv = spawn(process.execPath, ['scripts/dev-server.js', '--host', '127.0.0.1', '--port', '7219'], { cwd: root, stdio: 'ignore' });
const kill = () => { try { srv.kill(); } catch {} };
process.on('exit', kill);

(async () => {
  await new Promise((r) => setTimeout(r, 1500));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto('http://127.0.0.1:7219/');
  await page.locator('.home-card').first().click();
  await page.waitForTimeout(800);
  // 放一个角色并选中
  await page.locator('.tac-tool-btn', { hasText: '✚' }).first().click().catch(()=>{});
  // 用 helpers 同款方式：工具栏「角色」
  await page.evaluate(() => import('/js/tactic.js').then((m) => { m.tacTool; }));
  // 直接通过 UI：角色工具
  const tools = await page.locator('.tac-toolbar button').allTextContents();
  console.log('tools:', tools.join(' | '));
  // 点击角色工具
  await page.locator('.tac-toolbar button').nth(1).click(); // ✚ 角色
  await page.waitForTimeout(300);
  await page.locator('.tac-role').first().click();
  const map = await page.locator('#tacMapWrap, .tac-map-wrap').first();
  const bb = await map.boundingBox();
  await page.mouse.click(bb.x + bb.width * 0.3, bb.y + bb.height * 0.3);
  await page.waitForTimeout(400);
  // 切回选择工具并点选造物
  await page.locator('.tac-toolbar button').first().click();
  await page.mouse.click(bb.x + bb.width * 0.3, bb.y + bb.height * 0.3);
  await page.waitForTimeout(400);
  const card = await page.locator('#tacManageCard').boundingBox();
  await page.screenshot({ path: 'shot-manage-select.png', clip: card });
  // 动画工具
  await page.locator('.tac-toolbar button').nth(4).click(); // ▶ 动画
  await page.waitForTimeout(400);
  const card2 = await page.locator('#tacManageCard').boundingBox();
  await page.screenshot({ path: 'shot-manage-anim.png', clip: card2 });
  console.log('title(select)=', await page.locator('#tacManageCard .ded-sec-zh').textContent());
  await browser.close();
  kill();
  process.exit(0);
})().catch((e) => { console.error(e); kill(); process.exit(1); });
