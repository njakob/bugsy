
# bugsy [![NPM version][badge:npm-status]][npm] [![Build Status][badge:build-status]][travis] [![ESLint Config][badge:eslint-config]][github:njakob/eslint-config] [![Conventional Commits][badge:conventional-commits]][conventional-commits]

Helper to deal with errors lifecycle in javascript.

Dealing with errors is a common problem in every small or large project. While a lot of libraries simply focus on their creation, this library is meant to deal with their lifecycle.

## Features

* Universal module
* Error severity
* Custom metadata
* Flowtype definitions
* Source maps

## Installation

With NPM:

```
$ npm install bugsy
```

## Usage

```javascript
import * as bugsy from 'bugsy';

const RAN_AWAY = 'ran_away';
const THROW_MISSED = 'throw_missed';

const ranAway = bugsy.createDynamicError(RAN_AWAY, ({ name }) => `${name} ran away, again`);
const throwMissed = bugsy.createError(THROW_MISSED, 'Throw totally missed');

function capture(name) {
  const r = Math.random();

  if (r < 0.3) {
    throw throwMissed();
  } else if (r < 0.6) {
    throw ranAway({ name });
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
    capture('Abra');
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

## Changelog

See [changelog][CHANGELOG].

## Licences

`njakob/bugsy` is licensed under the [MIT License][licence].

[changelog]: CHANGELOG.md
[licence]: LICENSE
[npm]: https://nodei.co/npm/bugsy/
[travis]: https://travis-ci.org/njakob/bugsy
[conventional-commits]: https://conventionalcommits.org
[github:njakob/eslint-config]: https://github.com/njakob/eslint-config
[badge:npm-status]: https://img.shields.io/npm/v/bugsy.svg
[badge:build-status]: https://travis-ci.org/njakob/bugsy.svg?branch=master
[badge:eslint-config]: https://img.shields.io/badge/eslint_config-njakob-463fd4.svg
[badge:conventional-commits]: https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg
