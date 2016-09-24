import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const clear = action$ =>
  // action$.thru(select(ActionTypes.SEARCHED_USERS))
  select(ActionTypes.SEARCHED_USERS, action$)
    .filter(action => !action.payload.query)
    .map(clearSearchResults)

export default clear
