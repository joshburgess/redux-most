import { snapshot } from '@most/core'
import { Stream } from '@most/types'
import { Action } from 'redux'

export const withState = <S, A extends Action>(stateStream: Stream<S>) => (
  actionStream: Stream<A>,
): Stream<[S, A]> =>
  snapshot(
    (state: S, action: A): [S, A] => [state, action],
    stateStream,
    actionStream,
  )
