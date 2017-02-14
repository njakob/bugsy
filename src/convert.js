/* @flow */

import Bugsy from './Bugsy';
import type { ErrorLike } from './common';

export default function convert(err: ErrorLike): Bugsy {
  if (err instanceof Bugsy) {
    return err;
  }

  return new Bugsy({
    message: err.message,
    stack: err.stack,
  });
}
