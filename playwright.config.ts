import { defineConfig, devices } from '@playwright/test';

// Safe check to see if we are running in the GitHub Actions CI environment
const isCI = typeof process !== 'undefined' && process.env && process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Give the cloud runner 60 seconds max per test to prevent cloud timeouts */
  timeout: 60000,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!isCI,

  /* Automatically retry a failed test twice on CI to handle temporary cloud network blips */
  retries: isCI ? 2 : 0,

  /* Limit parallel workers to 1 on CI to keep CPU usage stable on free cloud machines */
  workers: isCI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
