import type { AnyObject } from './utils.js'

export interface CommitReference {
  owner?: string | null
  repository?: string | null
  prefix?: string | null
  issue?: string | number | null
}

export interface CommitNote {
  title: string
  text: string
}

export interface CommitKnownProps {
  type?: string | null
  header?: string | null
  version?: string | null
  hash?: string | null
  committerDate?: string | null
  references?: CommitReference[] | null
  notes: CommitNote[]
  revert?: AnyObject | null
  body?: string | null
  footer?: string | null
}

export type TransformedCommit<Commit> = Commit & {
  raw?: Commit
}

export interface CommitGroup<Commit extends CommitKnownProps = CommitKnownProps> {
  title: string
  commits: Commit[]
}

export interface NoteGroup {
  title: string
  notes: CommitNote[]
}
