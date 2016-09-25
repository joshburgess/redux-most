import { combineEpics } from 'redux-most'
import searchUsersDebounced from './searchUsersDebounced'
import searchUsers from './searchUsers'
import clearSearchResults from './clearSearchResults'
import fetchReposByUser from './fetchReposByUser'
import adminAccess from './adminAccess'

const rootEpic = combineEpics(
  searchUsersDebounced,
  searchUsers,
  clearSearchResults,
  fetchReposByUser,
  adminAccess
)

export default rootEpic
