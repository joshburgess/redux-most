import * as ActionTypes from '../constants/ActionTypes'

const initialState = []

const userResults = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVED_USERS:
      return action.payload.users
    case ActionTypes.CLEARED_SEARCH_RESULTS:
      return initialState
    default:
      return state
  }
}

export default userResults
