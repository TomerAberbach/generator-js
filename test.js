import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import test from 'ava'
import pify from 'pify'
import helpers from 'yeoman-test'
import assert from 'yeoman-assert'
import del from 'del'

const tempDirname = join(dirname(fileURLToPath(import.meta.url)), `temp`)
const previousCwd = process.cwd()

test.after(async () => {
  process.chdir(previousCwd)
  await del(tempDirname)
})

let run
let mockPrompt

test.beforeEach(async () => {
  await pify(helpers.testDirectory)(tempDirname)

  const generator = await helpers.createGenerator(`js:app`, [`../app`], null, {
    skipInstall: true,
  })

  run = (...args) => generator.run(...args)
  mockPrompt = ({
    isNodeSupported = true,
    isBrowserSupported = true,
    includesTypes = false,
  } = {}) =>
    helpers.mockPrompt(generator, {
      moduleName: `the-best-module`,
      moduleDescription: `The best module.`,
      environmentSupport: { isNodeSupported, isBrowserSupported },
      includesTypes,
      license: {
        identifier: `the-best-developer`,
        name: `The Best Developer License`,
        requestContent: name => Promise.resolve(`${name} did it all!`),
      },
      name: `The Best Developer`,
      email: `thebestdeveloper@thebestdeveloper.com`,
      website: `https://thebestdeveloper.com`,
      githubUsername: `TheBestDeveloper`,
    })
})

test.serial(`generates expected files`, async () => {
  mockPrompt()

  await run()

  assert.file([
    `.git`,
    `.github/workflows/ci.yml`,
    `.gitignore`,
    `.npmrc`,
    `src/index.js`,
    `test/index.js`,
    `license`,
    `package.json`,
    `readme.md`,
  ])

  assert.noFile([`src/index.d.ts`, `test/index.d-test.ts`, `tsconfig.json`])
})

test.serial(`generates expected files when types are included`, async () => {
  mockPrompt({ includesTypes: true })

  await run()

  assert.file([
    `.git`,
    `.github/workflows/ci.yml`,
    `.gitignore`,
    `.npmrc`,
    `src/index.js`,
    `src/index.d.ts`,
    `test/index.js`,
    `test/index.d-test.ts`,
    `license`,
    `package.json`,
    `tsconfig.json`,
    `readme.md`,
  ])
})

test.serial(`fills in package.json fields`, async () => {
  mockPrompt()

  await run()

  assert.jsonFileContent(`package.json`, {
    name: `the-best-module`,
    author: {
      name: `The Best Developer`,
      email: `thebestdeveloper@thebestdeveloper.com`,
      url: `https://thebestdeveloper.com`,
    },
    description: `The best module.`,
    homepage: `https://github.com/TheBestDeveloper/the-best-module`,
    repository: `TheBestDeveloper/the-best-module`,
    bugs: {
      url: `https://github.com/TheBestDeveloper/the-best-module/issues`,
    },
    license: `the-best-developer`,
    engines: {
      node: `>= 12.17`,
    },
    browserslist: [`defaults`, `not IE 11`, `not op_mini all`],
  })
})

test.serial(
  `fills in package.json fields when types are included`,
  async () => {
    mockPrompt({ includesTypes: true })

    await run()

    assert.jsonFileContent(`package.json`, {
      types: `./src/index.d.ts`,
    })
  },
)

test.serial(`node only`, async () => {
  mockPrompt({ isBrowserSupported: false })

  await run()

  assert.jsonFileContent(`package.json`, {
    engines: {
      node: `>= 12.17`,
    },
  })
  assert.noJsonFileContent(`package.json`, {
    browserslist: true,
  })
})

test.serial(`browser only`, async () => {
  mockPrompt({ isNodeSupported: false })

  await run()

  assert.noJsonFileContent(`package.json`, {
    engines: true,
  })
  assert.jsonFileContent(`package.json`, {
    browserslist: [`defaults`, `not IE 11`, `not op_mini all`],
  })
})
