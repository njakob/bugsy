import test from 'ava';
import Bugsy from './Bugsy';
import * as syslog from './syslog';

test('change severity', (t) => {
  const err = new Bugsy('performance', 'High performance');

  err.setSeverity(syslog.ALERT);

  t.is(err.severity, syslog.ALERT);
  t.pass();
});
