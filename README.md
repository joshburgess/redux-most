redux-most
==========

[Most.js](https://github.com/cujojs/most) based middleware for [Redux](http://redux.js.org/).

Handle async actions with monadic streams & reactive programming.

### [Jump to API Reference](https://github.com/joshburgess/redux-most#api-reference)

### Install
With yarn (recommended):
```bash
yarn add redux-most
```

or with npm:
```bash
npm install --save redux-most
```

Additionally, make sure the peer dependencies, `redux` and `most`, are also installed.


### Background

`redux-most` is based on [`redux-observable`](https://redux-observable.js.org/).
It uses the same pattern/concept of ["epics"](https://redux-observable.js.org/docs/basics/Epics.html)
without requiring [`RxJS 5`](http://reactivex.io/rxjs/) as a peer dependency.
Although `redux-observable` does provide capability for using other stream libraries via adapters,
`redux-most` allows you to bypass needing to install both `RxJS 5` and `Most`. I prefer `Most` for
working with observables and would rather have minimal dependencies. So, I wrote
this middleware primarily for my own use.

Please, see `redux-observable`'s [documentation](https://redux-observable.js.org/)
for details on usage.

### Why Most over RxJS?

`RxJS 5` is great. It's quite a bit faster than `RxJS 4`, and `Rx`, in general, is a
very useful tool which happens to exist across many different languages.
Learning it is definitely a good idea. However, `Most` is significantly smaller,
less complicated, and faster than `RxJS 5`. I prefer its more minimal set of 
operators and its focus on performance. Also, like [`Ramda`](http://ramdajs.com/)
or [`lodash/fp`](https://github.com/lodash/lodash/wiki/FP-Guide), `Most`
supports a functional API in which the data collection (a stream, rather than 
an array, in this case) gets passed in last. This is important, because it 
allows you to use functional programming techniques like currying & partial 
application, which you can't do with `RxJS` without writing your own wrapper 
functions, because it only offers an OOP/fluent/chaining style API.

### Why integrate `Most`/`RxJS` with `redux` instead of recreating it with streams?

It's true that it's quite easy to implement the core ideas of `Redux` with
observables using the `scan` operator. (See my [inferno-most-fp-demo](https://github.com/joshburgess/inferno-most-fp-demo)
for an example.) However, the [Redux DevTools](https://github.com/gaearon/redux-devtools)
provide what is arguably the nicest developer tooling experience currently available
in the JavaScript ecosystem. Therefore, it is huge to be able to maintain it as an asset
while still reaping the benefits of reactive programming with streams. Purists, those who 
are very experienced with working with observables, and those working on smaller apps
may not care as much about taking advantage of that tooling as using an elegant
streams-only based solution, and that's fine. The important thing is having a choice.

### Why `redux-most` or `redux-observable` over [`redux-saga`](https://redux-saga.js.org/)?

`redux-saga` is nice. It's a sophisticated approach to handling asynchronous
actions with `Redux` and can handle very complicated tasks with ease. However,
due to generators being pull-based, it is much more imperative in nature. I
simply prefer the more declarative style of push-based streams & reactive
programming.

### Differences between `redux-most` & `redux-observable`

__Summary__

- There are no adapters. `redux-most` is only intended to be used with `Most`.
- `redux-most` offers 2 separate APIs: a `redux-observable`-like API, where Epics
get passed an action stream & a store middleware object containing `dispatch` & `getState`
methods, and a stricter, more declarative API, where Epics get passed an action stream & a state stream.
- `combineEpics` takes in an array of epics instead of multiple arguments.
- Standard `Most` streams are used instead of a custom Observable extension.
- `select` and `selectArray` are available instead of the variadic `ofType`.


__Further Elaboration:__

As the name implies, `redux-most` does not offer adapters for use with other reactive
programming libraries that implement the Observable type. It's merely an implementation of
`redux-observable`'s "Epic" pattern exclusively intended for use with `Most`. `Most` is arguably
the fastest, simplest, most functional, & most elegant reactive programming library in the
JavaScript ecosystem right now, and `Most 2.0` will be even better, as it will feature an
auto-curried API like `lodash/fp` and `ramda`, but for working with streams instead of arrays.
For a preview of what's to come, check out what's going on [here](https://github.com/mostjs/core).

Initially, `redux-most` offered the same API as `redux-observable`, where Epics received an action
stream & a store middleware object containing `dispatch` & `getState` methods. However, it now offers
both that API and another stricter, more declarative API which eliminates the use of `dispatch` &
`getState`. The reason for this is that I rarely found myself using the imperative `dispatch`
method. It's not really needed, because you can use `switch`, `merge`, `mergeArray`, etc. to send
multiple actions through your outgoing stream. This is nice, because it allows you to stay locked into
the declarative programming style the entire time.

However, using `getState` was still required in epics that needed access to the current state. I
wanted a nice, convenient way to access the current state, just like I had for dispatching actions.
So, I created an alternate API where Epics receive a stream of state changes rather than the
`{ dispatch, getState }` object. This state stream, combined with the new `withState` utility function,
let's you use streams for both dispatching actions & accessing the current state, allowing you to stay 
focused & in the zone (the reactive programming mindset).

Moving on, whereas `comebineEpics` is variadic in `redux-observable`, it's unary in `redux-most`. It
takes in only one argument, an array of epics, instead of individual epics getting passed in as separate
arguments.

As for streams, I chose not to extend the `Observable` type with a custom `ActionsObservable`
type. So, when working with `redux-most`, you will be working with normal `most`
streams without any special extension methods. However, I have offered something
similar to `redux-observable`'s `ofType` operator in `redux-most` with the
`select` and `selectArray` helper functions.
 

Like `ofType`, `select` and `selectArray` are convenience utilities for filtering
actions by a specific type or types. In `redux-observable`, `ofType` can optionally take multiple
action types to filter on. In `redux-most`, we want to be more explicit, as it is generally a good 
practice in functional programming to prefer a known number of arguments over a variable amount
of arguments. Therefore, `select` is used when we want to filter by a single action type, and
`selectArray` is used when we want to filter by multiple action types (via an array) simultaneously.

Additionally, to better align with the `Most` API, and because these functions take a known number
of arguments, `select` & `selectArray` are curried, which allows them to be used in either a
fluent style or a more functional style which enables the use of further currying, partial
application, & functional composition.

To use the fluent style, just use `Most`'s `thru` operator to pass the stream
through to `select`/`selectArray` as the 2nd argument.

```js
// Fluent style
const filteredAction$ = action$.thru(select(SOME_ACTION_TYPE))
const filteredActions$ = action$.thru(selectArray([SOME_ACTION_TYPE, SOME_OTHER_ACTION_TYPE]))
```

Otherwise, simply directly pass the stream as the 2nd argument.

```js
// Functional style
const filteredAction$ = select(SOME_ACTION_TYPE, action$)
const filteredActions$ = selectArray([SOME_ACTION_TYPE, SOME_OTHER_ACTION_TYPE], action$)
```
Alternatively, you can delay passing the 2nd argument while defining functional pipelines
via functional composition by using the `compose` or `pipe` functions from your favorite FP library, 
like `ramda` or `lodash/fp`. Again, this is because `select` & `selectArray` are auto-curried. Being
able to program in this very functional & Pointfree style is one of the main reasons why someone
might prefer using redux-most over redux-observable.

```js
// Functional & Pointfree style using currying & functional composition
import { compose, curry, pipe } from 'ramda'
import { debounce, filter, map } from 'most'

// NOTE: Most 2.0 will feature auto-curried functions, but right now we must curry them manually.
const curriedDebounce = curry(debounce)
const curriedFilter = curry(filter)
const curriedMap = curry(map)

// someEpic is a new function which is still awaiting one argument, the action$
const someEpic = compose(
  curriedMap(someFunction),
  curriedDebounce(800),
  select(SOME_ACTION_TYPE)
)

// someOtherEpic is a new function which is still awaiting one argument, the action$
// pipe is the same as compose, but read from left-to-right rather than right-to-left.
const someOtherEpic = pipe(
  selectArray([SOME_ACTION_TYPE, SOME_OTHER_ACTION_TYPE]),
  curriedFilter(somePredicate),
  curriedMap(someFunction)
)
```

## Dependencies

When creating an `EpicMiddleware` object using `createEpicMiddleware` or
`createStateStreamEnhancer`, you can pass an optional `dependencies` argument which
will be passed to each of your epics as the third argument. This can then be used
when testing your epics to avoid a more complex mocking approach.

__Example__

```js
// redux/configureStore.js
...
const fetchJSON = url => fetch(url).then(r => r.json());
const epicMiddleware = createEpicMiddleware(rootEpic, { fetchJSON })
...

// epics/user.js
import { FETCH_USER } from '../constants/ActionTypes'
import { storeUser } from '../actions'
import { select } from 'redux-most'

const fetchUserEpic = (action$, store, { fetchJSON }) =>
  action$.thru(select(FETCH_USER))
    .chain(({ userId }) => fromPromise(fetchJSON(`/users/${userId}`)))
    .map(storeUser);

// tests/user.js
it('fetches a user then emits a STORE_USER action', () => {
  const mockFetchJSON = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve({ username: 'foo' }));
  const actionsIn = of(fetchUser({ userId: 5 }));
  return fetchUserEpic(actionsIn, mockStore, { fetchJSON: mockFetchJSON })
    .reduce(flip(append), [])
    .then(actionsOut => {
      expect(actionsOut).toHaveLength(1);
      expect(actionsOut[0].type).toEqual(STORE_USER);
    });
});

```

## API Reference

- [createEpicMiddleware](https://github.com/joshburgess/redux-most#createepicmiddleware-rootepic)
- [createStateStreamEnhancer](https://github.com/joshburgess/redux-most#createstatestreamenhancer-epicmiddleware)
- [combineEpics](https://github.com/joshburgess/redux-most#combineepics-epics)
- [EpicMiddleware](https://github.com/joshburgess/redux-most#epicmiddleware)
- [replaceEpic](https://github.com/joshburgess/redux-most#replaceEpic)
- [select](https://github.com/joshburgess/redux-most#select-actiontype-stream)
- [selectArray](https://github.com/joshburgess/redux-most#selectArray-actiontypes-stream)
- [withState](https://github.com/joshburgess/redux-most#withstate-statestream-actionstream)

---

### `createEpicMiddleware (rootEpic, dependencies)`

`createEpicMiddleware` is used to create an instance of the actual `redux-most` middleware.
You provide a single root `Epic` and optional `dependencies`.

__Arguments__

1. `rootEpic` _(`Epic`)_: The root Epic.
2. `dependencies` _(`any`)_: Optional dependencies for your epics.

__Returns__

_(`MiddlewareAPI`)_: An instance of the `redux-most` middleware.

__Example__
```js
// redux/configureStore.js

import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
import { rootEpic, rootReducer } from './modules/root'

const epicMiddleware = createEpicMiddleware(rootEpic)

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
  )

  return store
}
```

---

### `createStateStreamEnhancer (epicMiddleware)`

`createStateStreamEnhancer` is used to access `redux-most`'s alternate API, which passes
`Epics` a state stream (Ex: `state$`) instead of the `{ dispatch, getState }` store
`MiddlewareAPI` object. You must provide an instance of the `EpicMiddleware`, and the
resulting function must be applied AFTER using `redux`'s `applyMiddleware` if also using
other middleware.

__Arguments__

1. `rootEpic` _(`Epic`)_: The root Epic.
2. `dependencies` _(`any`)_: Optional dependencies for your epics.

__Returns__

_(`MiddlewareAPI`)_: An enhanced instance of the `redux-most` middleware, exposing a stream
of state change values.

__Example__
```js
import { createStore, applyMiddleware } from 'redux'
import {
  createEpicMiddleware,
  createStateStreamEnhancer,
} from 'redux-most'
import rootEpic from '../epics'

const epicMiddleware = createEpicMiddleware(rootEpic)
const middleware = [...] // other middleware here
const storeEnhancers = compose(
  createStateStreamEnhancer(epicMiddleware),
  applyMiddleware(...middleware)
)

const store = createStore(rootReducer, storeEnhancers)
```

---

### `combineEpics (epicsArray)`

`combineEpics`, as the name suggests, allows you to pass in an array of epics and combine them into a single one.

__Arguments__

1. `epicsArray` _(`Epic[]`)_: The array of `epics` to combine into one root epic.

__Returns__

_(`Epic`)_: An Epic that merges the output of every Epic provided and passes along the redux store as arguments.

__Example__
```js
// epics/index.js

import { combineEpics } from 'redux-most'
import searchUsersDebounced from './searchUsersDebounced'
import searchUsers from './searchUsers'
import clearSearchResults from './clearSearchResults'
import fetchReposByUser from './fetchReposByUser'
import adminAccess from './adminAccess'

const rootEpic = combineEpics([
  searchUsersDebounced,
  searchUsers,
  clearSearchResults,
  fetchReposByUser,
  adminAccess,
])

export default rootEpic

```

---

### `EpicMiddleware`

An instance of the `redux-most` middleware.

To create it, pass your root Epic to [`createEpicMiddleware`](https://github.com/joshburgess/redux-most#createepicmiddleware-rootepic).

__Methods__

- [`replaceEpic (nextEpic)`](https://github.com/joshburgess/redux-most#replaceEpic)

#### <a id='replaceEpic'></a>`replaceEpic (nextEpic)`

Replaces the epic currently used by the middleware.

It is an advanced API. You might need this if your app implements code splitting and you
want to load some of the epics dynamically or you're using hot reloading.

__Example__

```js

import { createEpicMiddleware } from 'redux-most'
import rootEpic from '../epics'

...

const epicMiddleware = createEpicMiddleware(rootEpic)

...

// hot reload epics
const replaceRootEpic = () => {
  import('../epics').then(
    ({ default: nextRootEpic }) => { epicMiddleware.replaceEpic(nextRootEpic) }
  )
}

if (module.hot) {
  module.hot.accept('../epics', replaceRootEpic)
}
```

__Arguments__

1. `nextEpic` _(`Epic`)_: The next epic for the middleware to use.

---

### `select (actionType, stream)`

A helper function for filtering the stream of actions by a  single action type.

__Arguments__

1. `actionType` _(`string`)_: The type of action to filter by.
2. `stream` _(`Stream`)_: The stream of actions you are filtering. Ex: `actions$`.

__Returns__

_(Stream)_: A new, filtered stream holding only the actions corresponding to the action
type passed to `select`.

The `select` operator is curried, allowing you to use a fluent or functional style.

__Examples__
```js
// Fluent style

import { SEARCHED_USERS_DEBOUNCED } from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const whereEmpty = ({ payload: { query } }) => !query

const clear = action$ =>
  action$.thru(select(SEARCHED_USERS_DEBOUNCED))
    .filter(whereEmpty)
    .map(clearSearchResults)

export default clear
```

```js
// Functional style

import { SEARCHED_USERS_DEBOUNCED } from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const whereEmpty = ({ payload: { query } }) => !query

const clear = action$ => {
  const search$ = select(SEARCHED_USERS_DEBOUNCED, action$)
  const emptySearch$ = filter(whereEmpty, search$)
  return map(clearSearchResults, emptySearch$)
}

export default clear
```

```js
// Functional & Pointfree style using functional composition

import { SEARCHED_USERS_DEBOUNCED } from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'
import {
  curriedFilter as filter,
  curriedMap as map,
} from '../utils'
import { compose } from 'ramda'

const whereEmpty = ({ payload: { query } }) => !query

const clear = compose(
  map(clearSearchResults),
  filter(whereEmpty),
  select(SEARCHED_USERS_DEBOUNCED)
)

export default clear
```
---

### `selectArray (actionTypes, stream)`

A helper function for filtering the stream of actions by an array of action types.

__Arguments__

1. `actionTypes` _(`string[]`)_: An array of action types to filter by.
2. `stream` _(`Stream`)_: The stream of actions you are filtering. Ex: `actions$`.

__Returns__

_(Stream)_: A new, filtered stream holding only the actions corresponding to the action
types passed to `selectArray`.

The `selectArray` operator is curried, allowing you to use a fluent or functional style.

__Examples__
```js
// Fluent style

import {
  SEARCHED_USERS,
  SEARCHED_USERS_DEBOUNCED,
} from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { selectArray } from 'redux-most'

const whereEmpty = ({ payload: { query } }) => !query

const clear = action$ =>
  action$.thru(selectArray([
      SEARCHED_USERS,
      SEARCHED_USERS_DEBOUNCED,
    ]))
    .filter(whereEmpty)
    .map(clearSearchResults)

export default clear
```

```js
// Functional style

import {
  SEARCHED_USERS,
  SEARCHED_USERS_DEBOUNCED,
} from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { selectArray } from 'redux-most'

const whereEmpty = ({ payload: { query } }) => !query

const clear = action$ => {
  const search$ = selectArray([
    SEARCHED_USERS,
    SEARCHED_USERS_DEBOUNCED,
  ], action$)
  const emptySearch$ = filter(whereEmpty, search$)
  return map(clearSearchResults, emptySearch$)
}

export default clear
```

```js
// Functional & Pointfree style using functional composition

import {
  SEARCHED_USERS,
  SEARCHED_USERS_DEBOUNCED,
} from '../constants/ActionTypes'
import { clearSearchResults } from '../actions'
import { selectArray } from 'redux-most'
import {
  curriedFilter as filter,
  curriedMap as map,
} from '../utils'
import { compose } from 'ramda'

const whereEmpty = ({ payload: { query } }) => !query

const clear = compose(
  map(clearSearchResults),
  filter(whereEmpty),
  selectArray([
    SEARCHED_USERS,
    SEARCHED_USERS_DEBOUNCED,
  ])
)

export default clear
```
---

### `withState (stateStream, actionStream)`

A utility function for use with `redux-most`'s optional state stream API. This
provides a convenient way to `sample` the latest state change value. Note:
accessing the alternate API requires using `createStateStreamEnhancer`.

__Arguments__

1. `stateStream` _(`Stream`)_: The state stream provided by `redux-most`'s alternate API.
2. `actionStream` _(`Stream`)_: The filtered stream of action events used to trigger
sampling of the latest state. (Ex: `actions$`).

__Returns__

_(`[state, action]`)_: An Array of length 2 (or Tuple) containing the latest
state value at index 0 and the latest action of the filtered action stream at index 1.

`withState` is curried, allowing you to pass in the state stream & action stream
together, at the same time, or separately, delaying passing in the action stream.
This provides the user extra flexibility, allowing it to easily be used within 
functional composition pipelines.

__Examples__
```js
import { select, withState } from 'redux-most'
import { curriedMap as map } from '../utils'
import compose from 'ramda/src/compose'

const accessStateFromArray = ([state, action]) => ({
  type: 'ACCESS_STATE',
  payload: {
    latestState: state,
    accessedByAction: action,
  },
})

// dispatch { type: 'STATE_STREAM_TEST' } in Redux DevTools to test
const stateStreamTest = (action$, state$) => compose(
 map(accessStateFromArray),
 withState(state$),
 select('STATE_STREAM_TEST')
)(action$)

export default stateStreamTest
```

---