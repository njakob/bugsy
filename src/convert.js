/* @flow */

import Bugsy from './Bugsy';
import type { IError } from './common';

export default function wrap(err: IError): Bugsy {
  if (err instanceof Bugsy) {
    return err;
  }

  return new Bugsy({
    code: err.code,
    message: err.message,
    stack: err.stack,
  });
}
