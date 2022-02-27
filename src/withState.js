import { sample, map } from '@most/core'
import { curry3 } from '@most/prelude'

const flippedSampleState = curry3((f, stateStream, samplerStream) =>
  map(f, sample(samplerStream, stateStream))
)

const toArray = (state, samplerStreamEvent) => [state, samplerStreamEvent]

export const withState = flippedSampleState(toArray)
