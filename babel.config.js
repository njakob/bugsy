"use strict";

const defineTags = (...tags) => tags.join(';');

const getTarget = (caller) => {
  if (!caller) {
    return defineTags('node');
  }
  switch (caller.name) {
    case '@babel/register': {
      return defineTags('node');
    }
    case 'rollup-plugin-babel': {
      switch (caller.target) {
        case 'node':
        case 'browser':
          return defineTags('rollup', caller.target);
        default:
          throw new Error(`Unknown Rollup target ${caller.target}`);
      }
    }
    case 'babel-jest': {
      return defineTags('node', 'jest');
    }
    default:
      throw new Error(`Unexpected caller ${caller.name}`);
  }
}

module.exports = (api) => {
  const tags = api.caller(getTarget).split(';');

  api.cache.never();

  const isOneOf = (...values) => values.some(value => tags.includes(value));

  const getBrowserListTargets = () => {
    if (isOneOf('node')) {
      return {
        node: '8',
      };
    }
    if (isOneOf('browser')) {
      return {
        browsers: ['ie >= 11'],
      };
    }
    throw new Error(`Missing target tag`);
  };

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: getBrowserListTargets(),
          exclude: ['transform-async-to-generator', 'transform-regenerator'],
          modules: isOneOf('rollup') ? false : 'commonjs',
        },
      ],
      '@babel/typescript',
    ].filter(Boolean),
    plugins: [
      ['babel-plugin-module-resolver', {
        root: ['./src'],
        extensions: ['.js', '.ts'],
        stripExtensions: ['.js'],
        alias: {
          'bugsy': './src/index.ts',
        },
      }],
    ],
  };
};
