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
  T = ActionType (a string or symbol)
  S = State
  D = Dependency
*****************************************/

// for the original, redux-observable style API
export declare interface Epic<A extends Action, S, D> {
  (
    actionStream: Stream<A>,
    middlewareApi: MiddlewareAPI<S>,
    dependencies: D
  ): Stream<A>;
}

// for the newer, declarative only API, which takes in a state stream
// to sample via the withState utility instead of exposing dispatch/getState
export declare interface Epic<A extends Action, S, D> {
  (
    actionStream: Stream<A>,
    stateStream: Stream<S>,
    dependencies: D
  ): Stream<A>;
}

export interface EpicMiddleware<A extends Action, S, D> extends Middleware {
  replaceEpic (
    nextEpic: Epic<A, S, D>
  ): void;
}

export declare function createEpicMiddleware<A extends Action, S, D> (
  rootEpic: Epic<A, S, D>,
  dependencies: D
): EpicMiddleware<A, S, D>;


export declare function createStateStreamEnhancer<A extends Action, S, D> (
  epicMiddleware: EpicMiddleware<A, S, D>
): StoreEnhancer<S>;

export declare function combineEpics<A extends Action, S, D> (
  epicsArray: Epic<A, S, D>[],
): Epic<A, S, D>;

export declare type ActionType = string | symbol

// overloads exist due to select being a curried function
export declare function select<A extends Action, T = ActionType> (
  actionType: T,
  stream: Stream<A>
): Stream<A>;

export declare function select<A extends Action, T = ActionType> (
  actionType: T
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to selectArray being a curried function
export declare function selectArray<A extends Action, T = ActionType> (
  actionTypes: T[],
  stream: Stream<A>
): Stream<A>;

export declare function selectArray<A extends Action, T = ActionType> (
  actionTypes: T[]
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to withState being a curried function
export declare function withState<A extends Action, S> (
  stateStream: Stream<S>,
  actionStream: Stream<A>
): Stream<[S, A]>;

export declare function withState<A extends Action, S> (
  stateStream: Stream<S>
): (actionStream: Stream<A>) => Stream<[S, A]>;

export const EPIC_END = '@@redux-most/EPIC_END';