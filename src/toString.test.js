/* @flow */

import test from 'ava';
import Bugsy from './Bugsy';
import * as syslog from './syslog';
import toString from './toString';

test('native error', (t) => {
  t.is(toString(new Error()), '[err] Error');
  t.pass();
});

test('severity', (t) => {
  t.is(toString(new Bugsy({ severity: syslog.ALERT })), '[alert] Error');
  t.pass();
});

test('code', (t) => {
  t.is(toString(new Bugsy({ code: 'performance' })), '[err] performance');
  t.pass();
});
