import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  external: ['harlan', 'jquery', 'numeral'],
  output: {
    file: 'index.js',
    name: 'HarlanIChequesStatusPage',
    format: 'iife',
    globals: {
      numeral: 'numeral',
      harlan: 'harlan',
      jquery: '$',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    buble(),
  ],
};
