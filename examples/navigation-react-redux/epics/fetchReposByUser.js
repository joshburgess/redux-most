import * as ActionTypes from '../ActionTypes'
import { receiveUserRepos } from '../actions'
import { fromPromise, map, switchLatest } from 'most'
// import { select } from 'redux-most'
import { select } from '../../../src/index'
import curry from 'ramda/src/curry'

const receiveReposForUser = curry(receiveUserRepos)

// Fluent style
// const fetchReposByUser = action$ =>
//   action$.thru(select(ActionTypes.REQUESTED_USER_REPOS))
//     .map(({ payload }) => payload.user)
//     .map(user =>
//       fromPromise(
//         fetch(`https://api.github.com/users/${user}/repos`)
//         .then(response => response.json())
//       ).map(receiveReposForUser(user))
//     ).switch()

// Functional style
const fetchReposByUser = action$ => {
  const reqUserRepos$ = select(ActionTypes.REQUESTED_USER_REPOS, action$)
  const user$ = map(({ payload }) => payload.user, reqUserRepos$)
  const getUserReposStream = x => fromPromise(
    fetch(`https://api.github.com/users/${x}/repos`)
    .then(response => response.json()))
  const receiveUserRepos$ = x =>
    map(receiveReposForUser(x), getUserReposStream(x))
  return switchLatest(map(receiveUserRepos$, user$))
}

export default fetchReposByUser
