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

module.exports.create = function create(name, message, options) {
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
};

function instanceOfPredicateFactory(value) {
  return function (err) {
    return err instanceof value;
  };
}

function codePredicateFactory(value) {
  return function (err) {
    return err.code === value;
  };
}

function alwaysPredicateFactory() {
  return function (err) {
    return true;
  };
}

function Branch(predicate) {
  this.predicate = predicate;
  this.transformations = [];
  this.reductions = [];
  this.dropped = false;
}

Branch.prototype.drop = function() {
  this.dropped = true;
  return this;
};

Branch.prototype.transform = function(fn) {
  this.transformations.push(fn);
  return this;
};

Branch.prototype.reduce = function(fn) {
  this.reductions.push(fn);
  return this;
};

function wrap(predicateFactory) {
  return function() {
    var predicate = predicateFactory.apply(this, arguments);
    return new Branch(predicate);
  };
}

module.exports.instanceOf = wrap(instanceOfPredicateFactory);
module.exports.code = wrap(codePredicateFactory);
module.exports.always = wrap(alwaysPredicateFactory);

module.exports.transform = function transform(fn, branches) {
  var err;
  try {
    fn();
  } catch (e) {
    err = e;
  }
  if (err) {
    for (var i = 0; i < branches.length; i++) {
      var branch = branches[i];
      if (branch.predicate(err)) {
        if (branch.dropped) {
          return;
        }
        for (var j = 0; j < branch.transformations.length; j++) {
          var transformation = branch.transformations[j];
          transformation(err);
        }
      }
    }
    throw err;
  }
};

module.exports.reduce = function reduce(err, branches, value) {
  for (var i = 0; i < branches.length; i++) {
    var branch = branches[i];
    if (branch.predicate(err)) {
      for (var j = 0; j < branch.reductions.length; j++) {
        var reduction = branch.reductions[j];
        value = reduction(value, err);
      }
    }
  }
  return value;
};