import { Middleware, MiddlewareAPI } from 'redux';
import { Stream } from 'most';

export declare interface Epic<T> {
  (action$: Stream<T>, store: MiddlewareAPI<any>): Stream<T>;
}

export interface EpicMiddleware<T> extends Middleware {
  replaceEpic (nextEpic: Epic<T>): void;
}

export declare function createEpicMiddleware<T> (rootEpic: Epic<T>): EpicMiddleware<T>;

export declare function combineEpics<T> (epicsArray: Epic<T>[]): Epic<T>;

export declare function select<T> (actionType: string, stream: Stream<T>): Stream<T>;
export declare function select<T> (actionType: string): (stream: Stream<T>) => Stream<T>;

export declare function selectArray<T> (actionTypes: string[], stream: Stream<T>): Stream<T>;
export declare function selectArray<T> (actionTypes: string[]): (stream: Stream<T>) => Stream<T>;
