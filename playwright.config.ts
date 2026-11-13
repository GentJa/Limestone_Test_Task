import { defineConfig, devices } from '@playwright/test';
import { env, storageStatePath } from './helpers/env.helper';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // HTML report is written to playwright-report/ (open with `npx playwright show-report`).
  reporter: [['list'], ['html', { open: 'never' }]],

  // Central upper limits only. Tests wait for conditions, never for durations.
  timeout: 30_000,
  expect: { timeout: 5_000 },

  use: {
    // SauceDemo exposes `data-test`, so getByTestId() maps to it.
    testIdAttribute: 'data-test',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: env.sauceBaseUrl },
    },
    {
      name: 'ui',
      testMatch: /ui\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.sauceBaseUrl,
        // Default session; per-user fixtures (standardUser, problemUser) load their own storageState.
        storageState: storageStatePath('standard'),
      },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json; charset=UTF-8' },
      },
    },
  ],
});
