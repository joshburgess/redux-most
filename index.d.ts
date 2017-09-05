import {
  Action,
  Middleware,
  MiddlewareAPI,
  StoreEnhancer,
} from 'redux';
import { Stream } from 'most';

/*****************************************
  Type abbreviations:
  A = Action
  M = Middleware API (AKA the "Store")
  T = Action Type
  S = App State
*****************************************/

// for the original, redux-observable style API
export declare interface Epic<A extends Action, M> {
  (
    actionStream: Stream<A>,
    middlewareApi: MiddlewareAPI<M>
  ): Stream<A>;
}

// for the newer, declarative only API, which takes in a state stream
// to sample via the withState utility instead of exposing dispatch/getState
export declare interface Epic<A extends Action, S> {
  (
    actionStream: Stream<A>,
    stateStream: Stream<S>
  ): Stream<A>;
}

export interface EpicMiddleware<A extends Action, M, S> extends Middleware {
  replaceEpic (
    nextEpic: Epic<A, M, S>
  ): void;
}

export declare function createEpicMiddleware<A extends Action, M, S> (
  rootEpic: Epic<A, M, S>
): EpicMiddleware<A, M, S>;


export declare function createStateStreamEnhancer<A, M, S> (
  epicMiddleware: EpicMiddleware<A, M, S>
): StoreEnhancer<S>;

export declare function combineEpics<A extends Action, M, S> (
  epicsArray: Epic<A, M, S>[]
): Epic<A, M, S>;

// overloads exist due to select being a curried function
export declare function select<A extends Action, T = string> (
  actionType: T,
  stream: Stream<A>
): Stream<A>;

export declare function select<A extends Action, T = string> (
  actionType: T
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to selectArray being a curried function
export declare function selectArray<A extends Action, T = string> (
  actionTypes: T[],
  stream: Stream<A>
): Stream<A>;

export declare function selectArray<A extends Action, T = string> (
  actionTypes: T[]
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to withState being a curried function
export declare function withState<A extends Action, S> (
  stateStream: Stream<S>,
  samplerStream: Stream<A>
): Stream<[S, A]>;

export declare function withState<A extends Action, S> (
  stateStream: Stream<S>
): (actionStream: Stream<A>) => Stream<[S, A]>;

export const EPIC_END = '@@redux-most/EPIC_END'