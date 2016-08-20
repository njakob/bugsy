"use strict";

var util = require('util');
var bugsy = require('../lib');

var CODES = {
  UNKNOWN_SYSTEM: 'unknown_system',
  MISSING_FILE: 'missing_file',
  UNAUTHORIZED: 'unauthorized',
};

var SystemError = bugsy.create('SystemError', 'System related error', { level: bugsy.LEVELS_SYSLOG.ALERT, code: CODES.UNKNOWN_SYSTEM });
var UnauthorizedError = bugsy.create('UnauthorizedError', 'Invalid credentials', { code: CODES.UNAUTHORIZED });
var MissingFileError = bugsy.create('MissingFileError', 'Unable to open a file', { inherits: SystemError, code: CODES.MISSING_FILE });

function show(fn) {
  try {
    var value = fn();
    if (value === undefined) {
      console.log('No error');
    } else {
      console.log('Value: ' + value);
    }
  } catch (err) {
    var str = '';
    if (err.level) {
      str += '[' + err.level + '] '
    }
    str += err.name || 'Error';
    if (err.message) {
      str += ': ' + err.message;
    }
    str += '\n';
    str += err.stack.split('\n').splice(1).join('\n');
    console.log(str);
  }
}

show(function() {
  console.log("Generate a system error with pre-defined severity level and code.");
  throw new SystemError();
});

show(function() {
  console.log("Generate a system error by overriding the default severity level.");
  throw new SystemError({ level: bugsy.LEVELS_SYSLOG.INFORMATIONAL });
});

function h1(fn) {
  bugsy.transform(fn, [
    bugsy.instanceOf(SystemError).transform(function (err) { err.level = bugsy.LEVELS_SYSLOG.ALERT }),
    bugsy.code(CODES.MISSING_FILE).drop()
  ]);
}

show(function() {
  console.log("Generate a system error where a transformer update the severity.");
  h1(function() {
    throw new SystemError();
  });
});

show(function() {
  console.log("Generate a missing file error where a transformer drop the error.");
  h1(function() {
    throw new MissingFileError();
  });
});

show(function() {
  console.log("Generate a missing file error where a transformer drop the error.");
  h1(function() {
    throw new MissingFileError();
  });
});

function r1(err) {
  return bugsy.reduce(err, [
    bugsy.instanceOf(UnauthorizedError).reduce(function () { return 401; })
  ], 500);
}

show(function () {
  console.log("Generate an unauthorized error where a reducer return 401");
  return r1(new UnauthorizedError());
});