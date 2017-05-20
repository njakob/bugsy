/* eslint-disable import/no-extraneous-dependencies */

const babelPresetES2015 = require('babel-preset-es2015');

module.exports = function buildPreset(context) {
  const modules = (() => {
    switch (process.env.MODULES) {
      case 'cjs':
        return 'commonjs';
      case undefined:
      default:
        return false;
    }
  })();

  return babelPresetES2015.buildPreset(context, { modules });
};
