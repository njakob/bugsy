/* @flow */

export type Severity = string;

export type IError = {
  name: ?string;
  message: ?string;
  code?: string;
  severity?: Severity;
};
