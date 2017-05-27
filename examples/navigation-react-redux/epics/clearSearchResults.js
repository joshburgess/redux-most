import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'
// import { select } from '../../../src/index'
import {
  curriedFilter as filter,
  curriedMap as map,
} from '../utils'
import { compose } from 'ramda'

const emptySearch = ({ payload: { query } }) => !query

// Fluent style
// const clear = action$ =>
//    action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
//     .filter(emptySearch)
//     .map(clearSearchResults)

// Functional style
// const clear = action$ => {
//   const search$ = select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
//   const emptySearch$ = filter(emptySearch, search$)
//   return map(clearSearchResults, emptySearch$)
// }

// Functional & Pointfree style using functional composition
const clear = compose(
  map(clearSearchResults),
  filter(emptySearch),
  select(ActionTypes.SEARCHED_USERS_DEBOUNCED)
)

export default clear
