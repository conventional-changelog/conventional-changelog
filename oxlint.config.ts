import { defineConfig } from '@trigen/oxlint'
import baseConfig from '@trigen/oxlint-config'
import moduleConfig from '@trigen/oxlint-config/module'
import testConfig from '@trigen/oxlint-config/test'

export default defineConfig({
  ignorePatterns: [
    '**/dist/',
    '**/package/',
    '**/test/fixtures/'
  ],
  options: {
    typeAware: true,
    typeCheck: true
  },
  env: {
    node: true
  },
  extends: [
    baseConfig,
    moduleConfig,
    testConfig
  ],
  overrides: [
    {
      files: ['**/index.js', '**/better-than-before.d.ts'],
      rules: {
        'import/no-default-export': 'off'
      }
    },
    {
      files: ['**/cli/**/*', '**/cli.*'],
      rules: {
        'eslint/no-console': 'off'
      }
    }
  ]
})
