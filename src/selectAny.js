import { filter } from 'most'
import { curry2, findIndex } from '@most/prelude'

export const selectAny = curry2((actionTypes, stream) =>
  filter(({ type }) => findIndex(type, actionTypes) !== -1, stream))
