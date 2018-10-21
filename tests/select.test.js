import test from 'ava'
import { MulticastSource, runEffects, never, tap, merge } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { select } from '../src/'

test('select should filter by action type', t => {
  const actions$ = new MulticastSource(never())
  const scheduler = newDefaultScheduler()
  const lulz = []
  const haha = []

  runEffects(
    merge(
      tap(x => lulz.push(x), select('LULZ', actions$)),
      tap(x => haha.push(x), select('HAHA', actions$))
    ),
    scheduler
  )

  actions$.event(scheduler.currentTime(), { type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  actions$.event(scheduler.currentTime(), { type: 'LULZ', i: 1 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }], lulz)
  t.deepEqual([], haha)

  actions$.event(scheduler.currentTime(), { type: 'HAHA', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }], lulz)
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
