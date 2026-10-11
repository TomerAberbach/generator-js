import { fileURLToPath } from 'node:url'
import { TestAdapter } from '@yeoman/adapter/testing'
import { createEnv } from 'yeoman-environment'

const [destination, answers] = process.argv.slice(2)

const env = createEnv({
  adapter: new TestAdapter({
    mockedAnswers: JSON.parse(answers!) as Record<string, unknown>,
    throwOnMissingAnswer: true,
  }),
  cwd: destination,
})
env.register(fileURLToPath(import.meta.resolve(`../generators/app/index.js`)), {
  namespace: `js:app`,
})
// `localConfigOnly` stores answers in the destination, not `~/.yo-rc-global.json`
await env.run([`js:app`, `--no-git`], { localConfigOnly: true })
