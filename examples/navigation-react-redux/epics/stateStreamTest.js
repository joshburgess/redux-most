import { select } from 'redux-most'
import {
  // select,
  withState,
} from '../../../src'
import {
  curriedMap as map,
} from '../utils'
import compose from 'ramda/src/compose'

const accessStateFromArray = ([state, action]) => ({
  type: 'ACCESS_STATE',
  payload: {
    latestState: state,
    accessedByAction: action,
  },
})

// dispatch { type: 'STATE_STREAM_TEST' } in Redux DevTools to test
const stateStreamTest = (action$, state$) => compose(
 map(accessStateFromArray),
 withState(state$),
 select('STATE_STREAM_TEST')
)(action$)

export default stateStreamTest
