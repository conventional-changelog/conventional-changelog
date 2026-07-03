import { defineConfig } from '@trigen/oxlint'
import moduleConfig from '@trigen/oxlint-config/module'
import tsTypeCheckedConfig from '@trigen/oxlint-config/typescript-type-checked'
import rootConfig from '../oxlint.config.ts'

export default defineConfig({
  ignorePatterns: [
    '.astro/',
    'dist/',
    'src/content.config.ts',
    'src/env.d.ts'
  ],
  extends: [
    rootConfig,
    moduleConfig,
    tsTypeCheckedConfig
  ],
  env: {
    node: true
  }
})
