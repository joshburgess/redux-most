import { map, observe, switchLatest } from 'most'
import { async } from 'most-subject'
import { epicBegin, epicEnd } from './actions'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.')
  }

  // it is important that this stream is created here and passed in to each
  // epic so that all epics act on the same action$, because this is what
  // allows debouncing, throttling, etc. to work correctly on subsequent
  // dispatched actions of the same type
  const actionsIn$ = async()

  // epic$ must be a Subject, because replaceEpic cannot be written without it
  const epic$ = async()

  // middlewareApi is mutable and defined here in order to capture a reference to the
  // _middlewareApi argument so that dispatch can be called from within replaceEpic
  let middlewareApi // eslint-disable-line fp/no-let

  const epicMiddleware = _middlewareApi => {
    middlewareApi = _middlewareApi

    return next => {
      const callNextEpic = nextEpic => {
        middlewareApi.dispatch(epicBegin())
        return nextEpic(actionsIn$, middlewareApi)
      }

      const actionsOut$ = switchLatest(map(callNextEpic, epic$))
      observe(middlewareApi.dispatch, actionsOut$)

      // Emit combined epics
      epic$.next(epic)

      return action => {
        // Allow reducers to receive actions before epics
        const result = next(action)
        actionsIn$.next(action)
        return result
      }
    }
  }

  // can be used for hot reloading, code splitting, etc.
  epicMiddleware.replaceEpic = nextEpic => {
    middlewareApi.dispatch(epicEnd())
    epic$.next(nextEpic)
  }

  return epicMiddleware
}
