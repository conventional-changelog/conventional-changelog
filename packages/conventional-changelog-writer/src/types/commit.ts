import type { AnyObject } from './utils.js'

export interface CommitKnownProps {
  type?: string | null
  header?: string | null
  version?: string | null
  hash?: string | null
  committerDate?: string | null
  notes: CommitNote[]
  revert?: AnyObject | null
  body?: string | null
  footer?: string | null
}

export type TransformedCommit<Commit> = Commit & {
  raw?: Commit
}

export interface CommitNote {
  title: string
  text: string
}

export interface CommitGroup<Commit extends CommitKnownProps = CommitKnownProps> {
  title: string
  commits: Commit[]
}

export interface NoteGroup {
  title: string
  notes: CommitNote[]
}
