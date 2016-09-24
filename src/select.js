import { filter } from 'most'
import { curry2 } from './utils'

export const select = curry2((actionType, stream) =>
  filter(({ type }) => type === actionType, stream))
