import * as bugsy from '../lib';

export const CODES = {
  UNAUTHORIZED: 'unauthorized',
  UNEXPECTED_API_RESPONSE: 'unexpected_api_response',
  UNEXPECTED: 'unexpected'
};

export const UnauthorizedError = bugsy.newError(CODES.UNAUTHORIZED, 'Unauthorized access');
export const UnexpectedError = bugsy.newError(CODES.UNAUTHORIZED, 'Unexpected access');

export class UnexpectedAPIResponse extends bugsy.ExtendableError {
  path: string;

  constructor(path: string) {
    super(CODES.UNEXPECTED_API_RESPONSE, 'Unexpected API response');
    this.path = path;
  }

  marshal() {
    return {
      path: this.path
    };
  }
}

function e1() {
  throw new UnauthorizedError();
}

function e2() {
  throw new UnexpectedError();
}

function e3() {
  throw new UnexpectedAPIResponse('/api/test');
}

function handle(fn) {
  try {
    fn();
  } catch (err) {
    console.log(bugsy.toString(err));
  }
}

handle(e1);
handle(e2);
handle(e3);
