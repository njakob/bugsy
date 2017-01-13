/* @flow */

import type { IError, Severity } from './common';
import * as syslog from './syslog';

export type ToStringOptions = {
  withDate: boolean;
};

export default function toString(err: IError, {
  withDate = false,
}: ToStringOptions = {}): string {
  const severity: Severity = err.severity || syslog.ERROR;
  const message: string = err.message || '';
  const code: string = err.code || err.name || 'Error';

  const chunks = [];
  if (withDate) {
    chunks.push(`${(new Date()).toISOString()}`);
  }
  chunks.push(`[${severity}]`);
  chunks.push(`${code}`);
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
