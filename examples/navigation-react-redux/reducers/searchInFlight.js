import * as ActionTypes from '../constants/ActionTypes'

const searchInFlight = (state = false, action) => {
  switch (action.type) {
    case ActionTypes.SEARCHED_USERS_DEBOUNCED:
      return true
    case ActionTypes.RECEIVED_USERS:
    case ActionTypes.CLEARED_SEARCH_RESULTS:
      return false
    default:
      return state
  }
}

export default searchInFlight
