import test from 'ava'
import sinon from 'sinon'
import { fromPromise, map, observe, reduce } from 'most'
import { subject } from 'most-subject'
import { combineEpics, select } from './'

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
  const actions$ = subject()
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

test('combineEpics should pass along every argument arbitrarily', t => {
  const epic1 = sinon.stub().returns(['first'])
  const epic2 = sinon.stub().returns(['second'])
  const rootEpic = combineEpics(
    epic1,
    epic2
  )
  const accumulateArray = (acc, curr) => {
    acc.push(curr)
    return acc
  }
  const toArray$ = stream => fromPromise(reduce(accumulateArray, [], stream))
  const array$ = toArray$(rootEpic(1, 2, 3, 4))

  observe(values => {
    t.plan(5)
    t.deepEqual(['first', 'second'], values)
    t.equal(1, epic1.callCount)
    t.equal(1, epic2.callCount)
    t.deepEqual([1, 2, 3, 4], epic1.firstCall.args)
    t.deepEqual([1, 2, 3, 4], epic2.firstCall.args)
  }, array$)
})
