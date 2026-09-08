# <%= moduleName %>

<%= moduleDescription %>

## Project structure

```
<%= unscopedModuleName %>
├── src/
│   ├── index.<%= typeSupport %>              # Entry point<% if (typeSupport === 'js') { %>
│   ├── index.d.ts            # Type definitions for the entry point<% } %>
│   └── index.test.ts         # Tests
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
pnpm build     # Bundle with tsdown
```

## Testing

- Uses `vitest` and `@fast-check/vitest`
- `*.test.ts` files are colocated with implementation
