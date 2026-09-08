# <%= moduleName %>

<%= moduleDescription %>

## Project structure

```
<%= unscopedModuleName %>
├── src/
│   ├── index.<%= typeSupport %>              # <% if (hasLib) { %>API entry point<% } else { %>Implementation<% } %><% if (typeSupport === 'js') { %>
│   ├── index.d.ts            # Type definitions for the entry point<% } %>
│   <% if (hasCli) { %>├<% } else { %>└<% } %>── index.test.ts         # Tests<% if (hasCli) { %>
│   └── cli/
│       ├── index.<%= typeSupport %>          # CLI entry point: Optique flag definitions and the program
│       └── index.test.ts     # Tests that spawn the CLI<% } %>
│
└── .claude/
    └── hooks/lint-format.sh  # Lints and formats each written file
```

## Development

```sh
# Everything CI runs, in CI's order. Run before handing work back
pnpm check

pnpm format
pnpm lint<% if (typeSupport === 'ts') { %>
pnpm typecheck<% } %>
pnpm knip      # Find unused files, dependencies, and exports
pnpm test
pnpm test -u   # Update snapshots
pnpm coverage
pnpm build     # Bundle with tsdown<% if (hasCli) { %>

# Run the CLI from source (Node runs the <% if (typeSupport === 'ts') { %>TypeScript<% } else { %>JavaScript<% } %> directly)
node src/cli/index.<%= typeSupport %><% } %>
```

## Testing

- Uses `vitest` and `@fast-check/vitest`
- `*.test.ts` files are colocated with implementation<% if (hasCli) { %>
- CLI tests spawn `src/cli/index.<%= typeSupport %>` in a subprocess and assert on its
  exit status and output<% } %>
