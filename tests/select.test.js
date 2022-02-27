import test from 'ava'
import { runEffects, tap } from '@most/core'
import { create, event } from 'most-subject'
import { select } from '../src/'
import { currentTime, newDefaultScheduler } from '@most/scheduler'

const scheduler = newDefaultScheduler()

test('select should filter by action type', t => {
  const [actionsSink, actionStream] = create()
  const lulz = []
  const haha = []

  runEffects(
    tap(x => lulz.push(x), select('LULZ', actionStream)),
    scheduler
  )
  runEffects(
    tap(x => haha.push(x), select('HAHA', actionStream)),
    scheduler
  )
  const next = payload => event(currentTime(scheduler), payload, actionsSink)

  next({ type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  next({ type: 'LULZ', i: 1 })

  t.deepEqual(
    [
      { type: 'LULZ', i: 0 },
      { type: 'LULZ', i: 1 },
    ],
    lulz
  )
  t.deepEqual([], haha)

  next({ type: 'HAHA', i: 0 })

  t.deepEqual(
    [
      { type: 'LULZ', i: 0 },
      { type: 'LULZ', i: 1 },
    ],
    lulz
  )
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
