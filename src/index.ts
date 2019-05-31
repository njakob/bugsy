type N<T> = T | null;
type M<T> = T | void;

interface Metadata { [key: string]: unknown }

export interface ErrorLike {
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
  severity?: number;
  metadata?: Metadata;
}

export function getCause(error: ErrorLike): N<Error> {
  return error.cause || null;
}

export function getMetadata(error: ErrorLike): Metadata {
  return error.metadata || {};
}

export function getSeverity(error: ErrorLike, defaultSeverity = 0): number {
  if (typeof error.severity !== 'number') {
    return defaultSeverity;
  }
  return error.severity;
}

function getDefault<T>(value: M<T>, defaultValue: T): T {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

interface V8ErrorConstructor {
  captureStackTrace?: (target: unknown, ctor?: Function) => void;
}

const NativeError = Error as V8ErrorConstructor;

interface BugsyOptions {
  name: string;
  message: string;
  severity?: number;
  cause?: ErrorLike;
  metadata?: Metadata;
}

export class Bugsy extends Error {
  public cause?: ErrorLike;
  public severity?: number;
  public metadata?: Metadata;

  public constructor(options: BugsyOptions) {
    super(options.message);
    Object.defineProperty(this, 'name', {
      value: options.name,
      enumerable: false,
      writable: true,
    });
    if (NativeError.captureStackTrace) {
      NativeError.captureStackTrace(this, Bugsy);
    }
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
    const severity = getDefault(this.cause && getSeverity(this.cause), options.severity);
    if (severity !== undefined) {
      this.severity = severity;
    }
    if (options.metadata !== undefined) {
      this.metadata = Object.assign({}, options.metadata);
    }
  }
}

export function getFullStack(error: ErrorLike): string {
  const cause = getCause(error);
  let buf = error.stack || '';
  if (cause) {
    const fullStack = getFullStack(cause);
    if (fullStack) {
      buf += `\ncaused by: ${fullStack}`;
    }
  }
  return buf;
}

type FindClausePredicate = (error: ErrorLike) => boolean;

export function findCause(error: ErrorLike, predicate: FindClausePredicate): N<ErrorLike> {
  for (let pointer = error as N<ErrorLike>; pointer !== null; pointer = getCause(pointer)) {
    if (predicate(pointer)) {
      return pointer;
    }
  }
  return null;
}

export function findCauseByName(error: ErrorLike, name: string): N<ErrorLike> {
  return findCause(error, innerError => innerError.name === name);
}

export function findCauseBySeverity(error: ErrorLike, severity: number): N<ErrorLike> {
  return findCause(error, innerError => severity <= getSeverity(innerError));
}

export function matchCauseByName(error: ErrorLike, name: string): boolean {
  return findCauseByName(error, name) !== null;
}

export function matchCauseBySeverity(error: ErrorLike, severity: number): boolean {
  return findCauseBySeverity(error, severity) !== null;
}
