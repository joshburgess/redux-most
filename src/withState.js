const unCurry2 = fn => (arg1, arg2) =>
  fn.length === 1 ? fn(arg1)(arg2) : fn(arg1, arg2)

// withState :: (s$ -> a$ -> a$) -> s$ -> a$ -> a$
export const withState = epic => {
  const uncurriedEpic = unCurry2(epic)
  return (state$, action$) => uncurriedEpic(state$, action$)
}
