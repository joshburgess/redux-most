import { sampleArray } from 'most'
import { curry3 } from '@most/prelude'

const flippedSample = curry3((f, stateStream, actionStreamSampler) =>
  sampleArray(f, actionStreamSampler, [stateStream, actionStreamSampler]))

const asArray = (state, action) => [state, action]
const asObject = (state, action) => ({ state, action })

export const withLatestStateArray = flippedSample(asArray)
export const withLatestStateObject = flippedSample(asObject)
