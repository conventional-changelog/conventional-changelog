import type { CommitKnownProps } from '@conventional-changelog/template'

export type * from './options.js'
export type * from './utils.js'

export interface Details<Commit extends CommitKnownProps = CommitKnownProps> {
  log: string
  keyCommit: Commit | null
}
