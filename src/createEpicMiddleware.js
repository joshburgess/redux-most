import { observe } from 'most'
import { async } from 'most-subject'
import { epicBegin, epicEnd } from './actions'
import { switchMap } from './utils'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware')
  }

  // it is important that this stream is created here and passed in to each
  // epic so that all epics act on the same action$, because this is what
  // allows debouncing, throttling, etc. to work correctly on subsequent
  // dispatched actions of the same type
  const actionsIn$ = async()

  // epic$ must be a Subject, because replaceEpic cannot be written without it
  const epic$ = async()

  // storeRef is mutable and defined here in order to capture a reference to the
  // passed in store argument so that dispatch can be called from within replaceEpic
  let storeRef // eslint-disable-line fp/no-let

  const epicMiddleware = store => {
    storeRef = store

    return next => {
      const callNextEpic = nextEpic => {
        storeRef.dispatch(epicBegin())
        return nextEpic(actionsIn$, storeRef)
      }

      const actionsOut$ = switchMap(callNextEpic, epic$)
      observe(storeRef.dispatch, actionsOut$)

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
    storeRef.dispatch(epicEnd())
    epic$.next(nextEpic)
  }

  return epicMiddleware
}
