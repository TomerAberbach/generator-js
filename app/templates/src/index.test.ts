import { fc, test } from '@fast-check/vitest'
import { expect, expectTypeOf } from 'vitest'
import <%= camelCasedModuleName %> from './index.<%= typeSupport %>'

test(`<%= camelCasedModuleName %> works`, () => {
  expectTypeOf(<%= camelCasedModuleName %>).toEqualTypeOf<(string?: string) => string>()
  expect(<%= camelCasedModuleName %>()).toBe(`Hello World!`)
})

test.prop([fc.string()])(`<%= camelCasedModuleName %> always works`, string => {
  expect(<%= camelCasedModuleName %>(string)).toInclude(string)
})
