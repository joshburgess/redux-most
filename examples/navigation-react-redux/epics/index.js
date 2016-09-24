import { combineEpics } from 'redux-most'
import searchUsers from './searchUsers'
import clearSearchResults from './clearSearchResults'
import fetchReposByUser from './fetchReposByUser'
import adminAccess from './adminAccess'

const rootEpic = combineEpics(
  searchUsers,
  clearSearchResults,
  fetchReposByUser,
  adminAccess
)

export default rootEpic
