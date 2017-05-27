import compose from 'ramda/src/compose'
import curry from 'ramda/src/curry'
// import { curry2 as curry } from '@most/prelude'
import { debounce, delay, filter, map, throttle, switchLatest } from 'most'

/******************************************************************************
  General utilities
*******************************************************************************/

// used to persist native events instead of using React's synthetic events
export const nativeEventPersist = f => syntheticEvent =>
  syntheticEvent.persist() || f(syntheticEvent.nativeEvent)

export const isString = str => str &&
  (typeof str === 'string' || str instanceof String)

export const noOp = f => f
export const log = console.log
export const tapLog = x => log(x) || x
export const tapLogL = curry((label, x) => log(label, x) || x)


/******************************************************************************
  Stream utilities
*******************************************************************************/

// prefix with "curried" so things are more obvious in other files
export const curriedDebounce = curry(debounce)
export const curriedDelay = curry(delay)
export const curriedFilter = curry(filter)
export const curriedMap = curry(map)
export const curriedMapTo = curry((x, stream) => map(() => x, stream))
export const curriedThrottle = curry(throttle)
export const curriedSwitchMap = curry(compose(switchLatest, map))
