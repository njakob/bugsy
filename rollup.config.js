import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = [
  '.js', '.ts',
];

export default [
  {
    input: './src/index.ts',
    output: [
      { file: 'build/bugsy.cjs.js', format: 'cjs' },
      { file: 'build/bugsy.esm.js', format: 'es' },
    ],
    plugins: [
      resolve({ extensions }),
      babel({
        extensions,
        caller: {
          target: 'node',
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      { file: 'build/bugsy.browser.cjs.js', format: 'cjs' },
      { file: 'build/bugsy.browser.esm.js', format: 'es' },
    ],
    plugins: [
      resolve({ extensions }),
      babel({
        extensions,
        caller: {
          target: 'browser',
        },
      }),
    ],
  },
];
