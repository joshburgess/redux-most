import { map, observe, switchLatest, runEffects, MulticastSource, never, merge } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { epicEnd } from './actions'
import { STATE_STREAM_SYMBOL } from './constants'

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.')
  }

  const scheduler = newDefaultScheduler()

  // it is important that this stream is created here and passed in to each
  // epic so that all epics act on the same action$, because this is what
  // allows debouncing, throttling, etc. to work correctly on subsequent
  // dispatched actions of the same type
  const actionsIn$ = new MulticastSource(never())

  // epic$ must be a Subject, because replaceEpic cannot be written without it
  const epic$ = new MulticastSource(never())

  // middlewareApi is mutable and defined here in order to capture a reference to the
  // _middlewareApi argument so that dispatch can be called from within replaceEpic
  let middlewareApi // eslint-disable-line fp/no-let

  const epicMiddleware = _middlewareApi => {
    middlewareApi = _middlewareApi

    return next => {
      const callNextEpic = nextEpic => {
        const state$ = middlewareApi[STATE_STREAM_SYMBOL]
        const isUsingStateStreamEnhancer = !!state$

        return isUsingStateStreamEnhancer
          // new style API (declarative only, no dispatch/getState)
          ? nextEpic(actionsIn$, state$)
          // redux-observable style Epic API
          : nextEpic(actionsIn$, middlewareApi)
      }

      const actionsOut$ = switchLatest(map(callNextEpic, epic$))
      observe(middlewareApi.dispatch, actionsOut$)

      // Emit combined epics
      epic$.event(scheduler.currentTime(), epic)

      return action => {
        // Allow reducers to receive actions before epics
        const result = next(action)
        actionsIn$.event(scheduler.currentTime(), action)
        return result
      }
    }
  }

  // can be used for hot reloading, code splitting, etc.
  epicMiddleware.replaceEpic = nextEpic => {
    middlewareApi.dispatch(epicEnd())
    epic$.event(scheduler.currentTime(), nextEpic)
  }

  runEffects(scheduler, merge(actionsIn$, epic$))
  return epicMiddleware
}
