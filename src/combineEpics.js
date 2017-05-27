import { mergeArray } from 'most'
import { isArrayLike, map } from '@most/prelude'

export const combineEpics = epicsArray => (actions, store) => {
  if (epicsArray && !isArrayLike(epicsArray)) {
    throw new TypeError('You must provide an array of Epics to combineEpics')
  }

  const callEpic = epic => epic(actions, store)

  return mergeArray(map(callEpic, epicsArray))
}
