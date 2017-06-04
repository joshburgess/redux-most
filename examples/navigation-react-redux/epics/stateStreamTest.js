import { select } from 'redux-most'
import {
  curriedMap as map,
  curriedFlippedSample1 as sample,
} from '../utils'
import compose from 'ramda/src/compose'

const accessState = ({ state, action }) => ({
  type: 'ACCESS_STATE',
  payload: {
    latestState: state,
    accessedByAction: action,
  },
})

const zipObj = (state, action) => ({ state, action })
const sampleToZippedObj = sample(zipObj)

// dispatch { type: 'STATE_STREAM_TEST' } in Redux DevTools to test
const stateStreamTest = (action$, state$) => compose(
 map(accessState),
 sampleToZippedObj(state$),
 select('STATE_STREAM_TEST')
)(action$)

export default stateStreamTest
