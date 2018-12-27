import {
  Action,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  StoreEnhancer,
} from 'redux'
import { Stream } from 'most'
import { EPIC_END } from './constants'

/*****************************************
  Type abbreviations:
  A = Action
  T = ActionType (a string or symbol)
  S = State
*****************************************/

// default to the most common use case, but allow overriding
export type ActionType = string

export interface DefaultAction extends Action<ActionType> {
  [key: string]: any
}

// for the original, redux-observable style API
export type OriginalApiEpic<S, A extends Action = DefaultAction> = (
  actionStream: Stream<A>,
  middlewareApi: MiddlewareAPI<Dispatch<A>, S>,
) => Stream<A>

// for the newer, declarative only API, which takes in a state stream
// to sample via the withState utility instead of exposing dispatch/getState
export type DeclarativeApiEpic<S, A extends Action = DefaultAction> = (
  actionStream: Stream<A>,
  stateStream: Stream<S>,
) => Stream<A>

export type Epic<S, A extends Action = DefaultAction> =
  | OriginalApiEpic<S, A>
  | DeclarativeApiEpic<S, A>

export interface EpicMiddleware<S, A extends Action = DefaultAction>
  extends Middleware {
  replaceEpic(nextEpic: Epic<S, A>): void
}

export declare function createEpicMiddleware<
  S,
  A extends Action = DefaultAction
>(rootEpic: Epic<S, A>): EpicMiddleware<S, A>

export declare function createStateStreamEnhancer<
  S,
  A extends Action = DefaultAction
>(epicMiddleware: EpicMiddleware<S, A>): StoreEnhancer<S>

export declare function combineEpics<S, A extends Action = DefaultAction>(
  epicsArray: Epic<S, A>[],
): Epic<S, A>

// overloads exist due to select being a curried function
export declare function select<
  A extends Action = DefaultAction,
  T = ActionType
>(actionType: T, stream: Stream<A>): Stream<A>

export declare function select<
  A extends Action = DefaultAction,
  T = ActionType
>(actionType: T): (stream: Stream<A>) => Stream<A>

// overloads exist due to selectArray being a curried function
export declare function selectArray<
  A extends Action = DefaultAction,
  T = ActionType
>(actionTypes: T[], stream: Stream<A>): Stream<A>

export declare function selectArray<
  A extends Action = DefaultAction,
  T = ActionType
>(actionTypes: T[]): (stream: Stream<A>) => Stream<A>

// overloads exist due to withState being a curried function
export declare function withState<S, A extends Action = DefaultAction>(
  stateStream: Stream<S>,
  actionStream: Stream<A>,
): Stream<[S, A]>

export declare function withState<S, A extends Action = DefaultAction>(
  stateStream: Stream<S>,
): (actionStream: Stream<A>) => Stream<[S, A]>

// export const EPIC_END = '@@redux-most/EPIC_END'
// export type EPIC_END = typeof EPIC_END

// export type EpicEndAction = { type: EPIC_END }
