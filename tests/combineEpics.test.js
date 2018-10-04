import test from 'ava'
import { map, tap, runEffects, never, MulticastSource } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { combineEpics, select, withState } from '../src/'

test('combineEpics should combine an array of epics', t => {
  const ACTION_1 = 'ACTION_1'
  const ACTION_2 = 'ACTION_2'
  const DELEGATED_1 = 'DELEGATED_1'
  const DELEGATED_2 = 'DELEGATED_2'
  const MOCKED_STORE = { I: 'am', a: 'store' }

  const epic1 = withState(
    (store, actions$) => map(
      action => ({ type: DELEGATED_1, action, store }),
      select(ACTION_1, actions$)
    )
  )

  const epic2 = withState(
    (store, actions$) => map(
      action => ({ type: DELEGATED_2, action, store }),
      select(ACTION_2, actions$)
    )
  )

  const epic = combineEpics([
    epic1,
    epic2,
  ])

  const store = MOCKED_STORE
  const actions$ = new MulticastSource(never())
  const result$ = epic(actions$, store)
  const scheduler = newDefaultScheduler()
  const emittedActions = []

  runEffects(tap(emittedAction => emittedActions.push(emittedAction), result$), scheduler)

  actions$.event(scheduler.currentTime(), { type: ACTION_1 })
  actions$.event(scheduler.currentTime(), { type: ACTION_2 })

  const MOCKED_EMITTED_ACTIONS = [
    { type: DELEGATED_1, action: { type: ACTION_1 }, store },
    { type: DELEGATED_2, action: { type: ACTION_2 }, store },
  ]

  t.deepEqual(MOCKED_EMITTED_ACTIONS, emittedActions)
})
