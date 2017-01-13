/* @flow */

import Bugsy from './Bugsy';

export default function createError(code: string, message: string): () => Bugsy {
  return (): Bugsy => (
    new Bugsy(code, message)
  );
}
