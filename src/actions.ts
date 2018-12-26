import { EPIC_END } from './constants'

type EpicEndAction = { type: EPIC_END }

export const epicEnd = (): EpicEndAction => ({ type: EPIC_END })
