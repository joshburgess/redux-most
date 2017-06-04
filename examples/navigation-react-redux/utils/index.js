import { compose, curry } from 'ramda'
import {
  chain,
  combineArray,
  debounce,
  delay,
  filter,
  fromPromise,
  map,
  merge,
  sample,
  switchLatest,
  tap,
  throttle,
  until,
} from 'most'

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

const mapTo = (x, stream) => map(_ => x, stream)
const switchMap = compose(switchLatest, map)

// use combineArray to define a curryable combine function, because Most 1.0's
// combine is variadic, and we want to be able to delay passing it stream2
const combine2 = (f, stream1, stream2) => combineArray(f, [stream1, stream2])

// define a curryable sample that only takes in one stream, because Most 1.0's
// sample combinator is variadic
const sample1 = (f, sampler, stream) => sample(f, sampler, sampler, stream)
const flippedSample1 = (f, stream, sampler) => sample(f, sampler, stream, sampler)

// prefix with "curried" so things are more obvious in other files
export const curriedChain = curry(chain)
export const curriedCombine2 = curry(combine2)
export const curriedDebounce = curry(debounce)
export const curriedDelay = curry(delay)
export const curriedFilter = curry(filter)
export const curriedFlippedSample1 = curry(flippedSample1)
export const curriedMap = curry(map)
export const curriedMapTo = curry(mapTo)
export const curriedMerge = curry(merge)
export const curriedSample1 = curry(sample1)
export const curriedSwitchMap = curry(switchMap)
export const curriedTap = curry(tap)
export const curriedThrottle = curry(throttle)
export const curriedUntil = curry(until)
