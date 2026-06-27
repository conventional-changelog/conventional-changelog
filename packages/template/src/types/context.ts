import type {
  CommitKnownProps,
  CommitGroup,
  NoteGroup,
  TransformedCommit
} from './commit.js'

export type HeaderPartialFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (context: FinalTemplateContext<Commit>) => string

export type PreamblePartialFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (context: FinalTemplateContext<Commit>) => string

export type CommitPartialFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (context: FinalTemplateContext<Commit>, commit: TransformedCommit<Commit>) => string

export type FooterPartialFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (context: FinalTemplateContext<Commit>) => string

export interface TemplateContext<Commit extends CommitKnownProps = CommitKnownProps> {
  /**
   * Version number of the upcoming release.
   * If `version` is found in the last commit before generating logs, it will be overwritten.
   */
  version?: string
  /**
   * Is this a patch release?
   */
  isPatch?: boolean
  /**
   * The title of the release.
   */
  title?: string
  /**
   * The release date.
   */
  date?: string
  /**
   * Introductory text rendered after the release header.
   */
  preamble?: string
  /**
   * Should all references be linked?
   */
  linkReferences?: boolean
  /**
   * Commit base url path.
   */
  commit?: string
  /**
   * Issue base url.
   */
  issue?: string
  /**
   * Repository name.
   * Eg: `'conventional-changelog-writer'`
   */
  repository?: string
  /**
   * Repository host.
   * Eg: `'https://github.com'` or `'https://bitbucket.org'`
   */
  host?: string
  /**
   * Repository owner.
   * Eg: `'conventional-changelog'`
   */
  owner?: string
  /**
   * Full repository url.
   * Eg: `'https://github.com/conventional-changelog/conventional-changelog-writer'`.
   * Should be used as a fallback when `context.repository` doesn't exist.
   */
  repoUrl?: string
  /**
   * Commit groups.
   */
  commitGroups?: CommitGroup<Commit>[]
  /**
   * Note groups.
   */
  noteGroups?: NoteGroup[]
  /**
   * Previous release tag.
   */
  previousTag?: string | null
  /**
   * Current release tag.
   */
  currentTag?: string | null
  /**
   * Add a link to compare changes.
   */
  linkCompare?: boolean
  /**
   * Function that renders the release header.
   */
  headerPartial?: HeaderPartialFunction<Commit>
  /**
   * Function that renders introductory text after the release header.
   */
  preamblePartial?: PreamblePartialFunction<Commit>
  /**
   * Function that renders a single commit entry.
   */
  commitPartial?: CommitPartialFunction<Commit>
  /**
   * Function that renders release footer notes.
   */
  footerPartial?: FooterPartialFunction<Commit>
}

type RequiredTemplateContext<Commit extends CommitKnownProps = CommitKnownProps> = Required<TemplateContext<Commit>>

export interface FinalTemplateContext<Commit extends CommitKnownProps = CommitKnownProps> extends TemplateContext<Commit> {
  commit: RequiredTemplateContext<Commit>['commit']
  issue: RequiredTemplateContext<Commit>['issue']
  date: RequiredTemplateContext<Commit>['date']
  headerPartial: RequiredTemplateContext<Commit>['headerPartial']
  preamblePartial: RequiredTemplateContext<Commit>['preamblePartial']
  commitPartial: RequiredTemplateContext<Commit>['commitPartial']
  footerPartial: RequiredTemplateContext<Commit>['footerPartial']
}
