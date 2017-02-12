/* @flow */

import test from 'ava';
import createDynamicError from './createDynamicError';

test('return function', (t) => {
  const performance = createDynamicError('performance', (n: number) => `High performance ${n}`);

  t.true(typeof performance === 'function');
  t.pass();
});

test('returned function generates an error', (t) => {
  const performance = createDynamicError('performance', () => 'High performance');
  const err = performance();

  t.true(err instanceof Error);
  t.pass();
});

test('returned function generates an error with correct message', (t) => {
  const performance = createDynamicError('performance', (n: number) => `High performance ${n}`);
  const err = performance(10);

  t.is(err.message, 'High performance 10');
  t.pass();
});


test('returned function generates an error with correct code', (t) => {
  const performance = createDynamicError('performance', (n: number) => `High performance ${n}`);
  const err = performance(10);

  t.is(err.code, 'performance');
  t.pass();
});

test('returned function generates an error with correct name', (t) => {
  const performance = createDynamicError('performance', (n: number) => `High performance ${n}`);
  const err = performance(10);

  t.is(err.name, 'PerformanceError');
  t.pass();
});
