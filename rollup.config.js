import * as fs from 'fs';
import { parseParcel } from '@njakob/parcel';
import { hulk } from '@njakob/hulk';
import rollupNodeResolve from 'rollup-plugin-node-resolve';
import rollupBabel from 'rollup-plugin-babel';
import rollupJSON from 'rollup-plugin-json';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const parcel = parseParcel(pkg);

const commitHash = (() => {
  try {
    return fs.readFileSync('.commithash', 'utf-8').trim();
  } catch (err) {
    return 'unknown';
  }
})();

const banner = hulk({
  commitHash,
  name: parcel.name.name,
  version: parcel.version,
  repository: parcel.homepage,
});

export default {
  entry: 'src/bugsy.js',
  sourceMap: true,
  banner,
  moduleName: 'bugsy',

  plugins: [
    rollupNodeResolve({
      jsnext: true
    }),
    rollupJSON(),
    rollupBabel({
      babelrc: true,
    }),
  ],

  targets: [
    { dest: 'lib/bugsy.js', format: 'cjs' },
    { dest: 'lib/bugsy.es.js', format: 'es' },
  ]
};
