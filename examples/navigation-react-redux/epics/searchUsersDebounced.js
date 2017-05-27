import * as ActionTypes from '../ActionTypes'
import { searchedUsers } from '../actions'
import { select } from 'redux-most'
// import { select } from '../../../src/index'
// import { map, debounce } from 'most'
import {
  curriedDebounce as debounce,
  curriedMap as map,
} from '../utils'
import { compose } from 'ramda'

const toSearchedUsers = ({ payload: { query } }) =>
  searchedUsers(query)

// Fluent style
// const searchUsersDebounced = action$ =>
//    action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
//     .debounce(800)
//     .map(toSearchedUsers)

// Functional style
// const searchUsersDebounced = action$ => {
//   const search$ = select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
//   const debouncedSearch$ = debounce(800, search$)
//   return map(toSearchedUsers, debouncedSearch$)
// }

// Functional & Pointfree style using functional composition
const searchUsersDebounced = compose(
  map(toSearchedUsers),
  debounce(800),
  select(ActionTypes.SEARCHED_USERS_DEBOUNCED)
)

export default searchUsersDebounced
