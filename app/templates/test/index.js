import { expect, test } from 'vitest'
import <%= camelCasedModuleName %> from '../src/index.js'

test(`<%= camelCasedModuleName %> works`, () => {
  expect(<%= camelCasedModuleName %>()).toBe(`Hello World!`)
})
