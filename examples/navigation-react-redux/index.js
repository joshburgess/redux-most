import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import store from './store'

// Supply polyfills for new built-ins like Promise, WeakMap, Object.assign, etc.
import 'babel-polyfill'
// Overwrite Promise implementation with Creed for best performance
import { shim } from 'creed'
shim() // eslint-disable-line fp/no-unused-expression
// Supply polyfill for fetch
import 'isomorphic-fetch'

const rootEl = document.getElementById('app')

/* eslint-disable fp/no-unused-expression */

render(<Root store={store} />, rootEl)

/******************************************************************************
  Start development only
*******************************************************************************/

const replaceRootComponent = () => {
  // import('./containers/root')
  //   .then(
  //     ({ default: NextRoot }) => {
  //       render(<NextRoot store={store} />, rootEl)
  //     }
  //   )

  const NextRoot = require('./containers/Root').default
  render(<NextRoot store={store} />, rootEl)
}

if (module.hot) {
  module.hot.accept('./containers/Root', replaceRootComponent)
}

/******************************************************************************
  End development only
*******************************************************************************/

/* eslint-enable fp/no-unused-expression */
