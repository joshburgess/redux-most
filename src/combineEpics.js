import { mergeArray } from 'most'
import { findIndex, map } from '@most/prelude'

export const combineEpics = epicsArray => (actions, store) => {
  if (!epicsArray || !Array.isArray(epicsArray)) {
    throw new TypeError('You must provide an array of Epics to combineEpics.')
  }

  if (epicsArray.length < 1) {
    throw new TypeError('The array passed to combineEpics must contain at least one Epic.')
  }

  const callEpic = epic => {
    if (typeof epic !== 'function') {
      throw new TypeError('The array passed to combineEpics must contain only Epics (functions).')
    }

    const out = epic(actions, store)

    if (!out || !out.source) {
      const epicIdentifier = epic.name
        ? `named ${epic.name}`
        : `at index ${findIndex(epic, epicsArray)} of the passed in array`

      throw new TypeError(`All Epics in the array provided to combineEpics must return a stream. Check the return value of the Epic ${epicIdentifier}.`)
    }

    return out
  }

  return mergeArray(map(callEpic, epicsArray))
}
