/* @flow */

import Bugsy from './Bugsy';
import type { ErrorLike, Severity } from './common';
import * as syslog from './syslog';

export type ToStringOptions = {
  withDate: boolean;
};

export default function toString(err: ErrorLike, {
  withDate = false,
}: ToStringOptions = {}): string {
  const message: string = err.message;

  let severity: Severity;
  let name: string;

  if (err instanceof Bugsy) {
    severity = err.severity;
    name = err.code || err.name;
  } else {
    severity = syslog.ERROR;
    name = err.name;
  }

  const chunks = [];
  if (withDate) {
    chunks.push(`${(new Date()).toISOString()}`);
  }
  chunks.push(`[${severity}]`);
  chunks.push(`${name}`);
  if (message) {
    chunks.push(message);
  }

  let buf = '';
  for (let i = 0; i < chunks.length; i += 1) {
    if (i !== 0) {
      buf += ' ';
    }
    buf += chunks[i];
  }

  return buf;
}
