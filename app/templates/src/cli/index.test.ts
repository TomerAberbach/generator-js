import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import packageJson from '../../package.json' with { type: 'json' }

const cliPath = join(import.meta.dirname, `index.<%= typeSupport %>`)

const runCli = (args: string[]) =>
  new Promise<{ status: number | null; stdout: string; stderr: string }>(
    (resolve, reject) => {
      const child = spawn(process.execPath, [cliPath, ...args])
      const stdout: Buffer[] = []
      const stderr: Buffer[] = []
      child.stdout.on(`data`, (chunk: Buffer) => stdout.push(chunk))
      child.stderr.on(`data`, (chunk: Buffer) => stderr.push(chunk))
      child.on(`error`, reject)
      child.on(`close`, status =>
        resolve({
          status,
          stdout: Buffer.concat(stdout).toString(`utf8`),
          stderr: Buffer.concat(stderr).toString(`utf8`),
        }),
      )
    },
  )

test(`greets the world by default`, async () => {
  const { status, stdout } = await runCli([])

  expect(status).toBe(0)
  expect(stdout).toBe(`Hello World!\n`)
})

test(`greets the given name`, async () => {
  const { status, stdout } = await runCli([`Tomer`])

  expect(status).toBe(0)
  expect(stdout).toBe(`Hello Tomer!\n`)
})

test(`--version prints the version`, async () => {
  const { status, stdout } = await runCli([`--version`])

  expect(status).toBe(0)
  expect(stdout).toBe(`${packageJson.version}\n`)
})

test(`--help prints the usage`, async () => {
  const { status, stdout } = await runCli([`--help`])

  expect(status).toBe(0)
  expect(stdout).toContain(`Usage: <%= unscopedModuleName %>`)
})

test(`rejects an unknown flag`, async () => {
  const { status, stderr } = await runCli([`--nope`])

  expect(status).not.toBe(0)
  expect(stderr).toContain(`--nope`)
})
