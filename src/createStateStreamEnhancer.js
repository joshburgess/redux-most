import { from, skipRepeats } from 'most'
import { STATE_STREAM_SYMBOL } from './constants'

const compose2 = (f, g) => (...args) => f(g(...args))
const composeAll = (...fs) => fs.reduce(compose2)

export const createStateStreamEnhancer = (...middlewares) => createStore =>
  (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)

    /* eslint-disable fp/no-let */
    let dispatch = store.dispatch
    // let dispatch = () => {
    //   throw new Error(
    //     `Dispatching while constructing your middleware is not allowed. ` +
    //       `Other middleware would not be applied to this dispatch.`
    //   )
    // }
    let chain = []
    /* eslint-enable fp/no-let */

    const middlewareApi = {
      getState: store.getState,
      dispatch: action => dispatch(action),
      [STATE_STREAM_SYMBOL]: skipRepeats(from(store)),
    }

    chain = middlewares.map(middleware => middleware(middlewareApi))
    dispatch = composeAll(...chain)(store.dispatch)
    // dispatch = epicMiddleware(middlewareApi)(store.dispatch)

    return {
      ...store,
      dispatch,
    }
  }
