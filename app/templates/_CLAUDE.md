# <%= moduleName %>

<%= moduleDescription %>

## Development

```sh
pnpm format     # Format using `prettier`
pnpm lint       # Lint using `eslint`<% if (typeSupport === 'ts') { %>
pnpm typecheck  # Typecheck using `tsc`
<% } %>pnpm test       # Test using `vitest` (`-u` to update snapshots)
pnpm coverage   # Test with coverage using `vitest`
pnpm bench      # Benchmark using `vitest`
pnpm build      # Build using `tsdown`
```
