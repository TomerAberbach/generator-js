# generator-js

A Yeoman generator that scaffolds a JavaScript or TypeScript module.

## Project structure

```
generator-js
├── app/
│   ├── index.js                  # The generator: prompts, template copying, and post-install checks
│   └── templates/                # EJS templates copied into the scaffolded module
│       ├── _CLAUDE.md            # Renamed to CLAUDE.md
│       ├── _package.json         # Renamed to package.json
│       ├── claude/               # Renamed to .claude/
│       ├── github/               # Renamed to .github/
│       ├── gitattributes         # Renamed to .gitattributes (likewise gitignore and prettierignore)
│       └── src/                  # Entry point, tests, and benchmarks; index.ts or index.js plus index.d.ts by type support
│
└── .claude/
    └── hooks/lint-format.sh      # Lints and formats each written file
```

## Development

```sh
# Everything CI runs, in CI's order. Run before handing work back
pnpm check

pnpm format
pnpm lint
pnpm knip     # Find unused files, dependencies, and exports
```

Templates are excluded from linting and formatting because they contain EJS
tags. Verify a template change by scaffolding a module and running its
`pnpm check`.

## Templates

- A file whose name starts with `_` or lacks a leading `.` is renamed in
  `writing()` in `app/index.js`. Add the rename there when adding such a file
- Keep the templates in sync with the latest of my published packages: the
  scaffolded module must pass its own `pnpm check` on the first run
