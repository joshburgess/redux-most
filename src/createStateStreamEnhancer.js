import {
  skipRepeats,
  MulticastSource,
  never,
  runEffects,
} from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { STATE_STREAM_SYMBOL } from './constants'

const getState$ = store => {
  const scheduler = newDefaultScheduler()
  const state$ = new MulticastSource(never())
  runEffects(state$, scheduler)
  store.subscribe(() =>
    state$.event(scheduler.currentTime(), store.getState())
  )
  return state$
}

export const createStateStreamEnhancer = epicMiddleware => createStore => (
  reducer,
  preloadedState,
  enhancer
) => {
  const store = createStore(reducer, preloadedState, enhancer)
  let dispatch = store.dispatch // eslint-disable-line fp/no-let

  const middlewareApi = {
    getState: store.getState,
    dispatch: action => dispatch(action),
    [STATE_STREAM_SYMBOL]: skipRepeats(getState$(store)),
  }

  dispatch = epicMiddleware(middlewareApi)(store.dispatch)

  return {
    ...store,
    dispatch,
  }
}
