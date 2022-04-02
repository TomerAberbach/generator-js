import { expectTypeOf } from 'tomer'
import <%= camelCasedModuleName %> from '../src/index.js'

test(`<%= camelCasedModuleName %> works`, () => {
  expectTypeOf(<%= camelCasedModuleName %>).toEqualTypeOf<() => string>()
  expect(<%= camelCasedModuleName %>()).toBe(`Hello World!`)
})
