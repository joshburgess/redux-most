import test from 'ava'
import { tap, MulticastSource, runEffects, never, merge } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { selectArray } from '../src/'

test('selectArray should filter by multiple action types', t => {
  const actions$ = new MulticastSource(never())
  const scheduler = newDefaultScheduler()
  const lulz = []
  const haha = []

  runEffects(
    merge(
      tap(x => lulz.push(x), selectArray(['LULZ', 'LMFAO'], actions$)),
      tap(x => haha.push(x), selectArray(['HAHA'], actions$))
    ),
    scheduler
  )

  actions$.event(scheduler.currentTime(), { type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  actions$.event(scheduler.currentTime(), { type: 'LMFAO', i: 1 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LMFAO', i: 1 }], lulz)
  t.deepEqual([], haha)

  actions$.event(scheduler.currentTime(), { type: 'HAHA', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LMFAO', i: 1 }], lulz)
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
