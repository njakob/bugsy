/* @flow */

import Bugsy from './Bugsy';

export default function convert(err: any): Bugsy {
  if (err instanceof Bugsy) {
    return err;
  }

  const {
    message,
    stack,
  } = err;

  return new Bugsy({
    message,
    stack,
  });
}
