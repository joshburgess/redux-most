import { mergeArray } from 'most'
import { map } from '@most/prelude'

export const combineEpics = (...epics) => (actions, store) =>
  mergeArray(map(epic => epic(actions, store), epics))
