import type {
  CommitKnownProps,
  CommitGroup,
  CommitNote,
  NoteGroup,
  FinalTemplateContext,
  HeaderPartialFunction,
  PreamblePartialFunction,
  CommitPartialFunction,
  FooterPartialFunction
} from '@conventional-changelog/template'
import type {
  Comparator,
  PickStringsKeys
} from './utils.js'

export type SortBy<T> = PickStringsKeys<T> | PickStringsKeys<T>[] | Comparator<T>

export type CommitTransformFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (commit: Commit, context: FinalTemplateContext<Commit>, options: FinalOptions<Commit>) => Partial<Commit> | null | Promise<Partial<Commit> | null>

export type GenerateOnFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (
    keyCommit: Commit,
    commitsGroup: Commit[],
    context: FinalTemplateContext<Commit>,
    options: FinalOptions<Commit>
  ) => boolean

export type TemplateFunction<Commit extends CommitKnownProps = CommitKnownProps> =
  (context: FinalTemplateContext<Commit>) => string | Promise<string>

export interface Options<Commit extends CommitKnownProps = CommitKnownProps> {
  /**
   * Key to group commits by.
   * If this value is falsy, commits are not grouped.
   */
  groupBy?: keyof Commit
  /**
   * Key to sort commits by or sort function.
   * If this value is falsy, commits are not sorted.
   */
  commitsSort?: SortBy<Commit>
  /**
   * Key to sort commit groups by or sort function.
   * If this value is falsy, commit groups are not sorted.
   */
  commitGroupsSort?: SortBy<CommitGroup<Commit>>
  /**
   * Key to sort notes by or sort function.
   * If this value is falsy, notes are not sorted.
   */
  notesSort?: SortBy<CommitNote>
  /**
   * Key to sort note groups by or sort function.
   * If this value is falsy, note groups are not sorted.
   */
  noteGroupsSort?: SortBy<NoteGroup>
  /**
   * If `true`, reverted commits will be ignored.
   */
  ignoreReverted?: boolean
  /**
   * The normal order means reverse chronological order.
   * `reverse` order means chronological order.
   */
  reverse?: boolean
  /**
   * If `true`, the stream will flush out the last bit of commits (could be empty) to changelog.
   */
  doFlush?: boolean
  /**
   * A function to transform commits.
   * Should return diff object which will be merged with the original commit.
   */
  transform?: CommitTransformFunction<Commit>
  /**
   * Function or key to detect whether a changelog block should be generated.
   */
  generateOn?: GenerateOnFunction<Commit> | keyof Commit | null
  /**
   * Function that renders the prepared changelog context to text.
   */
  template?: TemplateFunction<Commit>
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
  /**
   * Last chance to modify your context before generating a changelog.
   * @param context
   * @param options
   * @param filteredCommits
   * @param keyCommit
   * @param commits
   */
  finalizeContext?(
    context: FinalTemplateContext<Commit>,
    options: FinalOptions<Commit>,
    filteredCommits: Commit[],
    keyCommit: Commit | null,
    commits: Commit[]
  ): FinalTemplateContext<Commit> | Promise<FinalTemplateContext<Commit>>
  /**
   * A function to get debug information.
   * @param message - The debug message.
   */
  debug?(message: string): void
  /**
   * A function to format date.
   * @param date - Date string or Date object.
   * @returns Final date string.
   */
  formatDate?(date: string | Date): string
  /**
   * A function that will determine if a commit should be skipped by the writer
   * @param commit - The commit in question
   * @returns boolean. If true, don't write the current commit
   */
  skip?(commit: Commit): boolean
}

type RequiredOptions<Commit extends CommitKnownProps = CommitKnownProps> = Required<Options<Commit>>

export interface FinalOptions<Commit extends CommitKnownProps = CommitKnownProps> extends Options<Commit> {
  groupBy: RequiredOptions<Commit>['groupBy']
  generateOn: RequiredOptions<Commit>['generateOn']
  finalizeContext: RequiredOptions<Commit>['finalizeContext']
  debug: RequiredOptions<Commit>['debug']
  formatDate: RequiredOptions<Commit>['formatDate']
  transform: RequiredOptions<Commit>['transform']
  template: RequiredOptions<Commit>['template']
  headerPartial: RequiredOptions<Commit>['headerPartial']
  preamblePartial: RequiredOptions<Commit>['preamblePartial']
  commitPartial: RequiredOptions<Commit>['commitPartial']
  footerPartial: RequiredOptions<Commit>['footerPartial']
  commitsSort?: Comparator<Commit>
  commitGroupsSort?: Comparator<CommitGroup<Commit>>
  notesSort?: Comparator<CommitNote>
  noteGroupsSort?: Comparator<NoteGroup>
  skip?: Options<Commit>['skip']
}
