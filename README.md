
# bugsy

Collection of helpers to deal with errors.

Dealing with errors is a common problem in every kind of
project. While a lot of libraries simply focus on their
creation, this library is meant to deal whole way through
their lifecycle.

## Features

* Inheritance management
* Error severity support
* Flowtype definition

## Installation

[![NPM](https://nodei.co/npm/bugsy.png?downloads=true)](https://nodei.co/npm/bugsy/)

```
$ npm install bugsy
```

## Usage

```javascript
import * as bugsy from 'bugsy';

const RanAwayError = bugsy.create(
  'RanAwayError',
  'It ran away, again',
  { code: 'ran_away' }
);
const MissedThrowError = bugsy.create(
  'MissedThrowError',
  'Throw totally missed',
  { code: 'missed_throw' }
);

function capture() {
  if (Math.random() > 0.9) {
    throw new MissedThrowError();
  } else {
    throw new RanAwayError({ meta: 'Caterpie' }); 
  }
}

try {
  capture();
} catch (error) {
  switch (true) {
    case bugsy.withCode(error, 'missed_throw'):
      break;
    case bugsy.instanceOf(error, RanAwayError):
      error.level = bugsy.LEVELS_SYSLOG.EMERGENCY;
      throw error;
  }
}
```

## Licences

[MIT](LICENSE)