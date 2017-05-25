import { filter } from 'most'
import { curry2 } from '@most/prelude'

export const select = curry2((actionType, stream) =>
  filter(action => action.type && action.type === actionType, stream))
