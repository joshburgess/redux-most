import { mergeArray } from 'most'
import { map } from '@most/prelude'

export const combineEpics = epicsArray => (actions, store) => {
  if (!epicsArray || !Array.isArray(epicsArray)) {
    throw new TypeError('You must provide an array of Epics to combineEpics')
  }

  if (epicsArray.length < 1) {
    throw new TypeError('The array passed to combineEpics must contain at least one Epic')
  }

  const callEpic = epic => {
    if (typeof epic !== 'function') {
      throw new TypeError('The array passed to combineEpics must contain only Epics (functions)')
    }

    return epic(actions, store)
  }

  return mergeArray(map(callEpic, epicsArray))
}
