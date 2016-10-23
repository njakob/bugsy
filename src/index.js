// @flow

export type Severity = string;

export const SYSLOG_EMERGENCY: Severity = 'emerg';
export const SYSLOG_ALERT: Severity = 'alert';
export const SYSLOG_CRITICAL: Severity = 'crit';
export const SYSLOG_ERROR: Severity = 'err';
export const SYSLOG_WARNING: Severity = 'warning';
export const SYSLOG_NOTICE: Severity = 'notice';
export const SYSLOG_INFORMATIONAL: Severity = 'info';
export const SYSLOG_DEBUG: Severity = 'debug';

function transform(name: string): string {
  const words = name.split(/[\s_-]/);
  return words.map((word: string): string => word[0].toUpperCase() + word.slice(1).toLowerCase()).join('');
}

type ToStringOptions = {
  withDate: boolean;
};

export function toString(err: {
  name: ?string;
  message: ?string;
  code?: string;
  severity?: Severity;
}, { withDate = true }: ToStringOptions = {}): string {
  const severity: Severity = err.severity || SYSLOG_ERROR;
  const message = err.message || '';
  const code = err.code || err.name || 'Error';

  let buf = '';
  if (withDate) {
    buf += `${(new Date()).toISOString()} `;
  }
  buf += `[${severity}] `;
  buf += `${code} `;
  if (message) {
    buf += message;
  }

  return buf;
}

export class ExtendableError extends Error {
  code: string;
  severity: Severity;
  meta: any;

  constructor(code: string, message: string, { severity = SYSLOG_ERROR }: { severity?: Severity; } = {}) {
    super();
    this.message = message;
    this.name = `${transform(code)}Error`;
    this.code = code;
    this.severity = severity;
    this.meta = {};
    const error = new Error(message);
    error.name = this.name;
    const stack = error.stack.split('\n');
    stack.splice(1, 2);
    this.stack = stack.join('\n');
  }

  addSeverity(value: Severity): this {
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

  // eslint-disable-next-line class-methods-use-this
  marshal(): any {
    return {};
  }
}

export function newError(code: string, message: string): Class<ExtendableError> {
  return class extends ExtendableError {
    constructor(options: { severity?: Severity; }) {
      super(code, message, options);
    }
  };
}
