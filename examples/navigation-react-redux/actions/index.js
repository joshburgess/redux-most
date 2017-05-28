import * as ActionTypes from '../constants/ActionTypes'
import curry from 'ramda/src/curry'


export const searchedUsersDebounced = query => ({
  type: ActionTypes.SEARCHED_USERS_DEBOUNCED,
  payload: {
    query,
  },
})

export const searchedUsers = query => ({
  type: ActionTypes.SEARCHED_USERS,
  payload: {
    query,
  },
})

export const receiveUsers = users => ({
  type: ActionTypes.RECEIVED_USERS,
  payload: {
    users,
  },
})

export const clearSearchResults = _ => ({
  type: ActionTypes.CLEARED_SEARCH_RESULTS,
})

export const requestReposByUser = user => ({
  type: ActionTypes.REQUESTED_USER_REPOS,
  payload: {
    user,
  },
})

export const receiveUserRepos = curry((user, repos) => ({
  type: ActionTypes.RECEIVED_USER_REPOS,
  payload: {
    user,
    repos,
  },
}))

export const checkAdminAccess = _ => ({
  type: ActionTypes.CHECKED_ADMIN_ACCESS,
})

export const accessDenied = _ => ({
  type: ActionTypes.ACCESS_DENIED,
})
