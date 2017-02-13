/* @flow */

import test from 'ava';
import Bugsy from './Bugsy';
import convert from './convert';

test('convert native errors', (t) => {
  t.true(convert(new Error()) instanceof Bugsy);
  t.pass();
});

test('converted error contains stack', (t) => {
  const err = new Error();

  t.is(convert(err).stack, err.stack);
  t.pass();
});
