import { from, skipRepeats } from 'most'
import { compose } from 'redux'
import { STATE_STREAM_SYMBOL } from './constants'

export const createStateStreamEnhancer = epicMiddleware => createStore =>
  (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    let dispatch = store.dispatch // eslint-disable-line fp/no-let
    let chain = [] // eslint-disable-line fp/no-let

    const middlewareApi = {
      getState: store.getState,
      dispatch: action => dispatch(action),
      [STATE_STREAM_SYMBOL]: skipRepeats(from(store)),
    }
    console.log('store', store)
    console.log('middlewareApi', middlewareApi)
    chain = [epicMiddleware].map(middleware => middleware(middlewareApi))
    dispatch = compose(...chain)(store.dispatch)

    // example not currently setup to use Object Spread
    // return {
    //   ...store,
    //   dispatch,
    // }

    return Object.assign({}, store, { dispatch })
  }
