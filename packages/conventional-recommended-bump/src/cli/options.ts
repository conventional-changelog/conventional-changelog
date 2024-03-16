import type { ParserStreamOptions } from 'conventional-commits-parser'
import type { GetCommitsParams, GetSemverTagsParams, Params } from '@conventional-changelog/git-client'
import { packagePrefix } from '@conventional-changelog/git-client'

function trim(str: string) {
  return str.trim()
}

export function parseTagsOptions(options: Record<string, unknown>): GetSemverTagsParams & Params | null {
  const result: GetSemverTagsParams & Params = {}

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

export function parseCommitsOptions(options: Record<string, unknown>): GetCommitsParams & Params | null {
  const result: GetCommitsParams & Params = {}

  if (typeof options.commitPath === 'string') {
    result.path = options.commitPath
  }

  if (!Object.keys(result).length) {
    return null
  }

  return result
}

export function parseParserOptions(options: Record<string, unknown>): ParserStreamOptions | null {
  const result: ParserStreamOptions = {}

  if (typeof options.headerPattern === 'string') {
    result.headerPattern = new RegExp(options.headerPattern)
  }

  if (typeof options.headerCorrespondence === 'string') {
    result.headerCorrespondence = options.headerCorrespondence.split(',').map(trim)
  }

  if (typeof options.referenceActions === 'string') {
    result.referenceActions = options.referenceActions.split(',').map(trim)
  }

  if (typeof options.issuePrefixes === 'string') {
    result.issuePrefixes = options.issuePrefixes.split(',').map(trim)
  }

  if (typeof options.noteKeywords === 'string') {
    result.noteKeywords = options.noteKeywords.split(',').map(trim)
  }

  if (typeof options.fieldPattern === 'string') {
    result.fieldPattern = new RegExp(options.fieldPattern)
  }

  if (typeof options.revertPattern === 'string') {
    result.revertPattern = new RegExp(options.revertPattern)
  }

  if (typeof options.revertCorrespondence === 'string') {
    result.revertCorrespondence = options.revertCorrespondence.split(',').map(trim)
  }

  if (typeof options.mergePattern === 'string') {
    result.mergePattern = new RegExp(options.mergePattern)
  }

  if (options.verbose) {
    result.warn = console.warn.bind(console)
  } else {
    result.warn = true
  }

  if (!Object.keys(result).length) {
    return null
  }

  return options
}
