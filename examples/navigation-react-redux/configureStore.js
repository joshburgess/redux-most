import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
// import { createEpicMiddleware } from '../../src'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from './reducers'
import rootEpic from './epics'

const epicMiddleware = createEpicMiddleware(rootEpic)

const middleware = [
  epicMiddleware,
  routerMiddleware(browserHistory),
]

const storeEnhancers = compose(
  applyMiddleware(...middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)

const configureStore = _ => createStore(rootReducer, storeEnhancers)

export default configureStore
