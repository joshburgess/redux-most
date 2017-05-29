import { filter } from 'most'
import { curry2 } from '@most/prelude'

export const select = curry2((actionType, stream) =>
  filter(({ type }) => type && type === actionType, stream))
