import type { TestRunnerConfig } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

// El config corre dentro del entorno Jest del test-runner, que inyecta `expect`
// como global; importarlo de @jest/globals aquí revienta (se carga fuera de Jest).
declare const expect: any;

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
    // Assets remotos (logos en R2/CDN) cargan o fallan según la red → snapshots
    // no deterministas. Todo lo que el snapshot necesita es local al build de
    // Storybook; se aborta el resto para que el fallo sea idéntico siempre.
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) return route.continue();
      return route.abort();
    });
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
    // Esperar a que toda <img> resuelva (load o error) antes de capturar
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map((img) => new Promise((r) => { img.onload = img.onerror = r; }))
      )
    );

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

      // Platform-suffixed baselines, the pattern Playwright's own toHaveScreenshot
      // uses by default ("you will need different snapshots" per platform — font
      // rasterization differs): darwin baselines serve the local styling loop,
      // linux baselines are what CI verifies. Both live in __image_snapshots__.
      const id = `${context.id}__${theme}__${process.platform}`.replace(/[^a-zA-Z0-9_-]/g, '_');
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
