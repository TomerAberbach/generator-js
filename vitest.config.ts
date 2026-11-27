import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // `src/templates` contains the scaffolded module's own tests
    include: [`src/*.test.ts`],
    globalSetup: [`src/testing/global-setup.ts`],
    // The tests import neither the generator nor its templates
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      `src/index.ts`,
      `src/templates/**`,
    ],
    // Each test scaffolds a module, installs its dependencies, and runs its
    // checks
    testTimeout: 5 * 60_000,
    // Each scaffolded module runs its checks in parallel, and more modules at
    // once starve its CLI tests of CPU until they time out on a slow runner
    maxConcurrency: 2,
  },
})
