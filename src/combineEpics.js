import map from 'ramda/src/map'
import { mergeArray } from 'most'

export const combineEpics = (...epics) => (actions, store) =>
  mergeArray(map(epic => epic(actions, store), epics))
