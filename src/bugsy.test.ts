import { Bugsy, getSeverity } from '.';

describe('Utils', () => {
  describe('Bugsy', () => {
    it('inherit cause severity', () => {
      const networkError = new Bugsy({
        name: 'NetworkError',
        message: 'Network error happened',
        severity: 3,
      });
      const processingError = new Bugsy({
        name: 'ProcessingError',
        message: 'Processing error happened',
        cause: networkError,
      });
      const severity = getSeverity(processingError);
      expect(severity).toBe(3);
    });
  });
});
