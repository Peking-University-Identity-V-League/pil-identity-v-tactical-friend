import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/packaged', workers: 1,
  // 打包测试同样加载重量级 3D 场景，CI 上允许失败重试一次以吸收环境抖动。
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:8787', browserName: 'chromium', launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } },
  webServer: { command: 'npm --prefix deploy run preview', url: 'http://127.0.0.1:8787/tactical-friend/', reuseExistingServer: false },
});
