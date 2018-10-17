import { compose, curry } from 'ramda'
import { fromPromise } from '@most/core'

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

export const then = curry((f, thenable) => thenable.then(f))
export const toJson = response => response.json()
export const fetchJson = compose(then(toJson), fetch)
export const fetchJsonStream = compose(fromPromise, fetchJson)

/******************************************************************************
  Stream utilities
*******************************************************************************/

// export const mapTo = (x, stream) => map(_ => x, stream)
// export const switchMap = compose(switchLatest, map)

// prefix with "curried" so things are more obvious in other files
// export const curriedChain = curry(chain)
// export const curriedDebounce = curry(debounce)
// export const curriedDelay = curry(delay)
// export const curriedFilter = curry(filter)
// export const curriedMap = curry(map)
// export const curriedMapTo = curry(mapTo)
// export const curriedMerge = curry(merge)
// export const curriedSwitchMap = curry(switchMap)
// export const curriedTap = curry(tap)
// export const curriedThrottle = curry(throttle)
// export const curriedUntil = curry(until)
