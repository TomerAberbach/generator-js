import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: `<% if (supportsBrowser) { %>jsdom<% } else { %>node<% } %>`,
    coverage: {
      include: [`src`],
    },
  },
})
