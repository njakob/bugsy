import { Bugsy, findCause, getMetadata } from '.';

describe('Utils', () => {
  describe('findCause', () => {
    it('find second level cause', () => {
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unkonwn network error happened',
        metadata: {
          address: '127.0.0.1',
        },
      });
      const processingError = new Bugsy({
        name: 'ProcessingError',
        message: 'Processing error',
        cause: networkError,
      });
      const cause = findCause(processingError, innerError => getMetadata(innerError).address === '127.0.0.1');
      expect(cause).toBe(networkError);
    });
  });
});
