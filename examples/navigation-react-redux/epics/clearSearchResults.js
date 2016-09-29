import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'
import { map, filter } from 'most'

// Fluent style
// const clear = action$ =>
//    action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
//     .filter(({ payload }) => !payload.query)
//     .map(clearSearchResults)

// Functional style
const clear = action$ => {
  const search$ = select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
  const emptySearch$ = filter(action => !action.payload.query, search$)
  return map(clearSearchResults, emptySearch$)
}

export default clear
