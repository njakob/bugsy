/* @flow */

import test from 'ava';
import createError from './createError';

test('return function', (t) => {
  const performance = createError('performance', 'High performance');

  t.true(typeof performance === 'function');
  t.pass();
});

test('returned function generates an error', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.true(err instanceof Error);
  t.pass();
});

test('returned function generates an error with correct message', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.is(err.message, 'High performance');
  t.pass();
});

test('returned function generates an error with correct code', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.is(err.code, 'performance');
  t.pass();
});

test('returned function generates an error with correct name', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.is(err.name, 'PerformanceError');
  t.pass();
});
