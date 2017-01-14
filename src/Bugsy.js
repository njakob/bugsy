/* @flow */

import type { Severity } from './common';
import * as syslog from './syslog';

function camelCase(value: string): string {
  return value.split(/[\s_-]/).map((word: string): string => (
    word[0].toUpperCase() + word.slice(1).toLowerCase()
  )).join('');
}

function createErrorName(code: string): string {
  return `${camelCase(code)}Error`;
}

export type BugsyOptions = {
  message: string;
  name?: string;
  code?: string;
  severity?: Severity;
  stack?: string;
};

export default class Bugsy extends Error {
  code: ?string;
  severity: Severity;
  meta: any;

  constructor({
    code,
    message,
    stack,
    name = 'Error',
    severity = syslog.ERROR,
  }: BugsyOptions = {}) {
    super();

    this.code = code;
    this.severity = severity;
    this.message = message;

    if (typeof code !== 'undefined') {
      this.name = createErrorName(code);
    } else {
      this.name = name;
    }

    if (typeof stack === 'undefined') {
      const fake = new Error(message);
      fake.name = this.name;
      const buildStack = fake.stack.split('\n');
      buildStack.splice(1, 2);
      this.stack = buildStack.join('\n');
    } else {
      this.stack = stack;
    }
  }

  setSeverity(value: Severity): this {
    this.severity = value;
    return this;
  }

  addMeta(value: any): this {
    this.meta = {
      ...this.meta,
      ...value
    };
    return this;
  }
}
