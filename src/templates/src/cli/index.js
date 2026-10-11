import { object } from '@optique/core/constructs'
import { message, text } from '@optique/core/message'
import { optional } from '@optique/core/modifiers'
import { argument } from '@optique/core/primitives'
import { defineProgram } from '@optique/core/program'
import { string } from '@optique/core/valueparser'
import { run } from '@optique/run'
import packageJson from '../../package.json' with { type: 'json' }
import <%= camelCasedModuleName %> from '../index.js'

const program = defineProgram({
  parser: object({
    name: optional(
      argument(string({ metavar: `NAME` }), {
        description: message`Who to greet (default: World)`,
      }),
    ),
  }),
  metadata: {
    name: `<%= unscopedModuleName %>`,
    version: packageJson.version,
    brief: message`${text(packageJson.description)}`,
  },
})

const { name } = run(program, {
  help: `option`,
  version: packageJson.version,
  completion: `option`,
})
console.log(<%= camelCasedModuleName %>(name))
