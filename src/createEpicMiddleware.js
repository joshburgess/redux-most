import { map, observe, Stream, switchLatest } from 'most'
import { async } from 'most-subject'
import { EPIC_END } from './EPIC_END'
import compose from 'ramda/src/compose'
const switchMap = compose(switchLatest, map)

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware')
  }

  const input$ = async()
  const action$ = new Stream(input$.source)
  const epic$ = async()

  let store // eslint-disable-line fp/no-let

  const epicMiddleware = storeToCapture => {
    store = storeToCapture

    return next => {
      const dispatch$ = switchMap(epic => epic(action$, store), epic$)
      observe(store.dispatch, dispatch$)

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

  epicMiddleware.replaceEpic = epic => {
    store.dispatch({ type: EPIC_END })
    epic$.next(epic)
  }

  return epicMiddleware
}
