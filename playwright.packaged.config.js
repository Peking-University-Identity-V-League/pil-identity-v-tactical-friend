import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/packaged', workers: 1,
  use: { baseURL: 'http://127.0.0.1:8787', browserName: 'chromium', launchOptions: { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] } },
  webServer: { command: 'npm --prefix deploy run preview', url: 'http://127.0.0.1:8787/tactical-friend/', reuseExistingServer: false },
});
