import { EPIC_BEGIN, EPIC_END } from './constants'

export const epicBegin = () => ({ type: EPIC_BEGIN })

export const epicEnd = () => ({ type: EPIC_END })
