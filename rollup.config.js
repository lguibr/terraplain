import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'es',
  },
  plugins: [
    resolve(),
    alias({
      entries: [
        { find: '#example', replacement: './example' },
        { find: '#src', replacement: './src' }
      ]
    })
  ]
};