import { swc } from 'rollup-plugin-swc3'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import shebang from 'rollup-plugin-add-shebang'
import nodeEsm from '@trigen/browserslist-config/node-esm'
import pkg from './package.json' assert { type: 'json' }

const extensions = ['.js', '.ts']
const external = _ => /node_modules/.test(_) && !/@swc\/helpers/.test(_)
const plugins = targets => [
  nodeResolve({
    extensions
  }),
  swc({
    tsconfig: false,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true
      },
      externalHelpers: true
    },
    env: {
      targets
    },
    module: {
      type: 'es6'
    },
    sourceMaps: true
  })
]

export default [
  {
    input: pkg.exports,
    plugins: plugins(nodeEsm.join(', ')),
    external,
    output: {
      file: pkg.publishConfig.exports['.'],
      format: 'es',
      sourcemap: true
    }
  },
  {
    input: pkg.bin['conventional-commits-parser'],
    plugins: [
      ...plugins(nodeEsm.join(', ')),
      shebang({
        include: '**/*'
      })
    ],
    external: _ => _.endsWith('src/index.ts') || external(_),
    output: {
      file: pkg.publishConfig.bin['conventional-commits-parser'],
      format: 'es',
      sourcemap: true
    }
  }
]
