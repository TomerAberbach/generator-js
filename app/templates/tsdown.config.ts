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
    minify: false,
    plugins: [
      terser({
        // Assume modern JavaScript
        ecma: 2020,
        module: true,
        toplevel: true,
        // Run multiple times
        compress: {
          passes: 3,
        },
        // Mangle underscore prefixed properties
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
