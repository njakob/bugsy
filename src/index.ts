type N<T> = T | null;

type Metadata = { [key: string]: unknown };

export interface ErrorLike {
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
  severity?: number;
  metadata?: Metadata;
}

interface V8ErrorConstructor {
  captureStackTrace?: (targetObject: Object, constructorOption?: Function) => void;
};

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
    if (options.cause) {
      this.cause = options.cause;
    }
    if (options.severity) {
      this.severity = options.severity;
    }
    if (options.metadata) {
      this.metadata = Object.assign({}, options.metadata);
    }
  }
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

type FindGetter<T> = (error: ErrorLike) => T;

function find<T>(error: ErrorLike, value: T, getter: FindGetter<T>): N<ErrorLike> {
  for (let pointer = error as N<ErrorLike>; pointer !== null; pointer = getCause(pointer)) {
    if (getter(pointer) === value) {
      return pointer;
    }
  }
  return null;
}

export function findCauseByName(error: ErrorLike, name: string): N<ErrorLike> {
  return find(error, name, (innerError) => innerError.name);
}

export function findCauseBySeverity(error: ErrorLike, severity: number) {
  return find(error, severity, getSeverity);
}

export function matchCauseByName(error: ErrorLike, name: string): boolean {
  return findCauseByName(error, name) !== null;
}

export function matchCauseBySeverity(error: ErrorLike, name: string): boolean {
  return findCauseByName(error, name) !== null;
}
