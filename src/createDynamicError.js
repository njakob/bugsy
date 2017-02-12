/* @flow */

import Bugsy from './Bugsy';

export type MessageFactory<T> = (meta: T) => string;

export default function createDynamicError<T>(code: string, message: MessageFactory<T>): (meta: T) => Bugsy {
  return meta => new Bugsy({ code, message: message(meta), meta });
}
