import { Bugsy, findCause, getMetadata } from '.';

describe('Utils', () => {
  describe('findCause', () => {
    it('find when no cause', () => {
      const error = new Error();
      const predicate = jest.fn(() => false);
      const cause = findCause(error, predicate);
      expect(cause).toBeNull();
      expect(predicate).toBeCalledTimes(1);
    });

    it('find second level cause with metadata', () => {
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        metadata: {
          address: '127.0.0.1',
        },
      });
      const processingError = new Bugsy({
        name: 'ProcessingError',
        message: 'Processing error',
        cause: networkError,
      });
      const predicate = jest.fn(innerError => getMetadata(innerError).address === '127.0.0.1');
      const cause = findCause(processingError, predicate);
      expect(cause).toBe(networkError);
      expect(predicate).toBeCalledTimes(2);
    });
  });
});
