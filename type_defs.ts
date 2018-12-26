import {
  Action,
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  StoreEnhancer,
} from 'redux'
import { Stream } from 'most'

/*****************************************
  Type abbreviations:
  A = Action
  T = ActionType (a string or symbol)
  S = State
*****************************************/

// for the original, redux-observable style API
export declare interface Epic<S, A extends Action> {
  (
    actionStream: Stream<A>,
    middlewareApi: MiddlewareAPI<Dispatch<Action>, S>,
  ): Stream<A>
}

// for the newer, declarative only API, which takes in a state stream
// to sample via the withState utility instead of exposing dispatch/getState
export declare interface Epic<S, A extends Action> {
  (actionStream: Stream<A>, stateStream: Stream<S>): Stream<A>
}

export interface EpicMiddleware<S, A extends Action> extends Middleware {
  replaceEpic(nextEpic: Epic<S, A>): void
}

export declare function createEpicMiddleware<S, A extends Action>(
  rootEpic: Epic<S, A>,
): EpicMiddleware<S, A>

export declare function createStateStreamEnhancer<S, A extends Action>(
  epicMiddleware: EpicMiddleware<S, A>,
): StoreEnhancer<S>

export declare function combineEpics<S, A extends Action>(
  epicsArray: Epic<S, A>[],
): Epic<S, A>

export declare type ActionType = string | symbol

// overloads exist due to select being a curried function
export declare function select<A extends Action, T = ActionType>(
  actionType: T,
  stream: Stream<A>,
): Stream<A>

export declare function select<A extends Action, T = ActionType>(
  actionType: T,
): (stream: Stream<A>) => Stream<A>

// overloads exist due to selectArray being a curried function
export declare function selectArray<A extends Action, T = ActionType>(
  actionTypes: T[],
  stream: Stream<A>,
): Stream<A>

export declare function selectArray<A extends Action, T = ActionType>(
  actionTypes: T[],
): (stream: Stream<A>) => Stream<A>

// overloads exist due to withState being a curried function
export declare function withState<S, A extends Action>(
  stateStream: Stream<S>,
  actionStream: Stream<A>,
): Stream<[S, A]>

export declare function withState<S, A extends Action>(
  stateStream: Stream<S>,
): (actionStream: Stream<A>) => Stream<[S, A]>

export const EPIC_END = '@@redux-most/EPIC_END'
