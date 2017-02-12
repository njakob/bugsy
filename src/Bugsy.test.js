/* @flow */

import test from 'ava';
import Bugsy from './Bugsy';
import * as syslog from './syslog';

test('create with metadata', (t) => {
  const err = new Bugsy({ code: 'performance', message: 'High performance', meta: { style: 'cute' } });

  t.deepEqual(err.meta, { style: 'cute' });
  t.pass();
});

test('create a copy of metadata', (t) => {
  const meta = { style: 'cute' };
  const err = new Bugsy({ code: 'performance', message: 'High performance', meta });

  t.not(err.meta, meta);
  t.pass();
});

test('change severity', (t) => {
  const err = new Bugsy({ code: 'performance', message: 'High performance' });

  err.setSeverity(syslog.ALERT);

  t.is(err.severity, syslog.ALERT);
  t.pass();
});

test('no name', (t) => {
  const err = new Bugsy();

  t.is(err.name, 'Error');
  t.pass();
});

test('merge metadata', (t) => {
  const err = new Bugsy();

  err.addMeta({ high: true });
  err.addMeta({ performance: true });

  t.deepEqual(err.meta, {
    high: true,
    performance: true,
  });
  t.pass();
});
