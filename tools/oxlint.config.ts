import { defineConfig } from '@trigen/oxlint'
import tsTypeCheckedConfig from '@trigen/oxlint-config/typescript-type-checked'
import rootConfig from '../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig,
    tsTypeCheckedConfig
  ],
  rules: {
    'eslint/no-magic-numbers': 'off'
  }
})
