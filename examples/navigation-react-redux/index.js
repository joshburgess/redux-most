import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './configureStore'
import App from './containers/App'
import UserSearch from './containers/UserSearch'
import ReposByUser from './containers/ReposByUser'
import Admin from './containers/Admin'
// Supply polyfills for new built-ins like Promise, WeakMap, Object.assign, etc.
import 'babel-polyfill'
// Overwrite Promise implementation with Creed for best performance
import { shim } from 'creed'
shim() // eslint-disable-line fp/no-unused-expression
// Supply polyfill for fetch
import 'isomorphic-fetch'

const store = configureStore()
const history = syncHistoryWithStore(
  browserHistory,
  store
)

/* eslint-disable fp/no-unused-expression */
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={UserSearch} />
        <Route path='repos/:user' component={ReposByUser} />
        <Route path='admin' component={Admin} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
)
/* eslint-enable fp/no-unused-expression */
