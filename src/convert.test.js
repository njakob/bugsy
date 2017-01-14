import test from 'ava';
import Bugsy from './Bugsy';
import convert from './convert';

test('convert native Error', (t) => {
  t.true(convert(new Error()) instanceof Bugsy);
  t.pass();
});

test('copy stack', (t) => {
  const err = new Error();

  t.is(convert(err).stack, err.stack);
  t.pass();
});
