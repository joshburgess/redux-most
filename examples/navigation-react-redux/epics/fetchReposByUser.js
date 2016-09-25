import * as ActionTypes from '../ActionTypes'
import { receiveUserRepos } from '../actions'
import { fromPromise } from 'most'
import { select } from 'redux-most'
import curry from 'lodash/fp/curry'

const receiveReposForUser = curry(receiveUserRepos)

const fetchReposByUser = action$ =>
  // action$.thru(select(ActionTypes.REQUESTED_USER_REPOS))
  select(ActionTypes.REQUESTED_USER_REPOS, action$)
    .map(({ payload }) => payload.user)
    .map(user =>
      fromPromise(
        fetch(`https://api.github.com/users/${user}/repos`)
        .then(response => response.json())
      ).map(receiveReposForUser(user))
    ).switch()

export default fetchReposByUser
