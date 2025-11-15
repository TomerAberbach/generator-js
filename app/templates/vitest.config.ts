import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: `<% if (supportsBrowser) { %>jsdom<% } else { %>node<% } %>`,
    setupFiles: [`vitest.setup.ts`],
    coverage: {
      include: [`src`],
      exclude: [`*.bench.ts`],
    },
  },
})
