/* @flow */

import Bugsy from './Bugsy';
import type { Severity } from './types';
import * as syslog from './syslog';

export type ToStringOptions = {
  withDate: boolean;
};

export default function toString(err: any, {
  withDate = false,
}: ToStringOptions = {}): string {
  let message: string;
  let name: string;
  let severity: Severity;

  if (err.message) {
    message = err.message;
  }

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
