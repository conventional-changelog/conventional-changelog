import { PnpmWorkspacesProject } from '@simple-release/pnpm'

export const project = new PnpmWorkspacesProject({
  mode: 'independent',
  tagPrefix(scope) {
    return `${scope}-v`
  }
})

export const releaser = {
  verbose: true
}

export const publish = {
  access: 'public'
}
