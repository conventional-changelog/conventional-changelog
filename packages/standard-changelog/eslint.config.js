import tsTypeCheckedConfig from '@trigen/eslint-config/typescript-type-checked'
import testConfig from '@trigen/eslint-config/test'
import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  ...tsTypeCheckedConfig,
  ...testConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
]
