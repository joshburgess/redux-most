import { from, skipRepeats } from 'most'
import { STATE_STREAM_SYMBOL } from './constants'

export const createStateStreamEnhancer = epicMiddleware => createStore =>
  (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch // eslint-disable-line fp/no-let

    const middlewareApi = {
      getState: store.getState,
      dispatch: action => dispatch(action),
      [STATE_STREAM_SYMBOL]: skipRepeats(from(store)),
    }

    dispatch = epicMiddleware(middlewareApi)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
