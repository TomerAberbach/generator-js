import { defineConfig } from 'tsdown/config'<% if (supportsBrowser) { %>
import treeShakeable from 'rollup-plugin-tree-shakeable'
import terser from '@rollup/plugin-terser'<% } %>

export default defineConfig([
  {
    entry: `src/index.<%= typeSupport %>`,
    platform: `neutral`,
    sourcemap: `inline`,
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
