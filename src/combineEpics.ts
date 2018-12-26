import { mergeArray } from '@most/core'
import { findIndex, map } from '@most/prelude'
import {
  Action,
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  StoreEnhancer,
} from 'redux'
import { Stream } from '@most/types'

type OriginalApi<S, A extends Action> = (
  actionStream: Stream<A>,
  middlewareApi: MiddlewareAPI<Dispatch<Action>, S>,
) => Stream<A>

type StateStreamApi<S, A extends Action> = (
  actionStream: Stream<A>,
  stateStream: Stream<S>,
) => Stream<A>

type Epic<S, A extends Action> = OriginalApi<S, A> | StateStreamApi<S, A>

export declare function combineEpics_<S, A extends Action>(
  epicsArray: Epic<S, A>[],
): Epic<S, A>

export const combineEpics = <S, A extends Action>(
  epicsArray: Epic<S, A>[],
): Epic<S, A> => (actions, store) => {
  if (!epicsArray || !Array.isArray(epicsArray)) {
    throw new TypeError('You must provide an array of Epics to combineEpics.')
  }

  if (epicsArray.length < 1) {
    throw new TypeError(
      'The array passed to combineEpics must contain at least one Epic.',
    )
  }

  const callEpic = (epic: Epic<S, A>) => {
    if (typeof epic !== 'function') {
      throw new TypeError(
        'The array passed to combineEpics must contain only Epics (functions).',
      )
    }

    const out = epic(actions, store)

    if (!out || !out.source) {
      const epicIdentifier = epic.name
        ? `named ${epic.name}`
        : `at index ${findIndex(epic, epicsArray)} of the passed in array`

      throw new TypeError(
        `All Epics in the array provided to combineEpics must return a stream. Check the return value of the Epic ${epicIdentifier}.`,
      )
    }

    return out
  }

  return mergeArray(map(callEpic, epicsArray))
}
