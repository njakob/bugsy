/* eslint-disable */

"use strict";

module.exports = function(api) {
  api.cache.never();
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          corejs: '3.0.0',
          modules: 'commonjs',
          targets: {
            node: '8',
          },
        },
      ],
      '@babel/typescript',
    ].filter(Boolean),
  };
};

