import scopes from '@commitlint/config-pnpm-scopes'

export default {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-pnpm-scopes'
  ],
  rules: {
    'body-max-line-length': [0],
    'header-max-length': [0],
    'scope-enum': async (ctx) => {
      const scopeEnum = await scopes.rules['scope-enum'](ctx)

      return [
        scopeEnum[0],
        scopeEnum[1],
        [
          ...scopeEnum[2],
          'deps',
          'dev-deps',
          'release'
        ]
      ]
    }
  },
  prompt: {
    settings: {
      enableMultipleScopes: true
    }
  }
}
