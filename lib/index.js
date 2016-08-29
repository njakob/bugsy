"use strict";

var util = require('util');

module.exports = {};

var LEVELS_SYSLOG = {
  EMERGENCY: 'emerg',
  ALERT: 'alert',
  CRITICAL: 'crit',
  ERROR: 'err',
  WARNING: 'warning',
  NOTICE: 'notice',
  INFORMATIONAL: 'info',
  DEBUG: 'debug'
};
module.exports.LEVELS_SYSLOG = LEVELS_SYSLOG;

var LEVELS_SYSLOG_ORDER = {};
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.EMERGENCY] = 0;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.ALERT] = 1;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.CRITICAL] = 2;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.ERROR] = 3;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.WARNING] = 4;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.NOTICE] = 5;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.INFORMATIONAL] = 6;
LEVELS_SYSLOG_ORDER[LEVELS_SYSLOG.DEBUG] = 7;
module.exports.LEVELS_SYSLOG_ORDER = LEVELS_SYSLOG_ORDER;

function create(name, message, options) {
  var finalOptions = options || {};
  var defaultCode = finalOptions.code;
  var defaultLevel = finalOptions.level;
  var inherits = finalOptions.inherits || Error;

  var CustomError = function(options) {
    CustomError.super_.apply(this, arguments);
    var finalOptions = options || {};
    this.name = name;
    this.message = message;
    this.level = finalOptions.level || defaultLevel;
    this.code = finalOptions.code || defaultCode;
    this.meta = finalOptions.meta;
    Error.captureStackTrace(this, this.constructor);
  };
  util.inherits(CustomError, inherits);

  return CustomError;
}
module.exports.create = create;

function AggregateError() {};
util.inherits(AggregateError, Array);
module.exports.AggregateError = AggregateError;

function composeReducers() {
  var reducers = arguments;
  return function(error) {
    var length = reducers.length;
    for (var i = 0; i < length; i++) {
      var status = reducers[i](error);
      if (status !== undefined) {
        return status;
      }
    }
  }
}
module.exports.composeReducers = composeReducers;

function reduce(reducers, fn) {
  var composed = composeReducers.apply(this, reducers);
  return function() {
    return fn.apply(this, arguments).catch(function (error) {
      error.status = composed(error);
      throw error;
    });
  }
}
module.exports.reduce = reduce;

function withCode(error, code) {
  return error.code === code;
}
module.exports.withCode = withCode;

function everyWithCode(error, code) {
  return util.isArray(error) && error.every(function(error) { return error.code === code; });
}
module.exports.everyWithCode = everyWithCode;

function instanceOf(error, type) {
  return error instanceof type;
}
module.exports.instanceOf = instanceOf;

function everyInstanceOf(error, type) {
  return util.isArray(error) && error.every(function(error) { return error instanceof type; });
}
module.exports.everyInstanceOf = everyInstanceOf;