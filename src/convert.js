/* @flow */

import Bugsy from './Bugsy';

export default function convert(err: Error): Bugsy {
  if (err instanceof Bugsy) {
    return err;
  }

  return new Bugsy({
    message: err.message,
    stack: err.stack,
  });
}
