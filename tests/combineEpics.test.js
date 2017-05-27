import test from 'ava'
import { map, observe } from 'most'
import { sync } from 'most-subject'
import { combineEpics, select } from '../src/'

test('combineEpics should combine an array of epics', t => {
  const ACTION_1 = 'ACTION_1'
  const ACTION_2 = 'ACTION_2'
  const DELEGATED_1 = 'DELEGATED_1'
  const DELEGATED_2 = 'DELEGATED_2'
  const MOCKED_STORE = { I: 'am', a: 'store' }


  const epic1 = (actions$, store) => map(
    action => ({ type: DELEGATED_1, action, store }),
    select(ACTION_1, actions$)
  )

  const epic2 = (actions$, store) => map(
    action => ({ type: DELEGATED_2, action, store }),
    select(ACTION_2, actions$)
  )

  const epic = combineEpics([
    epic1,
    epic2,
  ])

  const store = MOCKED_STORE
  const actions$ = sync()
  const result$ = epic(actions$, store)
  const emittedActions = []

  observe(emittedAction => emittedActions.push(emittedAction), result$)

  actions$.next({ type: ACTION_1 })
  actions$.next({ type: ACTION_2 })

  const mockedEmittedActions = [
    { type: DELEGATED_1, action: { type: ACTION_1 }, store },
    { type: DELEGATED_2, action: { type: ACTION_2 }, store },
  ]

  t.deepEqual(mockedEmittedActions, emittedActions)
})
