import type {
  ParserOptions,
  ParserRegexes,
  CommitReference,
  CommitNote,
  CommitMeta,
  Commit
} from './types.js'
import { getParserRegexes } from './regex.js'
import {
  trimNewLines,
  appendLine,
  getCommentFilter,
  gpgFilter,
  truncateToScissor
} from './utils.js'
import { defaultOptions } from './options.js'

/**
 * Helper to create commit object.
 * @param initialData - Initial commit data.
 * @returns Commit object with empty data.
 */
export function createCommitObject(initialData: Partial<Commit> = {}): Commit {
  // @ts-expect-error: You can read properties from `Commit` without problems, but you can't assign object to this type. So here is helper for that.
  return {
    merge: null,
    revert: null,
    header: null,
    body: null,
    footer: null,
    notes: [],
    mentions: [],
    references: [],
    ...initialData
  }
}

/**
 * Commit message parser.
 */
export class CommitParser {
  private readonly options: ParserOptions
  private readonly regexes: ParserRegexes
  private lines: string[] = []
  private lineIndex = 0
  private commit = createCommitObject()

  constructor(options: ParserOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }
    this.regexes = getParserRegexes(this.options)
  }

  private currentLine() {
    return this.lines[this.lineIndex]
  }

  private nextLine() {
    return this.lines[this.lineIndex++]
  }

  private isLineAvailable() {
    return this.lineIndex < this.lines.length
  }

  private parseReference(
    input: string,
    action: string | null
  ) {
    const { regexes } = this
    const matches = regexes.referenceParts.exec(input)

    if (!matches) {
      return null
    }

    let [
      raw,
      repository = null,
      prefix,
      issue
    ] = matches
    let owner: string | null = null

    if (repository) {
      const slashIndex = repository.indexOf('/')

      if (slashIndex !== -1) {
        owner = repository.slice(0, slashIndex)
        repository = repository.slice(slashIndex + 1)
      }
    }

    return {
      raw,
      action,
      owner,
      repository,
      prefix,
      issue
    }
  }

  private parseReferences(
    input: string
  ) {
    const { regexes } = this
    const regex = input.match(regexes.references)
      ? regexes.references
      : /()(.+)/gi
    const references: CommitReference[] = []
    let matches: RegExpExecArray | null
    let action: string | null
    let sentence: string
    let reference: CommitReference | null

    while (true) {
      matches = regex.exec(input)

      if (!matches) {
        break
      }

      action = matches[1] || null
      sentence = matches[2] || ''

      while (true) {
        reference = this.parseReference(sentence, action)

        if (!reference) {
          break
        }

        references.push(reference)
      }
    }

    return references
  }

  private skipEmptyLines() {
    let line = this.currentLine()

    while (line !== undefined && !line.trim()) {
      this.nextLine()
      line = this.currentLine()
    }
  }

  private parseMerge() {
    const { commit, options } = this
    const correspondence = options.mergeCorrespondence || []
    const merge = this.currentLine()
    const matches = merge && options.mergePattern
      ? merge.match(options.mergePattern)
      : null

    if (matches) {
      this.nextLine()

      commit.merge = matches[0] || null

      correspondence.forEach((key, index) => {
        commit[key] = matches[index + 1] || null
      })

      return true
    }

    return false
  }

  private parseHeader(isMergeCommit: boolean) {
    if (isMergeCommit) {
      this.skipEmptyLines()
    }

    const { commit, options } = this
    const correspondence = options.headerCorrespondence || []
    const header = this.nextLine()
    let matches: RegExpMatchArray | null = null

    if (header) {
      if (options.breakingHeaderPattern) {
        matches = header.match(options.breakingHeaderPattern)
      }

      if (!matches && options.headerPattern) {
        matches = header.match(options.headerPattern)
      }
    }

    if (header) {
      commit.header = header
    }

    if (matches) {
      correspondence.forEach((key, index) => {
        commit[key] = matches![index + 1] || null
      })
    }
  }

  private parseMeta() {
    const {
      options,
      commit
    } = this

    if (!options.fieldPattern || !this.isLineAvailable()) {
      return false
    }

    let matches: RegExpMatchArray | null
    let field: string | null = null
    let parsed = false

    while (this.isLineAvailable()) {
      matches = this.currentLine().match(options.fieldPattern)

      if (matches) {
        field = matches[1] || null
        this.nextLine()
        continue
      }

      if (field) {
        parsed = true
        commit[field] = appendLine(commit[field], this.currentLine())
        this.nextLine()
      } else {
        break
      }
    }

    return parsed
  }

  private parseNotes() {
    const {
      regexes,
      commit
    } = this

    if (!this.isLineAvailable()) {
      return false
    }

    const matches = this.currentLine().match(regexes.notes)
    let references: CommitReference[] = []

    if (matches) {
      const note: CommitNote = {
        title: matches[1],
        text: matches[2]
      }

      commit.notes.push(note)
      commit.footer = appendLine(commit.footer, this.currentLine())
      this.nextLine()

      while (this.isLineAvailable()) {
        if (this.parseMeta()) {
          return true
        }

        if (this.parseNotes()) {
          return true
        }

        references = this.parseReferences(this.currentLine())

        if (references.length) {
          commit.references.push(...references)
        } else {
          note.text = appendLine(note.text, this.currentLine())
        }

        commit.footer = appendLine(commit.footer, this.currentLine())
        this.nextLine()

        if (references.length) {
          break
        }
      }

      return true
    }

    return false
  }

  private parseBodyAndFooter(isBody: boolean) {
    const { commit } = this

    if (!this.isLineAvailable()) {
      return isBody
    }

    const references = this.parseReferences(this.currentLine())
    const isStillBody = !references.length && isBody

    if (isStillBody) {
      commit.body = appendLine(commit.body, this.currentLine())
    } else {
      commit.references.push(...references)
      commit.footer = appendLine(commit.footer, this.currentLine())
    }

    this.nextLine()

    return isStillBody
  }

  private parseBreakingHeader() {
    const {
      commit,
      options
    } = this

    if (!options.breakingHeaderPattern || commit.notes.length || !commit.header) {
      return
    }

    const matches = commit.header.match(options.breakingHeaderPattern)

    if (matches) {
      commit.notes.push({
        title: 'BREAKING CHANGE',
        text: matches[3]
      })
    }
  }

  private parseMentions(input: string) {
    const {
      commit,
      regexes
    } = this
    let matches: RegExpExecArray | null

    for (;;) {
      matches = regexes.mentions.exec(input)

      if (!matches) {
        break
      }

      commit.mentions.push(matches[1])
    }
  }

  private parseRevert(input: string) {
    const {
      commit,
      options
    } = this
    const correspondence = options.revertCorrespondence || []
    const matches = options.revertPattern
      ? input.match(options.revertPattern)
      : null

    if (matches) {
      commit.revert = correspondence.reduce<CommitMeta>((meta, key, index) => {
        meta[key] = matches[index + 1] || null

        return meta
      }, {})
    }
  }

  private cleanupCommit() {
    const { commit } = this

    if (commit.body) {
      commit.body = trimNewLines(commit.body)
    }

    if (commit.footer) {
      commit.footer = trimNewLines(commit.footer)
    }

    commit.notes.forEach((note) => {
      note.text = trimNewLines(note.text)
    })
  }

  /**
   * Parse commit message string into an object.
   * @param input - Commit message string.
   * @returns Commit object.
   */
  parse(input: string) {
    if (!input.trim()) {
      throw new TypeError('Expected a raw commit')
    }

    const commentFilter = getCommentFilter(this.options.commentChar)
    const rawLines = trimNewLines(input).split(/\r?\n/)
    const lines = truncateToScissor(rawLines).filter(line => commentFilter(line) && gpgFilter(line))
    const commit = createCommitObject()

    this.lines = lines
    this.lineIndex = 0
    this.commit = commit

    const isMergeCommit = this.parseMerge()

    this.parseHeader(isMergeCommit)

    if (commit.header) {
      commit.references = this.parseReferences(commit.header)
    }

    let isBody = true

    while (this.isLineAvailable()) {
      this.parseMeta()

      if (this.parseNotes()) {
        isBody = false
      }

      if (!this.parseBodyAndFooter(isBody)) {
        isBody = false
      }
    }

    this.parseBreakingHeader()
    this.parseMentions(input)
    this.parseRevert(input)
    this.cleanupCommit()

    return commit
  }
}
