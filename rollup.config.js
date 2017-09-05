import babelPlugin from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs'
  },
  plugins: [
    babelPlugin({
      exclude: 'node_modules/**', // only transpile our source code
      plugins: ['external-helpers']
    })
  ]
};
