import { defineConfig } from '@trigen/oxlint'
import rootConfig from '../../oxlint.config.ts'

export default defineConfig({
  extends: [
    rootConfig
  ],
  rules: {
    'import/unambiguous': 'off'
  }
})
