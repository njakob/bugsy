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
  severity?: Severity;
};

export default class Bugsy extends Error {
  code: string;
  severity: Severity;
  meta: any;

  constructor(code: string, message: string, {
    severity = syslog.ERROR
  }: BugsyOptions = {}) {
    super();
    this.message = message;
    this.name = createErrorName(code);
    this.code = code;
    this.severity = severity;
    this.meta = {};
    const error = new Error(message);
    error.name = this.name;
    const stack = error.stack.split('\n');
    stack.splice(1, 2);
    this.stack = stack.join('\n');
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
