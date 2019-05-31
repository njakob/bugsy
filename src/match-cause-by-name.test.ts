import { Bugsy, matchCauseByName } from '.';

describe('Utils', () => {
  describe('matchCauseByName', () => {
    it('match name first level Error', () => {
      const error = new Error();
      const match = matchCauseByName(error, 'Error');
      expect(match).toBeTruthy();
    });

    it('match name first level TypeError', () => {
      const error = new TypeError();
      const match = matchCauseByName(error, 'TypeError');
      expect(match).toBeTruthy();
    });

    it('match name first level Bugsy error', () => {
      const error = new Bugsy({
        name: 'NetworkError',
        message: 'Unknown network error happened',
      });
      const match = matchCauseByName(error, 'NetworkError');
      expect(match).toBeTruthy();
    });
  });
});
