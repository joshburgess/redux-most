import { Stream } from 'most'
import { subject } from 'most-subject'
import { EPIC_END } from './EPIC_END'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide a root Epic to createEpicMiddleware')
  }

  const input$ = subject()
  const action$ = new Stream(input$.source)
  const epic$ = subject()

  let store

  const epicMiddleware = _store => {
    store = _store

    return next => {
      epic$.map(epic => epic(action$, store)).switch().observe(store.dispatch)

      // Setup initial root epic
      epic$.next(epic)

      return action => {
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
