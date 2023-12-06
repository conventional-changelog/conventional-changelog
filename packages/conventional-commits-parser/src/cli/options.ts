import type { ParserOptions } from '../types.js'

function trim(str: string) {
  return str.trim()
}

export function parseOptions(options: Record<string, unknown>): ParserOptions {
  if (typeof options.headerPattern === 'string') {
    options.headerPattern = new RegExp(options.headerPattern)
  }

  if (typeof options.headerCorrespondence === 'string') {
    options.headerCorrespondence = options.headerCorrespondence.split(',').map(trim)
  }

  if (typeof options.referenceActions === 'string') {
    options.referenceActions = options.referenceActions.split(',').map(trim)
  }

  if (typeof options.issuePrefixes === 'string') {
    options.issuePrefixes = options.issuePrefixes.split(',').map(trim)
  }

  if (typeof options.noteKeywords === 'string') {
    options.noteKeywords = options.noteKeywords.split(',').map(trim)
  }

  if (typeof options.fieldPattern === 'string') {
    options.fieldPattern = new RegExp(options.fieldPattern)
  }

  if (typeof options.revertPattern === 'string') {
    options.revertPattern = new RegExp(options.revertPattern)
  }

  if (typeof options.revertCorrespondence === 'string') {
    options.revertCorrespondence = options.revertCorrespondence.split(',').map(trim)
  }

  if (typeof options.mergePattern === 'string') {
    options.mergePattern = new RegExp(options.mergePattern)
  }

  if (options.verbose) {
    options.warn = console.warn.bind(console)
  } else {
    options.warn = true
  }

  return options
}
