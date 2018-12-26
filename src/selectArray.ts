import { filter } from '@most/core'
import { curry2, findIndex } from '@most/prelude'
import { AnyAction } from 'redux'
import { Stream } from '@most/types'

// export const selectArray = curry2((actionTypes, stream) =>
//   filter(({ type }) => type && findIndex(type, actionTypes) !== -1, stream))

export const selectArray = (actionTypes: AnyAction[]) => (
  stream: Stream<AnyAction>,
) =>
  filter(
    ({ type }: AnyAction): boolean =>
      type && findIndex(type, actionTypes) !== -1,
    stream,
  )
