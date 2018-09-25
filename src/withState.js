import { sample, combineArray } from '@most/core'
import { curry3 } from '@most/prelude'

const flippedSampleState = curry3((f, stateStream, samplerStream) =>
  sample(f, samplerStream, combineArray([stateStream, samplerStream])))

const toArray = (state, samplerStreamEvent) => [state, samplerStreamEvent]

export const withState = flippedSampleState(toArray)
