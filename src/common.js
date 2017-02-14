/* @flow */

export type Severity = string;

export type ErrorLike = Error | Error & {
  severity: Severity;
  code: ?string;
  meta: ?any;
};
