import type {
  ParserStreamOptions,
  Commit
} from 'conventional-commits-parser'
import type {
  GetSemverTagsParams,
  GetCommitsParams
} from '@conventional-changelog/git-client'

export interface WhatBump {
  level: 0 | 1 | 2
  reason: string
}

export type WhatBumpResult = WhatBump | null | undefined

export interface BumperRecommendation extends WhatBump {
  releaseType: string
  commits: Commit[]
}

export interface EmptyBumperRecommendation {
  commits: Commit[]
}

export type BumperRecommendationResult = BumperRecommendation | EmptyBumperRecommendation

export interface Preset {
  whatBump(commits: Commit[]): Promise<WhatBumpResult> | WhatBumpResult
  tags?: GetSemverTagsParams
  commits?: GetCommitsParams
  parser?: ParserStreamOptions
}

export type Logger = (source: string, messages: string | string[]) => void

export interface Options {
  warn?: Logger
  debug?: Logger
}

export interface Params extends Omit<Preset, 'whatBump'> {
  options?: Options
}
