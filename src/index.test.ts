import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from 'vitest'

// Each template condition depends on at most two answers, so these cover every
// pair of answers instead of every combination
const configs = [
  { packageType: `lib`, supportsBrowser: true, typeSupport: `ts` },
  { packageType: `lib`, supportsBrowser: false, typeSupport: `js` },
  { packageType: `both`, supportsBrowser: false, typeSupport: `ts` },
  { packageType: `both`, supportsBrowser: true, typeSupport: `js` },
  { packageType: `cli`, supportsBrowser: false, typeSupport: `ts` },
  { packageType: `cli`, supportsBrowser: false, typeSupport: `js` },
]

test.concurrent.for(configs)(
  `scaffolds a module that passes its own checks: $packageType, $typeSupport, browser: $supportsBrowser`,
  async (config, { signal }) => {
    const destination = await mkdtemp(join(tmpdir(), `generator-js-`))
    const answers = {
      moduleName: `scaffolded-module`,
      moduleDescription: `A scaffolded module.`,
      name: `Tomer Aberbach`,
      email: `tomer@aberba.ch`,
      website: `https://tomeraberba.ch`,
      githubUsername: `TomerAberbach`,
      ...config,
    }

    // The generator ends by running the scaffolded module's `pnpm check`
    await expect(
      scaffold(destination, answers, signal),
    ).resolves.toBeUndefined()

    await rm(destination, { recursive: true, force: true })
  },
)

const scaffold = (
  destination: string,
  answers: Record<string, unknown>,
  signal: AbortSignal,
) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        fileURLToPath(import.meta.resolve(`./testing/scaffold.ts`)),
        destination,
        JSON.stringify(answers),
      ],
      // A process group, so aborting kills the generator's `pnpm` processes too
      { detached: true, stdio: [`ignore`, `pipe`, `pipe`] },
    )
    signal.addEventListener(`abort`, () => process.kill(-child.pid!, `SIGKILL`))
    let output = ``
    for (const stream of [child.stdout, child.stderr]) {
      stream.setEncoding(`utf8`).on(`data`, (data: string) => (output += data))
    }
    child.on(`error`, reject)
    child.on(`close`, code =>
      code === 0
        ? resolve()
        : reject(
            new Error(
              `Scaffolding in ${destination} exited with ${code}:\n${output}`,
            ),
          ),
    )
  })
