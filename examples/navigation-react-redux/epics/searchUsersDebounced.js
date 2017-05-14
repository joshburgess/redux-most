import * as ActionTypes from '../ActionTypes'
import { searchedUsers } from '../actions'
// import { select } from 'redux-most'
import { select } from '../../../src/index'
import { map, debounce } from 'most'

// Fluent style
// const searchUsersDebounced = action$ =>
//    action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
//     .debounce(800)
//     .map(({ payload }) => searchedUsers(payload.query))

// Functional style
const searchUsersDebounced = action$ => {
  const search$ = select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
  const debouncedSearch$ = debounce(800, search$)
  return map(({ payload }) => searchedUsers(payload.query), debouncedSearch$)
}

export default searchUsersDebounced
