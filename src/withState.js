import { sampleArray } from 'most'
import { curry3 } from '@most/prelude'

const flippedSampleState = curry3((f, stateStream, samplerStream) =>
  sampleArray(f, samplerStream, [stateStream, samplerStream]))

const toArray = (state, samplerStreamEvent) => [state, samplerStreamEvent]

export const withState = flippedSampleState(toArray)
