import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import changeCase from 'change-case';
import pkg from './package.json';

export default [
  {
    input: 'src/event-emitter.js',
    output: {
      file: pkg.module,
      format: 'es'
    },
    plugins: [
      resolve()
    ]
  },
  {
    input: 'src/event-emitter.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: changeCase.pascalCase(pkg.name)
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: [
          ['@babel/preset-env', {
            'modules': false,
            'useBuiltIns': 'usage',
            'targets': {
              'node': '4'
            }
          }]
        ],
      })
    ]
  }
];