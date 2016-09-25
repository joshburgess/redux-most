import { replace } from 'react-router-redux'
import * as ActionTypes from '../ActionTypes'
import { receiveUsers } from '../actions'
import { fromPromise, just, merge } from 'most'
import { select } from 'redux-most'

const searchUsers = action$ =>
  // action$.thru(select(ActionTypes.SEARCHED_USERS))
  select(ActionTypes.SEARCHED_USERS, action$)
    .map(({ payload }) => payload.query)
    .filter(q => !!q)
    .map(q =>
      just()
      // .until(action$.thru(select(ActionTypes.CLEARED_SEARCH_RESULTS)))
      .until(select(ActionTypes.CLEARED_SEARCH_RESULTS, action$))
      .chain(_ =>
        merge(
          just(replace(`?q=${q}`)),
          fromPromise(
            fetch(`https://api.github.com/search/users?q=${q}`)
            .then(response => response.json())
          )
          .map(({ items }) => items)
          .map(receiveUsers)
        )
      )
    ).switch()

export default searchUsers
