import type { CommitKnownProps } from './commit.js'

export type * from './commit.js'
export type * from './context.js'
export type * from './options.js'
export type * from './utils.js'

export interface Details<Commit extends CommitKnownProps = CommitKnownProps> {
  log: string
  keyCommit: Commit | null
}
