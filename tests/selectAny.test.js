import test from 'ava'
import { observe } from 'most'
import { sync } from 'most-subject'
import { selectAny } from '../src/'

test('select should filter by action type', t => {
  const actions$ = sync()
  const lulz = []
  const haha = []

  observe(x => lulz.push(x), selectAny(['LULZ', 'LMFAO'], actions$))
  observe(x => haha.push(x), selectAny(['HAHA'], actions$))

  actions$.next({ type: 'LULZ', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }], lulz)
  t.deepEqual([], haha)

  actions$.next({ type: 'LMFAO', i: 1 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LMFAO', i: 1 }], lulz)
  t.deepEqual([], haha)

  actions$.next({ type: 'HAHA', i: 0 })

  t.deepEqual([{ type: 'LULZ', i: 0 }, { type: 'LMFAO', i: 1 }], lulz)
  t.deepEqual([{ type: 'HAHA', i: 0 }], haha)
})
