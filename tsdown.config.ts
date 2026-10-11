import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: `src/index.ts`,
  // Yeoman looks up `generators/<name>/index.js` and resolves templates
  // relative to it
  outDir: `generators/app`,
  fixedExtension: false,
  publint: true,
  copy: { from: `src/templates`, to: `generators/app`, flatten: false },
})
