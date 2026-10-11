import { build } from 'tsdown'
import type { TestProject } from 'vitest/node'

// The tests scaffold from the build output, so rebuild before every run
export const setup = async (project: TestProject): Promise<void> => {
  await build()
  project.onTestsRerun(async () => {
    await build()
  })
}
