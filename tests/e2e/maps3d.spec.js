import { test, expect } from '@playwright/test';

// 每个 3D 用例都要解析 40MB 自包含 runtime；fullyParallel 会让多个用例同时
// 加载多个 3D 页，CI 共享 runner（7GB + 软件渲染）内存打满后出现渲染进程
// 崩溃 / WebGL 上下文丢失（表现为页面报错、导航不生效）。串行执行把峰值
// 内存压到单页。--disable-dev-shm-usage 避免受限 /dev/shm 下的渲染崩溃。
test.use({ launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-dev-shm-usage'] } });

test.describe('maps3d', () => {
  test.describe.configure({ mode: 'serial' });

  test('the public 3D path opens the map list and a complete self-contained scene', async ({ page }) => {
    // 自包含 3D 场景就绪是纯 CPU 工作（解析 40MB runtime、构建碰撞 BVH）；
    // GitHub 共享 runner（软件渲染）上可能远慢于本地，放宽到 8 分钟。
    test.setTimeout(480000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // 控制台错误仅记录用于诊断（WebGL 警告等在软件渲染下常见，不算失败）
    page.on('console', msg => {
      if (msg.type() === 'error') console.log('[maps3d][console.error]', msg.text());
    });
    await page.goto('/tactical-friend/3d/');
    await expect(page.locator('.grid a')).toHaveCount(10, { timeout: 30000 });
    await page.getByRole('link', { name: '军工厂', exact: true }).click();
    await expect(page).toHaveURL(/\/tactical-friend\/3d\/ordnance_factory1\.html$/, { timeout: 60000 });
    // waitForFunction 默认用 requestAnimationFrame 轮询：CI 软件渲染下页面 CPU 打满时
    // raf 可能长时间不触发，造成「其实已就绪却轮不到」的假性超时，这里改用定时轮询。
    const isReady = () => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready
      && window.viewerAPI?.worldCollision?.().state === 'ready';
    // 就绪条件拆开诊断：超时时报告到底卡在哪个 API / 加载阶段
    const diagnose = () => page.evaluate(() => ({
      measure: !!window.measureAPI?.stats().ready,
      tactics: !!window.tacticsAPI?.stats().ready,
      collision: window.viewerAPI?.worldCollision?.().state ?? null,
      stage: document.querySelector('#pil-loading')?.dataset.stage ?? null,
      step: document.querySelector('#pil-loading-step')?.textContent ?? null,
      loadingError: document.querySelector('#pil-loading-error')?.textContent ?? null,
    })).catch(() => null);
    const waitReady = (timeout) => page.waitForFunction(isReady, null, { timeout, polling: 1000 });
    try {
      await waitReady(180000);
    } catch (first) {
      // CI 偶发初始化卡死：记录卡住状态后整页重载再试一次
      const stuck = await diagnose();
      console.log('[maps3d] 3D 初始化超时，整页重载再试。卡住状态:', JSON.stringify(stuck));
      await page.reload();
      await expect(page).toHaveURL(/\/tactical-friend\/3d\/ordnance_factory1\.html$/, { timeout: 60000 });
      try {
        await waitReady(180000);
      } catch (second) {
        const stuck2 = await diagnose();
        throw new Error(`3D 初始化两次均未就绪。首次卡住: ${JSON.stringify(stuck)}；重载后卡住: ${JSON.stringify(stuck2)}`);
      }
    }
    expect(await page.evaluate(() => window.viewerAPI.worldCollision().triangleCount)).toBeGreaterThan(0);
    await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', /\/tactical-friend\/\?map=0$/);
    expect(errors).toEqual([]);
  });

  for (const prefix of ['/tactical-friend', '/zhanshuyanlian']) {
    test(`2D/3D navigation preserves ${prefix} in both directions`, async ({ page }) => {
      // 同上：3D 就绪在 CI 软件渲染下耗时不可控，放宽到 4 分钟。
      test.setTimeout(240000);
      await page.route('https://**/*', route => route.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="750" height="644"/>' }));
      await page.goto(prefix + '/');
      await page.locator('.home-card').first().click();
      await page.locator('[data-map-3d]:visible').first().click();
      await expect(page).toHaveURL(new RegExp(prefix + '/3d/ordnance_factory1\\.html$'), { timeout: 60000 });
      // waitForFunction 默认仅 30s 且不吃 test.setTimeout，CI 软件渲染下必须显式放宽；
      // 同样改用定时轮询，避免 CPU 打满时 raf 不触发造成的假性超时
      await page.waitForFunction(() => window.measureAPI?.stats().ready && window.tacticsAPI?.stats().ready, null, { timeout: 180000, polling: 1000 });
      await expect(page.locator('.pil-handoff-back')).toHaveAttribute('href', new RegExp(prefix + '/\\?map=0$'), { timeout: 30000 });
      await page.locator('.pil-handoff-back').click({ timeout: 60000 });
      await expect(page).toHaveURL(new RegExp(prefix + '/\\?map=0$'), { timeout: 60000 });
    });
  }
});
