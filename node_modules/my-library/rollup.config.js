import ts from 'rollup-plugin-ts';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/cjs/my-library.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm/my-library.js',
      format: 'es',
    },
  ],
  plugins: [
    ts({
      tsconfig: {
        declaration: true,
      }
    }),
    commonjs(),
    nodeResolve(),
  ],
};
