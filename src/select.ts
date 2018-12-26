import { filter } from '@most/core'
// import { curry2, findIndex } from '@most/prelude'
import { Action } from 'redux'
import { Stream } from '@most/types'

// export const select = curry2((actionType, stream) =>
//   filter(({ type }) => type && type === actionType, stream),
// )

export const select = (actionType: Action) => (stream: Stream<Action>) =>
  filter(({ type }: Action): boolean => type && type === actionType, stream)
