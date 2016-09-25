import * as ActionTypes from '../ActionTypes'
import { searchedUsers } from '../actions'
import { select } from 'redux-most'

const searchUsersDebounced = action$ =>
  // action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
  select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
    .debounce(800)
    .map(({ payload }) => searchedUsers(payload.query))

export default searchUsersDebounced
