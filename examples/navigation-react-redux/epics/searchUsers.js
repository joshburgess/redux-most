import { replace } from 'react-router-redux'
import {
  CLEARED_SEARCH_RESULTS,
  SEARCHED_USERS,
} from '../constants/ActionTypes'
import { receiveUsers } from '../actions'
import {
  chain,
  filter,
  map,
  merge,
  until,
  switchLatest,
  now,
} from '@most/core'
import { fetchJsonStream } from '../utils'
// import { select } from 'redux-most'
import { select } from '../../../src/index'
import { compose } from 'ramda'

const toQuery = ({ payload }) => payload.query

const whereNotEmpty = query => !!query

const toItems = ({ items }) => items

const getUsersQueryUrl = query =>
  `https://api.github.com/search/users?q=${query}`

const replaceQuery = query => replace(`?q=${query}`)

// Fluent style
// const searchUsers = action$ =>
//   action$.thru(select(SEARCHED_USERS))
//     .map(toQuery)
//     .filter(whereNotEmpty)
//     .map(query =>
//       just()
//       .until(action$.thru(select(CLEARED_SEARCH_RESULTS)))
//       .chain(_ =>
//         merge(
//           just(replaceQuery(query)),
//           fromPromise(
//             fetch(getUsersQueryUrl(query))
//             .then(response => response.json())
//           )
//           .map(toItems)
//           .map(receiveUsers)
//         )
//       )
//     ).switch()

// Functional style
// const searchUsers = action$ => {
//   const searchedUsers$ = select(SEARCHED_USERS, action$)
//   const maybeEmptyQuery$ = map(toQuery, searchedUsers$)
//   const query$ = filter(whereNotEmpty, maybeEmptyQuery$)

//   const untilCleared$ = until(
//     select(CLEARED_SEARCH_RESULTS, action$),
//     just()
//   )

//   const parseJsonForUsers = query =>
//     map(toItems, fetchJsonStream(getUsersQueryUrl(query)))

//   const fetchReplaceReceive = query => merge(
//     just(replaceQuery(query)),
//     map(receiveUsers, parseJsonForUsers(query))
//   )

//   const fetchReplaceReceiveUntilCleared = query =>
//     chain(_ => fetchReplaceReceive(query), untilCleared$)

//   return switchMap(fetchReplaceReceiveUntilCleared, query$)
// }

// Using functional composition & simplifying where possible
const searchUsers = action$ => {
  const justUntilClearedSearchResults = compose(
    until(select(CLEARED_SEARCH_RESULTS, action$)),
    now
  )

  const getMergeForQuery = query =>
    _ => merge(
      now(replaceQuery(query)),
      compose(
        map(compose(receiveUsers, toItems)),
        fetchJsonStream,
        getUsersQueryUrl
      )(query)
    )

  const toFlattenedOutput = query => chain(
    getMergeForQuery(query),
    justUntilClearedSearchResults()
  )

  return compose(
    switchLatest,
    map(toFlattenedOutput),
    filter(whereNotEmpty),
    map(toQuery),
    select(SEARCHED_USERS)
  )(action$)
}

export default searchUsers
