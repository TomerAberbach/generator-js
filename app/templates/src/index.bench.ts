import { bench } from 'vitest'
import <%= camelCasedModuleName %> from './index.<%= typeSupport %>'

bench(`<%= camelCasedModuleName %>`, () => {
  <%= camelCasedModuleName %>()
})
