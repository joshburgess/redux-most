import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import App from './App'
import UserSearch from './UserSearch'
import ReposByUser from './ReposByUser'
import Admin from './Admin'

const Root = ({ store }) =>
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route path='/' component={App}>
        <IndexRoute component={UserSearch} />
        <Route path='repos/:user' component={ReposByUser} />
        <Route path='admin' component={Admin} />
      </Route>
    </Router>
  </Provider>

export default Root
