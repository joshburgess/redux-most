import { just, merge } from 'most'
import { push } from 'react-router-redux'
import * as ActionTypes from '../ActionTypes'
import { accessDenied } from '../actions'
import { select } from 'redux-most'

const adminAccess = action$ =>
  // action$.thru(select(ActionTypes.CHECKED_ADMIN_ACCESS))
  select(ActionTypes.CHECKED_ADMIN_ACCESS, action$)
    // If you wanted to do an actual access check you
    // could do so here and then filter by failed checks.
    .delay(800)
    .chain(_ =>
      merge(
        just(accessDenied()),
        just().delay(800).map(_ => push('/'))
      )
    )

export default adminAccess
