import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import test from 'ava'
import pify from 'pify'
import helpers from 'yeoman-test'
import assert from 'yeoman-assert'

const tempDirname = join(dirname(fileURLToPath(import.meta.url)), `temp`)

let run
let mockPrompt

test.beforeEach(async () => {
  await pify(helpers.testDirectory)(tempDirname)

  const generator = helpers.createGenerator(`js:app`, [`../app`], null, {
    skipInstall: true
  })

  run = pify(generator.run.bind(generator))
  mockPrompt = () =>
    helpers.mockPrompt(generator, {
      moduleName: `the-best-module`,
      moduleDescription: `The best module.`,
      license: {
        identifier: `the-best-developer`,
        name: `The Best Developer License`,
        requestContent: name => Promise.resolve(`${name} did it all!`)
      },
      name: `The Best Developer`,
      email: `thebestdeveloper@thebestdeveloper.com`,
      website: `https://thebestdeveloper.com`,
      githubUsername: `TheBestDeveloper`
    })
})

test.serial(`generates expected files`, async () => {
  mockPrompt()

  await run()

  assert.file([
    `.git`,
    `.github`,
    `.gitignore`,
    `.npmrc`,
    `src/index.js`,
    `test/index.js`,
    `license`,
    `package.json`,
    `readme.md`
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
      url: `https://thebestdeveloper.com`
    },
    description: `The best module.`,
    homepage: `https://github.com/TheBestDeveloper/the-best-module`,
    repository: `TheBestDeveloper/the-best-module`,
    bugs: {
      url: `https://github.com/TheBestDeveloper/the-best-module/issues`
    },
    license: `the-best-developer`
  })
})
