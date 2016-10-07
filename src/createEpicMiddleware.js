import { map, observe, Stream, switchLatest } from 'most'
import { subject } from 'most-subject'
import { EPIC_END } from './EPIC_END'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware')
  }

  const input$ = subject()
  const action$ = new Stream(input$.source)
  const epic$ = subject()

  let store // eslint-disable-line fp/no-let

  const epicMiddleware = storeToCapture => {
    store = storeToCapture

    return next => {
      const dispatch$ = switchLatest(map(epic => epic(action$, store), epic$))
      observe(store.dispatch, dispatch$)

      // Emit combined epics
      epic$.next(epic)

      return action => {
        // IMPORTANT: Allow reducers to receive actions before epics
        const result = next(action)
        input$.next(action)
        return result
      }
    }
  }

  epicMiddleware.replaceEpic = epic => {
    store.dispatch({ type: EPIC_END })
    epic$.next(epic)
  }

  return epicMiddleware
}
