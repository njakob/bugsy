import { Bugsy, matchCauseBySeverity } from '.';

describe('Utils', () => {
  describe('matchCauseBySeverity', () => {
    it('match severity first level Error', () => {
      const error = new Error();
      const match = matchCauseBySeverity(error, 0);
      expect(match).toBeTruthy();
    });

    it('match default severity first level Bugsy error', () => {
      const error = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
      });
      const match = matchCauseBySeverity(error, 0);
      expect(match).toBeTruthy();
    });

    it('match severity first level Bugsy error', () => {
      const error = new Error();
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        cause: error,
        severity: 1,
      });
      const match = matchCauseBySeverity(networkError, 0);
      expect(match).toBeTruthy();
    });

    it('match severity second level Bugsy error', () => {
      const error = new Error();
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        cause: error,
        severity: 1,
      });
      const processingError = new Bugsy({
        name: 'ProcessingError',
        message: 'Processing error',
        cause: networkError,
        severity: 1,
      });
      const match = matchCauseBySeverity(processingError, 0);
      expect(match).toBeTruthy();
    });
  });
});
