import { fc, testProp } from 'ava-fast-check'
import test from 'ava'
import <%= camelCasedModuleName %> from '../src/index.js'

test(`<%= camelCasedModuleName %> works`, t => {
  t.is(<%= camelCasedModuleName %>(), `Hello World!`)
})

testProp(
  `<%= camelCasedModuleName %> really works`,
  [fc.anything()],
  (t, value) => {
    t.is(<%= camelCasedModuleName %>(value), `Hello World!`)
  }
)
