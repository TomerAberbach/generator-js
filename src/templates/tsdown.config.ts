import { defineConfig } from 'tsdown/config'<% if (hasLib && supportsBrowser) { %>
import treeShakeable from 'rollup-plugin-tree-shakeable'
import terser from '@rollup/plugin-terser'<% } %>

export default defineConfig([<% if (hasLib) { %>
  {
    entry: `src/index.<%= typeSupport %>`,
    platform: `<% if (supportsBrowser) { %>neutral<% } else { %>node<% } %>`,
    sourcemap: `inline`,
    fixedExtension: false,
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
  },<% } %><% if (hasCli) { %>
  {
    entry: `src/cli/index.<%= typeSupport %>`,
    outDir: `dist/cli`,
    platform: `node`,
    dts: false,
    minify: false,<% if (!hasLib) { %>
    publint: true,<% } %>
    banner: { js: `#!/usr/bin/env node` },
  },<% } %>
])
