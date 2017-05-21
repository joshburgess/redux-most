import { curry2 } from '@most/prelude'
import { map, switchLatest } from 'most'

export const switchMap = curry2((f, stream) => switchLatest(map(f, stream)))
