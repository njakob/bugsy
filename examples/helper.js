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
  } catch (error) {
    var str = '';
    if (error.level) {
      str += '[' + error.level + '] '
    }
    str += error.name || 'Error';
    if (error.message) {
      str += ': ' + error.message;
    }
    str += '\n';
    str += error.stack.split('\n').splice(1).join('\n');
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
  try {
    fn();
  } catch (error) {
    switch (true) {
      case bugsy.instanceOf(error, SystemError):
        error.level = bugsy.LEVELS_SYSLOG.ALERT;
        throw error;
      case bugsy.withCode(error, SystemError):
        break;
    }
  }
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