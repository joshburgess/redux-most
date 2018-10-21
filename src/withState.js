import { snapshot } from '@most/core'

const toArray = (state, action) => [state, action]

export const withState = snapshot(toArray)
