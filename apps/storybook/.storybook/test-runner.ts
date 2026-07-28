import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { expect } from '@jest/globals';

const customSnapshotsDir = `${process.cwd()}/__image_snapshots__`;

/**
 * Visual regression: screenshot each story in light + dark.
 * Baselines live in apps/storybook/__image_snapshots__/
 * Update intentionally: UPDATE_SNAPSHOTS=true pnpm test:visual
 */
const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          caret-color: transparent !important;
        }
      `,
    });
  },
  async postVisit(page, context) {
    await page.evaluate(() => document.fonts.ready);

    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.style.colorScheme = t;
      }, theme);
      await page.waitForTimeout(50);

      const image = await page.screenshot({
        animations: 'disabled',
        caret: 'hide',
      });

      const id = `${context.id}__${theme}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      expect(image).toMatchImageSnapshot({
        customSnapshotsDir,
        customSnapshotIdentifier: id,
        failureThreshold: 0.01,
        failureThresholdType: 'percent',
      });
    }
  },
};

export default config;
