import { createStore, applyMiddleware } from 'redux'
// Use Ramda's compose instead of Redux's compose,
// because we're already using it elsewhere.
import compose from 'ramda/src/compose'
// import {
//   createEpicMiddleware,
//   createStateStreamEnhancer,
// } from 'redux-most'
import {
  createEpicMiddleware,
  createStateStreamEnhancer,
} from '../../../src/index'
import { createLogger } from 'redux-logger'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import rootEpic from '../epics'

const epicMiddleware = createEpicMiddleware(rootEpic)

const logger = createLogger({
  collapsed: true,
  diff: false,
  logErrors: true,
})

const middleware = [
  logger,
  // epicMiddleware,
  routerMiddleware(browserHistory),
]

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // options here
    })
    : compose

const storeEnhancers = composeEnhancers(
  createStateStreamEnhancer(epicMiddleware),
  applyMiddleware(...middleware)
)

const store = createStore(rootReducer, storeEnhancers)

/******************************************************************************
  Start development only
*******************************************************************************/

// hot reload epics
const replaceRootEpic = () => {
  // import('../epics').then(
  //   ({ default: nextRootEpic }) => { epicMiddleware.replaceEpic(nextRootEpic) }
  // )

  const nextRootEpic = require('../epics').default
  epicMiddleware.replaceEpic(nextRootEpic)
}

if (module.hot) {
  module.hot.accept('../epics', replaceRootEpic)
}

// hot reload reducers
const replaceRootReducer = () => {
  // import('../reducers').then(
  //   ({ default: nextRootReducer }) => {
  //     store.replaceReducer(nextRootReducer)
  //   }
  // )

  const nextRootReducer = require('../reducers').default
  store.replaceReducer(nextRootReducer)
}

if (module.hot) {
  module.hot.accept('../reducers', replaceRootReducer)
}

/******************************************************************************
  End development only
*******************************************************************************/

export default store
