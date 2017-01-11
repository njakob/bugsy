
# bugsy [![NPM version][npm-status-image]][npm] [![Build Status][build-status-image]][travis] [![ESLint Config][eslint-config-image]][eslint-config]

Collection of helpers to deal with errors.

Dealing with errors is a common problem in every small or large
project. While a lot of libraries simply focus on their
creation, this library is meant to deal with their lifecycle.

## Features

* Universal module
* Error severity support
* Flowtype support

## Installation

[![NPM][npm-install-image]][npm]

With NPM:

```
$ npm install bugsy
```

With Yarn:

```
$ yarn add bugsy
```

## Usage

```js
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

`njakob/bugsy` is licensed under the [MIT License][licence].

[licence]: LICENSE
[eslint-config]: https://github.com/njakob/eslint-config
[npm]: https://nodei.co/npm/bugsy/
[travis]: https://travis-ci.org/njakob/bugsy
[npm-install-image]: https://nodei.co/npm/bugsy.png?downloads=true
[npm-status-image]: https://img.shields.io/npm/v/bugsy.svg
[build-status-image]: https://travis-ci.org/njakob/bugsy.svg?branch=master
[eslint-config-image]: https://img.shields.io/badge/eslint_config-njakob-463fd4.svg
