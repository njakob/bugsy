/* @flow */

import type { IError, Severity } from './common';
import * as syslog from './syslog';

export type ToStringOptions = {
  withDate: boolean;
};

export default function toString(err: IError, {
  withDate = true
}: ToStringOptions = {}): string {
  const severity: Severity = err.severity || syslog.ERROR;
  const message: string = err.message || '';
  const code: string = err.code || err.name || 'Error';

  let buf = '';
  if (withDate) {
    buf += `${(new Date()).toISOString()} `;
  }
  buf += `[${severity}] `;
  buf += `${code} `;
  if (message) {
    buf += message;
  }

  return buf;
}
