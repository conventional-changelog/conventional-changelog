export interface CommitType {
  type: string
  section?: string
  hidden?: boolean
  scope?: string
}

export type PresetRecord = Partial<Record<string, any>>
export type Context = PresetRecord
export type Commit = PresetRecord
export type Reference = PresetRecord

export interface PresetConfig {
  ignoreCommits?: RegExp
  issuePrefixes?: string[]
  types?: CommitType[]
  scope?: string | string[]
  scopeOnly?: boolean
  preMajor?: boolean
  bumpStrict?: boolean
  formatIssueUrl?: (context: Context, reference: Reference) => string
  formatCommitUrl?: (context: Context, commit: Commit) => string
  formatCompareUrl?: (context: Context) => string
  formatUserUrl?: (context: Context, user: string) => string
}

export default function createPreset(config?: PresetConfig): {}
