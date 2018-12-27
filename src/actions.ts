import { EPIC_END, EpicEndAction } from './constants'

export const epicEnd = (): EpicEndAction => ({ type: EPIC_END })
