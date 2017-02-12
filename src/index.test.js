/* @flow */

import test from 'ava';
import Bugsy from './Bugsy';
import createError from './createError';
import createDynamicError from './createDynamicError';
import toString from './toString';
import convert from './convert';
import * as syslog from './syslog';
import * as bugsy from '.';

test('export Bugsy class', (t) => {
  t.truthy(bugsy.Bugsy);
  t.is(bugsy.Bugsy, Bugsy);
  t.pass();
});

test('export syslog constants', (t) => {
  t.truthy(bugsy.syslog);

  Object.keys(syslog).forEach((key) => {
    t.is(bugsy.syslog[key], syslog[key]);
  });

  t.pass();
});

test('export createError', (t) => {
  t.truthy(bugsy.createError);
  t.is(bugsy.createError, createError);
  t.pass();
});

test('export createDynamicError', (t) => {
  t.truthy(bugsy.createDynamicError);
  t.is(bugsy.createDynamicError, createDynamicError);
  t.pass();
});

test('export toString', (t) => {
  t.truthy(bugsy.toString);
  t.is(bugsy.toString, toString);
  t.pass();
});

test('export convert', (t) => {
  t.truthy(bugsy.convert);
  t.is(bugsy.convert, convert);
  t.pass();
});
