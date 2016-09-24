import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from './reducers'
import rootEpic from './epics'

const epicMiddleware = createEpicMiddleware(rootEpic)

const configureStore = _ =>
  createStore(
    rootReducer,
    compose(
      applyMiddleware(
        epicMiddleware,
        routerMiddleware(browserHistory)
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )

export default configureStore
