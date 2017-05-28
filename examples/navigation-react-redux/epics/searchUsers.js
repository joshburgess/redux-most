import { replace } from 'react-router-redux'
import * as ActionTypes from '../constants/ActionTypes'
import { receiveUsers } from '../actions'
import { fromPromise, just, switchLatest } from 'most'
import {
  curriedChain as chain,
  curriedFilter as filter,
  curriedMap as map,
  curriedMerge as merge,
  // curriedSwitchMap as switchMap,
  curriedUntil as until,
} from '../utils'
import { select } from 'redux-most'
// import { select } from '../../../src/index'

// Fluent style
// const searchUsers = action$ =>
//   action$.thru(select(ActionTypes.SEARCHED_USERS))
//     .map(({ payload }) => payload.query)
//     .filter(q => !!q)
//     .map(q =>
//       just()
//       .until(action$.thru(select(ActionTypes.CLEARED_SEARCH_RESULTS)))
//       .chain(_ =>
//         merge(
//           just(replace(`?q=${q}`)),
//           fromPromise(
//             fetch(`https://api.github.com/search/users?q=${q}`)
//             .then(response => response.json())
//           )
//           .map(({ items }) => items)
//           .map(receiveUsers)
//         )
//       )
//     ).switch()

// Functional style
const searchUsers = action$ => {
  const searchedUsers$ = select(ActionTypes.SEARCHED_USERS, action$)
  const maybeEmptyQuery$ = map(({ payload }) => payload.query, searchedUsers$)
  const query$ = filter(q => !!q, maybeEmptyQuery$)
  const untilCleared$ = until(
    select(ActionTypes.CLEARED_SEARCH_RESULTS, action$),
    just()
  )
  const fetchJson = q => fromPromise(
    fetch(`https://api.github.com/search/users?q=${q}`)
    .then(response => response.json())
  )
  const parseJsonForUsers = q => map(({ items }) => items, fetchJson(q))
  const fetchReplaceReceive = q => merge(
    just(replace(`?q=${q}`)),
    map(receiveUsers, parseJsonForUsers(q))
  )
  const fetchReplaceReceiveUntilCleared = q =>
    chain(_ => fetchReplaceReceive(q), untilCleared$)
  return switchLatest(map(fetchReplaceReceiveUntilCleared, query$))
}

export default searchUsers
