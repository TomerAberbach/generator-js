const getDevDependencies = includeTypes => {
  const devDependencies = [
    `@commitlint/cli`,
    `@commitlint/config-conventional`,
    `@tomer/eslint-config`,
    `@tomer/prettier-config`,
    `ava`,
    `ava-fast-check`,
    `c8`,
    `eslint`,
    `fast-check`,
    `husky`,
    `lint-staged`,
    `npm-run-all`,
    `prettier`
  ]

  if (includeTypes) {
    devDependencies.push(`typescript`, `tsd`)
  }

  return devDependencies
}

module.exports = getDevDependencies
