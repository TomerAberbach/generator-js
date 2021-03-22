import { expectType } from 'tsd'
import <%= camelCasedModuleName %> from '../src'

expectType<string>(<%= camelCasedModuleName %>())
