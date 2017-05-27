import * as ActionTypes from '../ActionTypes'
import { receiveUserRepos } from '../actions'
// import { fromPromise } from 'most'
import { select } from 'redux-most'
// import { select } from '../../../src/index'
import {
  curriedMap as map,
  curriedSwitchMap as switchMap,
  fetchJsonStream,
} from '../utils'
import { compose } from 'ramda'

const toUser = ({ payload: { user } }) => user

const getGithubUserRepoUrl = user =>
  `https://api.github.com/users/${user}/repos`

// Fluent style
// const fetchReposByUser = action$ =>
//   action$.thru(select(ActionTypes.REQUESTED_USER_REPOS))
//     .map(toUser)
//     .map(user =>
//       fromPromise(
//         fetch(getGithubUserRepoUrl(user))
//         .then(response => response.json())
//       ).map(receiveUserRepos(user))
//     ).switch()

// NOTE: The below functional implementations use a convenience
// utility called fetchJsonStream. This function is just a
// shortcut for calling fetch, then calling response.json(), &
// then wrapping that resulting promise with Most's fromPromise()
// See utils/index.js for details

// Functional style
// const fetchAndReceiveUserRepos = user => {
//   const repos$ = fetchJsonStream(getGithubUserRepoUrl(user))
//   return map(receiveUserRepos(user), repos$)
// }

// const fetchReposByUser = action$ => {
//   const reqUserRepos$ = select(ActionTypes.REQUESTED_USER_REPOS, action$)
//   const user$ = map(toUser, reqUserRepos$)
//   return switchMap(fetchAndReceiveUserRepos, user$)
// }

// Functional & an almost Pointfree style using functional composition
const fetchAndReceiveUserRepos = user => compose(
  map(receiveUserRepos(user)),
  fetchJsonStream,
  getGithubUserRepoUrl
)(user)

const fetchReposByUser = compose(
  switchMap(fetchAndReceiveUserRepos),
  map(toUser),
  select(ActionTypes.REQUESTED_USER_REPOS)
)

export default fetchReposByUser
