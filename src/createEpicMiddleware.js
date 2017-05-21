import { observe, Stream } from 'most'
import { async } from 'most-subject'
import { EPIC_END } from './EPIC_END'
import { switchMap } from './utils'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware')
  }

  const input$ = async()
  const actionsIn$ = new Stream(input$.source)

  // epic$ is a Subject, because it facilitates defining replaceEpic
  const epic$ = async()
  // store is mutable in order to capture a reference to the store for replaceEpic
  let store // eslint-disable-line fp/no-let

  const epicMiddleware = storeToCapture => {
    store = storeToCapture

    return next => {
      const actionsOut$ = switchMap(epic => epic(actionsIn$, store), epic$)
      observe(store.dispatch, actionsOut$)

      // Emit combined epics
      epic$.next(epic)

      return action => {
        // Allow reducers to receive actions before epics
        const result = next(action)
        input$.next(action)
        return result
      }
    }
  }

  // can be used for hot reloading, code splitting, etc.
  epicMiddleware.replaceEpic = epic => {
    store.dispatch({ type: EPIC_END })
    epic$.next(epic)
  }

  return epicMiddleware
}

// const createEpicMiddleware = epic => store => next => action => {
//     just(action)
//       .map(ac => epic(just(ac), store))
//       .switchLatest()
//       .observe(store.dispatch)
//     return next(action)
