import { expect, expectTypeOf, test } from 'vitest'
import <%= camelCasedModuleName %> from '../src/index.ts'

test(`<%= camelCasedModuleName %> works`, () => {
  expectTypeOf(<%= camelCasedModuleName %>).toEqualTypeOf<() => string>()
  expect(<%= camelCasedModuleName %>()).toBe(`Hello World!`)
})
