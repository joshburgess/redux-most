import { mergeArray } from 'most'

export const combineEpics = (...epicsArray) => (actions, store) =>
  mergeArray(epicsArray.map(epic => epic(actions, store)))
