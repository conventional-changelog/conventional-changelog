import type {
  ParserStreamOptions,
  Commit
} from 'conventional-commits-parser'
import type {
  GetSemverTagsParams,
  GetCommitsParams,
  Params
} from '@conventional-changelog/git-client'

export interface BumperRecommendation {
  level?: 0 | 1 | 2
  reason?: string
  releaseType?: string
}

export interface Preset {
  whatBump(commits: Commit[]): Promise<BumperRecommendation | null | undefined>
  tags?: GetSemverTagsParams & Params
  commits?: GetCommitsParams & Params
  parser?: ParserStreamOptions
}
