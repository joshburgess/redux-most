import { SEARCHED_USERS_DEBOUNCED } from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
// import { select } from 'redux-most'
import { select } from '../../../src/index'
import {
  filter,
  map,
} from '@most/core'
import { compose } from 'ramda'

const whereEmpty = ({ payload: { query } }) => !query

// Fluent style
// const clear = action$ =>
//    action$.thru(select(SEARCHED_USERS_DEBOUNCED))
//     .filter(whereEmpty)
//     .map(clearSearchResults)

// Functional style
// const clear = action$ => {
//   const search$ = select(SEARCHED_USERS_DEBOUNCED, action$)
//   const whereEmpty$ = filter(whereEmpty, search$)
//   return map(clearSearchResults, whereEmpty$)
// }

// Functional & Pointfree style using functional composition
const clear = compose(
  map(clearSearchResults),
  filter(whereEmpty),
  select(SEARCHED_USERS_DEBOUNCED)
)

export default clear
