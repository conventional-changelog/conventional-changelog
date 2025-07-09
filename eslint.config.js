import { globalIgnores } from 'eslint/config'
import baseConfig from '@trigen/eslint-config'
import moduleConfig from '@trigen/eslint-config/module'
import testConfig from '@trigen/eslint-config/test'
import env from '@trigen/eslint-config/env'

export default [
  globalIgnores([
    '**/dist/',
    '**/package/',
    '**/test/fixtures/'
  ]),
  ...baseConfig,
  ...moduleConfig,
  ...testConfig,
  env.node,
  {
    files: ['**/index.js', '**/better-than-before.d.ts'],
    rules: {
      'import/no-default-export': 'off'
    }
  }
]
