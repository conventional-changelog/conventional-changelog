export interface CommitKnownProps {
  type?: string | null
  header?: string | null
  version?: string | null
  hash?: string | null
  committerDate?: string | null
  notes: CommitNote[]
}

export type TransformedCommit<Commit extends CommitKnownProps = CommitKnownProps> = Commit & {
  raw: Commit
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
