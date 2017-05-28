import {
  ACCESS_DENIED,
  CHECKED_ADMIN_ACCESS,
  CLEARED_SEARCH_RESULTS,
  RECEIVED_USER_REPOS,
  RECEIVED_USERS,
  REQUESTED_USER_REPOS,
  SEARCHED_USERS,
  SEARCHED_USERS_DEBOUNCED,
} from '../constants/ActionTypes'
import { curry } from 'ramda'


export const searchedUsersDebounced = query => ({
  type: SEARCHED_USERS_DEBOUNCED,
  payload: {
    query,
  },
})

export const searchedUsers = query => ({
  type: SEARCHED_USERS,
  payload: {
    query,
  },
})

export const receiveUsers = users => ({
  type: RECEIVED_USERS,
  payload: {
    users,
  },
})

export const clearSearchResults = _ => ({
  type: CLEARED_SEARCH_RESULTS,
})

export const requestReposByUser = user => ({
  type: REQUESTED_USER_REPOS,
  payload: {
    user,
  },
})

export const receiveUserRepos = curry((user, repos) => ({
  type: RECEIVED_USER_REPOS,
  payload: {
    user,
    repos,
  },
}))

export const checkAdminAccess = _ => ({
  type: CHECKED_ADMIN_ACCESS,
})

export const accessDenied = _ => ({
  type: ACCESS_DENIED,
})
