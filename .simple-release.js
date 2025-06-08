export const project = ['@simple-release/pnpm#PnpmWorkspacesProject', {
  mode: 'independent',
  tagPrefix(scope) {
    return `${scope}-v`
  }
}]

export const releaser = {
  verbose: true
}

export const publish = {
  access: 'public'
}
