/* @flow */

import test from 'ava';
import createError from './createError';

test('create function', (t) => {
  const performance = createError('performance', 'High performance');

  t.true(typeof performance === 'function');
  t.pass();
});

test('function generate an error', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.true(err instanceof Error);
  t.pass();
});

test('generated error code', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.is(err.code, 'performance');
  t.pass();
});

test('generated error name', (t) => {
  const performance = createError('performance', 'High performance');
  const err = performance();

  t.is(err.name, 'PerformanceError');
  t.pass();
});
