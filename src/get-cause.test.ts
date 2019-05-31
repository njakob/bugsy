import { Bugsy, getCause } from '.';

describe('Utils', () => {
  describe('getCause', () => {
    it('get cause of Error', () => {
      const error = new Error();
      const cause = getCause(error);
      expect(cause).toBeNull();
    });

    it('get cause of Bugsy error', () => {
      const error = new Error();
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        cause: error,
      });
      const cause = getCause(networkError);
      expect(cause).toBe(error);
    });
  });
});
