import rootConfig from '../../eslint.config.js'

export default [
  ...rootConfig,
  {
    rules: {
      'import/unambiguous': 'off'
    }
  }
]
