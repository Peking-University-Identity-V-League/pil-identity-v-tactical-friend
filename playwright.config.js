import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  // CI 共享 runner 上 3D 场景（40MB 自包含 runtime + 软件渲染）偶尔需要远超本地的时间，
  // 失败时自动重试一次以吸收环境抖动；本地保持不重试。
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:7218',
    browserName: 'chromium',
    viewport: { width: 1600, height: 1400 },
    // 固定中文环境：Playwright 默认 locale 是 en-US，多语言支持上线后
    // 会按 navigator.language 自动进英文界面，导致既有中文断言全部失败
    locale: 'zh-CN',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 7218',
    url: 'http://127.0.0.1:7218',
    reuseExistingServer: false,
  },
});
