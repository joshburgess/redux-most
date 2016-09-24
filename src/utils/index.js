// taken from @most/prelude
export function curry2 (f) {
  function curried (a, b) {
    switch (arguments.length) { // eslint-disable-line fp/no-arguments
      case 0: return curried
      case 1: return b => f(a, b)
      default: return f(a, b)
    }
  }
  return curried
}
