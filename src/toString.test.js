import test from 'ava';
import toString from './toString';

test('stringify native Error', (t) => {
  t.is(toString(new Error()), '[err] Error');
  t.pass();
});
