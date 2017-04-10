import test from 'ava'
import { observe } from 'most'
import { sync } from 'most-subject'
import { select } from '../src/'

test('select should filter by action type', t => {
  const actions$ = sync()
  const lulz = []
  const haha = []

  observe(x => lulz.push(x), select('LULZ', actions$))
  observe(x => haha.push(x), select('HAHA', actions$))

  actions$.next({ type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  actions$.next({ type: 'LULZ', i: 1 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }], lulz)
  t.deepEqual([], haha)

  actions$.next({ type: 'HAHA', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LULZ', i: 1 }], lulz)
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
