import { Bugsy, getSeverity } from '.';

describe('Utils', () => {
  describe('getSeverity', () => {
    it('get cause of Error', () => {
      const error = new Error();
      const severity = getSeverity(error);
      expect(severity).toBe(0);
    });

    it('get cause of Bugsy error', () => {
      const error = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
        severity: 9,
      });
      const severity = getSeverity(error);
      expect(severity).toBe(9);
    });
  });
});
