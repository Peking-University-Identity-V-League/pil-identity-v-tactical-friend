import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:7218',
    browserName: 'chromium',
    viewport: { width: 1600, height: 1400 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 7218',
    url: 'http://127.0.0.1:7218',
    reuseExistingServer: false,
  },
});
