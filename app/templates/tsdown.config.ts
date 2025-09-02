import { defineConfig } from 'tsdown/config'<% if (supportsBrowser) { %>
import treeShakeable from 'rollup-plugin-tree-shakeable'
import terser from '@rollup/plugin-terser'<% } %>

export default defineConfig([
  {
    entry: `src/index.<%= typeSupport %>`,
    platform: `<% if (supportsBrowser) { %>neutral<% } else { %>node<% } %>`,
    sourcemap: `inline`,
    dts: false,
    publint: true,<% if (supportsBrowser) { %>
    plugins: [
      terser({
        mangle: {
          properties: {
            regex: `^_[^_]+`,
          },
        },
      }),
      treeShakeable(),
    ],<% } %>
  },
  {
    entry: `src/index.<% if (typeSupport === 'ts') { %>ts<% } else { %>d.ts<% } %>`,
    dts: { emitDtsOnly: true },
  },
])
