
# bugsy [![NPM version][npm-status-image]][npm] [![Build Status][build-status-image]][travis] [![ESLint Config][eslint-config-image]][eslint-config]

Collection of helpers to deal with errors.

Dealing with errors is a common problem in every small or large project. While a lot of libraries simply focus on their creation, this library is meant to deal with their lifecycle.

## Features

* Universal module
* Error severity
* Custom metadata
* Flowtype

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

const RAN_AWAY = 'ran_away';
const THROW_MISSED = 'throw_missed';

const ranAway = bugsy.createError(RAN_AWAY, 'It ran away, again');
const throwMissed = bugsy.createError(THROW_MISSED, 'Throw totally missed');

function capture() {
  const r = Math.random();

  if (r < 0.3) {
    throw throwMissed({ severity: bugsy.syslog.WARNING });
  } else if (r < 0.6) {
    throw ranAway();
  } else {
    throw new Error();
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
    switch (err.code) {
      case THROW_MISSED:
        console.log('Oh well...');
        break;
      case RAN_AWAY:
        throw err.setSeverity(bugsy.syslog.CRITICAL).addMeta({ firstTry: true });
      default:
        throw bugsy.convert(err).setSeverity(bugsy.syslog.EMERGENCY);
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
