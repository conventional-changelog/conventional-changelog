import type {
  CommitKnownProps,
  FinalTemplateContext
} from './types/index.js'
import { link } from './elements.js'

/**
 * Markdown segments to keep as is: replacing references inside them
 * would break already formatted links, code samples and urls.
 */
const protectedSegments = [
  /\[(?:[^[\]]|\[[^[\]]*])*]\((?:[^()\n]|\([^()\n]*\))*\)/, // [text](url)
  /\[[^\]]*]\[[^\]]*]/, // [text][ref]
  // the lookahead makes the delimiter length atomic, without it a long run
  // of backticks makes the regex engine retry every possible delimiter length
  /^[ \t]*(?=(?<fence>`{3,}|~{3,}))\k<fence>[\s\S]*?^[ \t]*\k<fence>[ \t]*\r?$/, // ```code block```
  /(?=(?<code>`+))\k<code>[^\n]*?\k<code>/, // `code span`
  /https?:\/\/(?:[^\s()]|\([^\s()]*\))+/ // https://url
]
const userMention = /\B@(?<user>[a-z0-9](?:-?[a-z0-9/]){0,38})/
const defaultIssuePattern = /[a-z0-9]+/

export interface IssueReference {
  /**
   * Issue prefix. EG: In `gh-123` `gh-` is the prefix.
   */
  prefix: string
  /**
   * Issue id. EG: In `gh-123` `123` is the id.
   */
  issue: string
}

export interface ReferencesFormatterOptions<Commit extends CommitKnownProps = CommitKnownProps> {
  /**
   * The prefixes of an issue. EG: In `gh-123` `gh-` is the prefix.
   * Prefixes are matched in the given order, so a prefix which starts
   * with another one should be placed first.
   */
  issuePrefixes?: (string | RegExp)[]
  /**
   * Pattern of an issue id. EG: In `gh-123` `123` is the id.
   */
  issuePattern?: RegExp
  /**
   * Builds an issue URL. Empty result leaves the reference as is.
   */
  formatIssueUrl(context: FinalTemplateContext<Commit>, reference: IssueReference): string
  /**
   * Builds a user URL. Empty result leaves the mention as is.
   */
  formatUserUrl(context: FinalTemplateContext<Commit>, user: string): string
}

export type ReferencesFormatter<Commit extends CommitKnownProps = CommitKnownProps> = (
  text: string,
  context: FinalTemplateContext<Commit>,
  references?: string[]
) => string

/**
 * Escapes a string to use it as a part of a regex.
 * @param string
 * @returns Escaped string.
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Builds a regex which matches issue and user references
 * outside of the protected Markdown segments.
 * @param issuePrefixes
 * @param issuePattern
 * @returns Regex with `prefix`, `issue` and `user` groups.
 */
function referencesRegex(
  issuePrefixes: (string | RegExp)[] = [],
  issuePattern: RegExp = defaultIssuePattern
) {
  const prefixes = issuePrefixes
    .map(prefix => (typeof prefix === 'string' ? escapeRegExp(prefix) : prefix.source))
    .join('|')
  const patterns = [
    ...protectedSegments.map(segment => segment.source),
    // without prefixes every word would be matched as an issue reference
    prefixes && `(?<prefix>${prefixes})(?<issue>${issuePattern.source})`,
    userMention.source
  ]

  return new RegExp(patterns.filter(Boolean).join('|'), 'gm')
}

/**
 * Creates a text formatter for the given options.
 *
 * Regexes from the options are inlined into a single multiline regex,
 * so their flags are ignored, `^` and `$` match line boundaries,
 * and they should not contain capturing groups, backreferences or named groups.
 * @param options - Formatter options.
 * @returns Formatter which replaces issue and user references in a text with links.
 */
export function createReferencesFormatter<Commit extends CommitKnownProps = CommitKnownProps>(
  options: ReferencesFormatterOptions<Commit>
): ReferencesFormatter<Commit> {
  const regex = referencesRegex(options.issuePrefixes, options.issuePattern)

  return (text, context, references) => text.replace(regex, (match, ...args) => {
    const {
      prefix,
      issue,
      user
    } = args.at(-1) as Partial<IssueReference & { user: string }>

    if (issue) {
      const issueUrl = options.formatIssueUrl(context, {
        prefix: prefix as string,
        issue
      })

      if (!issueUrl) {
        return match
      }

      references?.push(match)

      return link(match, issueUrl)
    }

    if (user) {
      // TODO: investigate why this code exists.
      if (user.includes('/')) {
        return match
      }

      const userUrl = options.formatUserUrl(context, user)

      if (!userUrl) {
        return match
      }

      return link(match, userUrl)
    }

    return match
  })
}
