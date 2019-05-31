import { Bugsy, getFullStack } from '.';

describe('Utils', () => {
  describe('getFullStack', () => {
    it('get full stack of Error', () => {
      const error = new Error();
      const fullStack = getFullStack(error);
      expect(fullStack).toBe(error.stack);
    });

    it('get full stack of first level Bugsy error', () => {
      const error = new Error();
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        cause: error,
      });
      const fullStack = getFullStack(networkError);
      expect(fullStack).toBe(`${networkError.stack}\ncaused by: ${error.stack}`);
    });
  });
});
