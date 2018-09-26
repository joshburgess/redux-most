import { snapshot } from '@most/core';
import { curry2 } from '@most/prelude';

const toArray = (action, state) => [state, action];
const flip = fn => curry2((arg1, arg2) => fn(arg2, arg1));

export const withState = flip(snapshot(toArray));