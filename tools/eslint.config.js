import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import rootConfig from '../eslint.config.js'

export default [
  ...rootConfig,
  ...tsTypeCheckedConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off'
    }
  }
]
