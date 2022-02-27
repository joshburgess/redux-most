import { map, runEffects } from '@most/core'
import { event, create } from 'most-subject'
import { currentTime, newDefaultScheduler } from '@most/scheduler'
import { epicEnd } from './actions'
import { STATE_STREAM_SYMBOL } from './constants'

const scheduler = newDefaultScheduler()

export const createEpicMiddleware = epic => {
  if (typeof epic !== 'function') {
    throw new TypeError(
      'You must provide an Epic (a function) to createEpicMiddleware.'
    )
  }

  // it is important that this stream is created here and passed in to each
  // epic so that all epics act on the same action$, because this is what
  // allows debouncing, throttling, etc. to work correctly on subsequent
  // dispatched actions of the same type
  const [actionsInSink, actionsInStream] = create()

  // epic$ must be a Subject, because replaceEpic cannot be written without it
  const [epicSink, epicStream] = create()

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
          ? // new style API (declarative only, no dispatch/getState)
            event(
              currentTime(scheduler),
              nextEpic(actionsInStream, state$),
              epicSink
            )
          : // redux-observable style Epic API
            event(
              currentTime(scheduler),
              nextEpic(actionsInStream, middlewareApi),
              epicSink
            )
      }

      const actionsOut$ = map(callNextEpic, epicStream)
      runEffects(map(middlewareApi.dispatch, actionsOut$), scheduler)

      // Emit combined epics
      event(currentTime(scheduler), epic, epicSink)

      return action => {
        // Allow reducers to receive actions before epics
        const result = next(action)
        event(currentTime(scheduler), action, actionsInSink)
        return result
      }
    }
  }

  // can be used for hot reloading, code splitting, etc.
  epicMiddleware.replaceEpic = nextEpic => {
    middlewareApi.dispatch(epicEnd())
    event(currentTime(scheduler), nextEpic, epicSink)
  }

  return epicMiddleware
}
