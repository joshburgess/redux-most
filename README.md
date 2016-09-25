# redux-most

[Most.js](https://github.com/cujojs/most) based middleware for Redux.

Handle async actions with monadic streams & reactive programming.

### Background

`redux-most` is based on [redux-observable](https://github.com/redux-observable/redux-observable).
It uses the same pattern/concept of "epics" without requiring RxJS as a peer
dependency. Most is my preferred library for working with observables. So, I
wrote this middleware primarily for my own use.

Please, see `redux-observable`'s [documentation](https://github.com/redux-observable/redux-observable/blob/master/README.md)
for details on usage.

### Why most over RxJS?

RxJS 5 is great. It's quite a bit faster than RxJS 4, and Rx, in general, is a
very useful tool which happens to exist across many different languages.
Learning it is definitely a good idea. However, most is significantly smaller,
less complicated, and faster than RxJS 5. I prefer its more minimal API and
focus on performance for my own JS projects using reactive streams.

### Why `redux-most` or `redux-observable` over `redux-saga`?

`redux-saga` is great. It's a sophisticated approach to handling asynchronous
actions with Redux and can handle very complicated tasks with ease. However,
due to generators being pull-based, it is much more imperative in nature. I
simply prefer the more declarative style of push-based streams & reactive
programming.

### Differences between `redux-most` & `redux-observable`

I chose not to extend the Observable/Stream type with a custom ActionsObservable
type. So, when working with most-redux, you will be working with normal most
streams without any special extension methods. However, I have offered something
similar to `redux-observable`'s `ofType` operator in `redux-most` with the
`select` helper function.

Like `ofType`, `select` is a convenience utility for filtering
actions by a specific type. However, 'ofType' can optionally take multiple
action types to filter on, whereas `select` only takes a single type. I am not
yet convinced of a great use case for filtering on multiple types. If you have
one, please open an issue and describe it to me.

Additionally, to better align with the most API, `select` can be used in either
a fluent style or a more functional style.


To use the fluent style, just use most `thru` operator to pass the stream
through to `select` in as the 2nd argument.

```
action$.thru(select(ActionTypes.SEARCHED_USERS))
```

Otherwise, simply directly pass the stream as the 2nd argument.

```
select(ActionTypes.SEARCHED_USERS, action$)
```
