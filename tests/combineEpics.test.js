import { runEffects, map, tap } from '@most/core'
import { currentTime, newDefaultScheduler } from '@most/scheduler'
import test from 'ava'
import { create, event } from 'most-subject'
import { combineEpics, select } from '../src/'

const scheduler = newDefaultScheduler()

test('combineEpics should combine an array of epics', t => {
  const ACTION_1 = 'ACTION_1'
  const ACTION_2 = 'ACTION_2'
  const DELEGATED_1 = 'DELEGATED_1'
  const DELEGATED_2 = 'DELEGATED_2'
  const MOCKED_STORE = { I: 'am', a: 'store' }

  const epic1 = (actions$, store) =>
    map(
      action => ({ type: DELEGATED_1, action, store }),
      select(ACTION_1, actions$)
    )

  const epic2 = (actions$, store) =>
    map(
      action => ({ type: DELEGATED_2, action, store }),
      select(ACTION_2, actions$)
    )

  const epic = combineEpics([epic1, epic2])

  const store = MOCKED_STORE
  const [actionsSink, actionsStream] = create()
  const result$ = epic(actionsStream, store)
  const emittedActions = []

  runEffects(
    tap(emittedAction => emittedActions.push(emittedAction), result$),
    scheduler
  )

  const nextAction = payload =>
    event(currentTime(scheduler), payload, actionsSink)

  nextAction({ type: ACTION_1 })
  nextAction({ type: ACTION_2 })

  const MOCKED_EMITTED_ACTIONS = [
    { type: DELEGATED_1, action: { type: ACTION_1 }, store },
    { type: DELEGATED_2, action: { type: ACTION_2 }, store },
  ]

  t.deepEqual(MOCKED_EMITTED_ACTIONS, emittedActions)
})
