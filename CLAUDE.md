# generator-js

A Yeoman generator that scaffolds a JavaScript or TypeScript module.

## Project structure

```
generator-js
├── src/
│   ├── index.ts                  # The generator: prompts, template copying, and post-install checks
│   ├── index.test.ts             # Scaffolds a module per answer configuration and runs its `pnpm check`
│   ├── scaffold.ts               # Runs the built generator with answers from the command line
│   ├── global-setup.ts           # Rebuilds generators/app/ before every test run and watch rerun
│   └── templates/                # EJS templates copied into the scaffolded module
│       ├── _CLAUDE.md            # Renamed to CLAUDE.md
│       ├── _package.json         # Renamed to package.json
│       ├── claude/               # Renamed to .claude/
│       ├── github/               # Renamed to .github/
│       ├── gitattributes         # Renamed to .gitattributes (likewise gitignore and prettierignore)
│       └── src/                  # Entry points and tests; index.ts or index.js plus index.d.ts by type support
│
├── generators/app/              # Build output that Yeoman looks up: the bundled generator plus a copy of the templates
│
└── .claude/
    └── hooks/lint-format.sh      # Lints and formats each written file
```

## Development

```sh
# Everything CI runs. Run before handing work back
pnpm check

pnpm build    # Bundle the generator and copy the templates into generators/app/
pnpm test     # Build, then scaffold modules and run their checks; takes about 30 seconds

# Scaffold one configuration, named "<packageType>, <typeSupport>"
pnpm test --run -t "cli, js"
```

Templates are excluded from linting and formatting because they contain EJS
tags. `pnpm test` verifies a template change. A test failure includes the
scaffolded module's output and its directory, which the test keeps for
inspection.

## Generator

- Yeoman runs every method of the generator class as a lifecycle task unless its
  name starts with `_`. Prefix helper methods with `_`, because `private`
  doesn't hide them at runtime

## Templates

- `_copyTemplates()` in `src/index.ts` lists the templates to copy. It copies
  `claude/` and `github/` whole and `src/` by glob. Add any other new template
  file to the list
- A template whose real name starts with `.`, or is `CLAUDE.md` or
  `package.json`, is stored under another name and renamed in
  `_renameTemplateFiles()`. Add the rename there when adding such a file
- Keep the templates in sync with the latest of my published packages: the
  scaffolded module must pass its own `pnpm check` on the first run
- `devDependencies()` and `install()` in `src/index.ts` pin each installed
  package to a major. Bump the pin after verifying the scaffolded module against
  the new major
