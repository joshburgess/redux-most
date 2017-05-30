import { filter } from 'most'
import { curry2, findIndex } from '@most/prelude'

export const selectArray = curry2((actionTypes, stream) =>
  filter(({ type }) => type && findIndex(type, actionTypes) !== -1, stream))
