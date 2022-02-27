import test from 'ava'
import { runEffects, tap } from '@most/core'
import { create, event } from 'most-subject'
import { selectArray } from '../src/'
import { newDefaultScheduler, currentTime } from '@most/scheduler'

const scheduler = newDefaultScheduler()

test('selectArray should filter by multiple action types', t => {
  const [sink, stream] = create()
  const lulz = []
  const haha = []

  runEffects(
    tap(x => {
      // console.log('lulz', x, lulz)
      return lulz.push(x)
    }, selectArray(['LULZ', 'LMFAO'], stream)),
    scheduler
  )
  runEffects(
    tap(x => {
      // console.log('haha', x, haha)
      return haha.push(x)
    }, selectArray(['HAHA'], stream)),
    scheduler
  )

  const next = payload => event(currentTime(scheduler), payload, sink)

  next({ type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  next({ type: 'LMFAO', i: 1 })
  t.deepEqual(
    [
      { type: 'LULZ', i: 0 },
      { type: 'LMFAO', i: 1 },
    ],
    lulz
  )
  t.deepEqual([], haha)

  next({ type: 'HAHA', i: 0 })

  t.deepEqual(
    [
      { type: 'LULZ', i: 0 },
      { type: 'LMFAO', i: 1 },
    ],
    lulz
  )
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
