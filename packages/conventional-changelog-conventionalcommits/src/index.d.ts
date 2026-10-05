export interface CommitType {
  type: string
  section?: string
  effect?: 'bump' | 'changelog' | 'hidden'
  scope?: string
}

export type PresetRecord = Partial<Record<string, any>>
export type Context = PresetRecord
export type Commit = PresetRecord
export type Reference = PresetRecord

export interface PresetConfig {
  ignoreCommits?: RegExp
  issuePrefixes?: string[]
  types?: readonly CommitType[]
  scope?: string | string[]
  scopeOnly?: boolean
  preMajor?: boolean
  formatIssueUrl?: (context: Context, reference: Reference) => string
  formatCommitUrl?: (context: Context, commit: Commit) => string
  formatCompareUrl?: (context: Context) => string
  formatUserUrl?: (context: Context, user: string) => string
  formatNoteTitle?: (context: Context, title: string) => string
  formatNoteIcon?: (context: Context, title: string) => string
}

export const DEFAULT_COMMIT_TYPES: readonly Readonly<CommitType>[]

export function formatNoteTitle(context: Context, title: string): string
export function formatNoteIcon(context: Context, title: string): string
export function formatIssueUrl(context: Context, reference: Reference): string
export function formatCommitUrl(context: Context, commit: Commit): string
export function formatCompareUrl(context: Context): string
export function formatUserUrl(context: Context, user: string): string

export default function createPreset(config?: PresetConfig): {}
