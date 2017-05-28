import {
  CLEARED_SEARCH_RESULTS,
  RECEIVED_USERS,
  SEARCHED_USERS_DEBOUNCED,
} from '../constants/ActionTypes'

const searchInFlight = (state = false, action) => {
  switch (action.type) {
    case SEARCHED_USERS_DEBOUNCED:
      return true
    case RECEIVED_USERS:
    case CLEARED_SEARCH_RESULTS:
      return false
    default:
      return state
  }
}

export default searchInFlight
