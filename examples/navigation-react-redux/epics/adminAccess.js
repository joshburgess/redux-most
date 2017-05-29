import { just } from 'most'
import {
  curriedChain as chain,
  curriedDelay as delay,
  curriedMap as map,
  curriedMerge as merge,
} from '../utils'
import { push } from 'react-router-redux'
import { CHECKED_ADMIN_ACCESS } from '../constants/ActionTypes'
import { accessDenied } from '../actions'
import { select } from 'redux-most'
// import { select } from '../../../src/index'
import { compose } from 'ramda'

const toPushToRoot = _ => push('/')

// Fluent style
// const adminAccess = action$ =>
//   action$.thru(select(CHECKED_ADMIN_ACCESS))
//     // If you wanted to do an actual access check you
//     // could do so here and then filter by failed checks.
//     .delay(800)
//     .chain(_ =>
//       merge(
//         just(accessDenied()),
//         just().delay(800).map(toPushToRoot)
//       )
//     )

// Functional style
// const adminAccess = action$ => {
//   const checkedAdminAccess$ = select(CHECKED_ADMIN_ACCESS, action$)
//   // If you wanted to do an actual access check you
//   // could do so here and then filter by failed checks.
//   const delayedCheckedAdminAccess$ = delay(800, checkedAdminAccess$)
//   const redirectToRoot$ = map(toPushToRoot, delay(800, just()))
//   const denyAndRedirect = _ => merge(just(accessDenied()), redirectToRoot$)
//   return chain(denyAndRedirect, delayedCheckedAdminAccess$)
// }

// Functional & Pointfree style using functional composition
const delayedPushToRoot = compose(
  map(toPushToRoot),
  delay(800),
  just
)

const adminAccess = compose(
  chain(_ => merge(just(accessDenied()), delayedPushToRoot())),
  // If you wanted to do an actual access check you
  // could do so here and then filter by failed checks.
  delay(800),
  select(CHECKED_ADMIN_ACCESS)
)

export default adminAccess
