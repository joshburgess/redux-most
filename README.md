redux-most
==========

[Most.js](https://github.com/cujojs/most) based middleware for [Redux](http://redux.js.org/).

Handle async actions with monadic streams & reactive programming.

### Install
```bash
yarn add redux-most
```

You will also need peer dependencies, `redux` and `most`.

### Background

`redux-most` is based on [`redux-observable`](https://redux-observable.js.org/).
It uses the same pattern/concept of ["epics"](https://redux-observable.js.org/docs/basics/Epics.html)
without requiring [`RxJS 5`](http://reactivex.io/rxjs/) as a peer dependency.
Although `redux-observable` does provide capability for using other stream libraries via adapters,
`redux-most` allows you to bypass needing to install both `RxJS 5` and `most`. I prefer `most` for
working with observables and would rather have minimal dependencies. So, I wrote
this middleware primarily for my own use.

Please, see `redux-observable`'s [documentation](https://redux-observable.js.org/)
for details on usage.

### Why most over RxJS?

`RxJS 5` is great. It's quite a bit faster than `RxJS 4`, and `Rx`, in general, is a
very useful tool which happens to exist across many different languages.
Learning it is definitely a good idea. However, `most` is significantly smaller,
less complicated, and faster than `RxJS 5`. I prefer its more minimal set of 
operators and its focus on performance. Also, like [`Ramda`](http://ramdajs.com/)
or [`lodash/fp`](https://github.com/lodash/lodash/wiki/FP-Guide), `most`
supports a functional API in which the data collection (a stream, rather than 
an array, in this case) gets passed in last. This is important, because it 
allows you to use functional programming techniques like currying & partial 
application, which you can't do with `RxJS` without writing your own wrapper 
functions, because it only offers an OOP/fluent/chaining style API.

### Why integrate `most`/`RxJS` with `redux` instead of recreating it with streams?

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

I chose not to extend the `Observable`/`Stream` type with a custom `ActionsObservable`
type. So, when working with `redux-most`, you will be working with normal `most`
streams without any special extension methods. However, I have offered something
similar to `redux-observable`'s `ofType` operator in `redux-most` with the
`select` helper function.

Like `ofType`, `select` is a convenience utility for filtering
actions by a specific type. However, `ofType` can optionally take multiple
action types to filter on, whereas `select` only takes a single type. I am not
yet convinced of a great use case for filtering on multiple types. If you have
one, please open an issue and describe it to me.

Additionally, to better align with the `most` API, `select` can be used in either
a fluent style or a more functional style.

To use the fluent style, just use most's `thru` operator to pass the stream
through to `select` as the 2nd argument.

```js
action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
```

Otherwise, simply directly pass the stream as the 2nd argument.

```js
select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
```

## API Reference

- [createEpicMiddleware](#createepicmiddleware-rootepic)
- [combineEpics](#combineepics-epics)
- [EpicMiddleware](#epicmiddleware)
- [select](#select-actiontype-stream)

---

### `createEpicMiddleware (rootEpic)`

`createEpicMiddleware(rootEpic)` is used to create an instance of the actual `redux-most` middleware.
You provide a single, root `Epic`.

__Arguments__

1. `rootEpic` _(`Epic`)_: The root Epic.

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

### `combineEpics (...epics)`

`combineEpics()`, as the name suggests, allows you to take multiple epics and combine them into a single one.

__Arguments__

1. `...epics` _(`Epic[]`)_: The [epics](../basics/Epics.md) to combine.

__Returns__

_(`Epic`)_: An Epic that merges the output of every Epic provided and passes along the redux store as arguments.

__Example__
```js
// epics/index.js

import { combineEpics } from 'redux-most'
import pingEpic from './ping'
import fetchUserEpic from './fetchUser'

export default combineEpics(
  pingEpic,
  fetchUserEpic
)
```

---

### `EpicMiddleware`

An instance of the `redux-most` middleware.

To create it, pass your root Epic to [`createEpicMiddleware`](#createepicmiddleware-rootepic).

__Methods__

- [`replaceEpic (nextEpic)`](#replaceEpic)

#### <a id='replaceEpic'></a>`replaceEpic (nextEpic)`

Replaces the epic currently used by the middleware.

It is an advanced API. You might need this if your app implements code splitting and you
want to load some of the epics dynamically or you're using hot reloading.

__Arguments__

1. `nextEpic` _(`Epic`)_: The next epic for the middleware to use.

---

### `select (actionType, stream)`

A helper function for filtering the stream of actions by type.

__Arguments__

1. `actionType` _(`String`)_: The type of action you want to filter by.
2. `stream` _(`Stream`)_: The stream of actions you are filtering. Ex: `actions$`.

The `select` operator is curried, allowing you to use a fluent or functional style.

__Examples__
```js
// fluent style

import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const clear = action$ =>
  action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
    .filter(action => !action.payload.query)
    .map(clearSearchResults)

export default clear
```

```js
// functional style

import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const clear = action$ => {
  const search$ = select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
  const emptySearch$ = filter(action => !action.payload.query, search$)
  return map(clearSearchResults, emptySearch$)
}

export default clear
```
