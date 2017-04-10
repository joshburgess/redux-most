import test from 'ava'
import { map, observe } from 'most'
import { sync } from 'most-subject'
import { combineEpics, select } from '../src/'

test('combineEpics should combine epics', t => {
  const epic1 = (actions$, store) =>
    map(
      action => ({ type: 'DELEGATED1', action, store }),
      select('ACTION1', actions$)
    )
  const epic2 = (actions$, store) =>
    map(
      action => ({ type: 'DELEGATED2', action, store }),
      select('ACTION2', actions$)
    )
  const epic = combineEpics(
    epic1,
    epic2
  )
  const store = { I: 'am', a: 'store' }
  const actions$ = sync()
  const result$ = epic(actions$, store)
  const emittedActions = []
  observe(emittedAction => emittedActions.push(emittedAction), result$)
  actions$.next({ type: 'ACTION1' })
  actions$.next({ type: 'ACTION2' })

  t.deepEqual(
    [
      { type: 'DELEGATED1', action: { type: 'ACTION1' }, store },
      { type: 'DELEGATED2', action: { type: 'ACTION2' }, store },
    ],
    emittedActions
  )
})
