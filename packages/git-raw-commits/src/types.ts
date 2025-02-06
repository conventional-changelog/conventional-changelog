import type { GitLogParams } from '@conventional-changelog/git-client'

export interface GitRawCommitsOptions {
  cwd?: string
  debug?: ((log: string) => void) | false
  ignore?: string | RegExp
  path?: string | string[]
  from?: string
  to?: string
  format?: string
}

export interface GitClientOptions extends GitLogParams {
  cwd?: string
  debug?: ((log: string[]) => void) | false
}
