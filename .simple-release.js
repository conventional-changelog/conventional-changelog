export const project = [
  '@simple-release/pnpm#PnpmWorkspacesProject',
  {
    mode: 'independent',
    tagPrefix(scope) {
      return `${scope}-v`
    }
  }
]

export const releaser = {
  verbose: true
}

export const bump = {
  extraScopes: ['deps']
}

export const publish = {
  access: 'public'
}
