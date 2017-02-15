/* @flow */

import Bugsy from './Bugsy';

export default function createDynamicError<T>(code: string, message: (meta: T) => string): (meta: T) => Bugsy {
  return meta => new Bugsy({ code, message: message(meta), meta });
}
