import type {
  GetCommitsParams,
  GetSemverTagsParams
} from '@conventional-changelog/git-client'
import { packagePrefix } from '@conventional-changelog/git-client'
import type { Options } from '../types.js'

export function parseOptions(options: Record<string, unknown>): Options | null {
  const result: Options = {}

  if (typeof options.append === 'boolean') {
    result.append = options.append
  }

  if (options.firstRelease === true) {
    result.releaseCount = 0
  } else
    if (typeof options.releaseCount === 'number') {
      result.releaseCount = options.releaseCount
    }

  if (typeof options.outputUnreleased === 'boolean') {
    result.outputUnreleased = options.outputUnreleased
  }

  if (!Object.keys(result).length) {
    return null
  }

  return result
}

export function parseTagsOptions(options: Record<string, unknown>): GetSemverTagsParams | null {
  const result: GetSemverTagsParams = {}

  if (typeof options.tagPrefix === 'string') {
    result.prefix = options.tagPrefix
  }

  if (typeof options.lernaPackage === 'string') {
    result.prefix = packagePrefix(options.lernaPackage)
  }

  if (options.skipUnstable) {
    result.skipUnstable = true
  }

  if (!Object.keys(result).length) {
    return null
  }

  return result
}

export function parseCommitsOptions(options: Record<string, unknown>): GetCommitsParams | null {
  const result: GetCommitsParams = {}

  if (typeof options.commitPath === 'string') {
    result.path = options.commitPath
  }

  if (!Object.keys(result).length) {
    return null
  }

  return result
}
