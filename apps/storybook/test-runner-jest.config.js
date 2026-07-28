const { getJestConfig } = require('@storybook/test-runner');

/** @type {import('jest').Config} */
module.exports = {
  ...getJestConfig(),
  testTimeout: 60_000,
};
