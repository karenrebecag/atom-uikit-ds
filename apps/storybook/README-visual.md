# Visual regression (Storybook test-runner)

OSS path (no Chromatic): Playwright screenshots per story × light/dark vs baselines
in `__image_snapshots__/`.

## First-time baselines

```bash
pnpm --filter @atom-uikit/tokens build
pnpm --filter @atom-uikit/storybook exec playwright install chromium
cd apps/storybook
# generate baselines
UPDATE_SNAPSHOTS=true pnpm test:visual:update
# commit __image_snapshots__/ (use Git LFS if large)
```

## Local check

```bash
pnpm --filter @atom-uikit/storybook test:visual
```

## Intentional UI change

1. Change tokens/CSS  
2. PR fails visual CI with diffs in artifacts  
3. Locally: `pnpm --filter @atom-uikit/storybook test:visual:update`  
4. Review image diff in PR, merge  

## Scope

All existing stories. Animations forced off + `prefers-reduced-motion` for stability.
