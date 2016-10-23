
import { expect } from 'chai';
import * as bugsy from '..';

describe('bugsy', () => {
  it('should export all Syslog severity levels', () => {
    expect(bugsy.SYSLOG_EMERGENCY).to.exist;
    expect(bugsy.SYSLOG_ALERT).to.exist;
    expect(bugsy.SYSLOG_CRITICAL).to.exist;
    expect(bugsy.SYSLOG_ERROR).to.exist;
    expect(bugsy.SYSLOG_WARNING).to.exist;
    expect(bugsy.SYSLOG_NOTICE).to.exist;
    expect(bugsy.SYSLOG_INFORMATIONAL).to.exist;
    expect(bugsy.SYSLOG_DEBUG).to.exist;
  });

  it('should export `ExtendableError` class', () => {
    expect(bugsy.ExtendableError).to.be.a.function;
  });

  it('should export `toString` function', () => {
    expect(bugsy.toString).to.be.a.function;
  });
});

