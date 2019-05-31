# bugsy

This library is meant to help to deal with errors lifecycle in JavaScript.

Error handling is a very common problem in every product. However, the language does not provide enough utils to deal with error management.

The work done in this library is inspired by personal experience while implementing more complex JavaScript projects and some other libraries such as [verror](https://github.com/joyent/node-verror).

[![build status](https://img.shields.io/travis/njakob/bugsy/master.svg?style=flat-square)](https://travis-ci.org/njakob/bugsy)
[![npm version](https://img.shields.io/npm/v/bugsy.svg?style=flat-square)](https://www.npmjs.com/package/bugsy)


## Key Aspects

* __Universal module__: This library can be used both in Node.js and in browsers.
* __Type first__: Besides having a lot of runtime checks, the library is build to be used with type-safe extensions such as Typescript. The NPM package contains directly the Typescript definitions based on the sources.
* __Cause chain__: While handling errors, even they might be expected, it is not always possible to recover into a proper state. In such cases, errors should be rethrown and the caller can try to handle the situation. In such cases, it might be useful to gather some metadata and keep track of previous errors.
* __Severity__: When errors should be logged into third-party systems, not all errors have the same [severity](https://en.wikipedia.org/wiki/Syslog#Severity_level). This allows being informed only when the system is about to crash rather than on every simple network error that might occur.

## Installation

```sh
$ npm install bugsy
```

## Usage

<!-- eslint-disable no-console -->
<!-- eslint-disable no-constant-condition -->

```js
import * as bugsy from 'bugsy';

const RAN_AWAY = 'RanAwayError';
const THROW_MISSED = 'ThrowMissedError';
const CAPTURE = 'CaptureError';

function capture(name) {
  const r = Math.random();
  if (r < 0.3) {
    throw new bugsy.Bugsy({
      name: THROW_MISSED,
      message: 'Throw totally missed',
    });
  }
  if (r < 0.6) {
    throw new bugsy.Bugsy({
      name: RAN_AWAY,
      message: `${name} ran away, again`,
      metadata: {
        direction: 'north',
      },
    });
  }
  throw new Error();
}

function handler(func) {
  try {
    func();
  } catch (error) {
    console.error(bugsy.getFullStack(error));
  }
}

handler(() => {
  while (true) {
    try {
      capture('Abra');
    } catch (error) {
      switch (true) {
        // Expected error
        case error.name === THROW_MISSED: {
          console.log('I can try again...');
          break;
        }
        // Expected error
        case error.name === RAN_AWAY: {
          const { direction } = bugsy.getMetadata(error);
          console.log(`Oh well... I should head ${direction}`);
          return;
        }
        // Unexpected error
        default:
          throw new bugsy.Bugsy({
            name: CAPTURE,
            message: 'Capture failed',
            cause: error,
            severity: 1,
          });
      }
    }
  }
});
```

## License

[MIT](license)
