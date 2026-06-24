import { defineConfig } from '@trigen/oxlint'
import testConfig from '@trigen/oxlint-config/test'
import rootConfig from '../../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig,
    testConfig
  ],
  rules: {
    'eslint/no-magic-numbers': 'off'
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/no-default-export': 'off'
      }
    }
  ]
})
