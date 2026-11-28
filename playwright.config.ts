import { defineConfig } from '@playwright/test';

// Screenshot regression check: `npm run test:visual` compares against tests/visual/*-snapshots.
export default defineConfig({
  testDir: 'tests/visual',
  timeout: 90_000,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/visual/report' }]],
  outputDir: 'tests/visual/results',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{-snapshotSuffix}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixels: 50, animations: 'disabled', caret: 'hide', timeout: 20_000 } },
  use: {
    baseURL: 'http://localhost:5199',
    viewport: { width: 1440, height: 900 }, // desktop-first site
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
  webServer: { command: 'npx vite --port 5199 --strictPort', url: 'http://localhost:5199', reuseExistingServer: true },
});
