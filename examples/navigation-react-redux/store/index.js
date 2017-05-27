import { createStore, applyMiddleware, compose } from 'redux'
// import { createEpicMiddleware } from 'redux-most'
import { createEpicMiddleware } from '../../../src'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import rootEpic from '../epics'

const epicMiddleware = createEpicMiddleware(rootEpic)

const middleware = [
  epicMiddleware,
  routerMiddleware(browserHistory),
]

const storeEnhancers = compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
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
