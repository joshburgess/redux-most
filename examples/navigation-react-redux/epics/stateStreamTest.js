// import { select } from 'redux-most'
import {
  select,
  withLatestStateArray,
  // withLatestStateObject,
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

// const accessStateFromObject = ({ state, action }) => ({
//   type: 'ACCESS_STATE',
//   payload: {
//     latestState: state,
//     accessedByAction: action,
//   },
// })

// dispatch { type: 'STATE_STREAM_TEST' } in Redux DevTools to test
const stateStreamTest = (action$, state$) => compose(
 // map(accessStateFromObject),
 // withLatestStateObject(state$),
 map(accessStateFromArray),
 withLatestStateArray(state$),
 select('STATE_STREAM_TEST')
)(action$)

export default stateStreamTest
