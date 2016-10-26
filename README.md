
# bugsy

[![NPM version][npm-status-image]][npm]

Collection of helpers to deal with errors.

Dealing with errors is a common problem in every kind of
project. While a lot of libraries simply focus on their
creation, this library is meant to deal whole way through
their lifecycle.

## Features

* Isomorphic module
* Error severity support
* Flowtype support

## Installation

[![NPM][npm-install-image]][npm]

```
$ npm install bugsy
```

## Usage

```javascript
import * as bugsy from 'bugsy';

const CODE_RAN_AWAY = 'ran_away';
const CODE_THROW_MISSED = 'throw_missed';

const RanAwayError = bugsy.newError(CODE_RAN_AWAY, 'It ran away, again');
const ThrowMissedError = bugsy.newError(CODE_THROW_MISSED, 'Throw totally missed');

function capture() {
  if (Math.random() > 0.9) {
    throw new ThrowMissedError({ severity: bugsy.SYSLOG_WARNING });
  } else {
    throw new RanAwayError();
  }
}

function handler(fn) {
  try {
    fn();
  } catch (err) {
    console.log(bugsy.toString(err));
  }
}

handler(() => {
  try {
    capture();
  } catch (err) {
    switch (true) {
      case err.code === CODE_THROW_MISSED:
        break;
      case err instanceof RanAwayError:
        throw (err.setSeverity(bugsy.SYSLOG_EMERGENCY));
      default:
        throw err;
    }
  }
});
```

## Licences

Bugsy is licensed under the [MIT License][licence].

[licence]: LICENSE
[npm]: https://nodei.co/npm/bugsy/
[npm-install-image]: https://nodei.co/npm/bugsy.png?downloads=true
[npm-status-image]: https://img.shields.io/npm/v/bugsy.svg