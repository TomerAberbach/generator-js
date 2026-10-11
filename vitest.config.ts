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
  },
})
