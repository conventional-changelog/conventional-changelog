import semver from 'semver'
import type {
  CommitKnownProps,
  CommitGroup,
  CommitNote,
  NoteGroup,
  Options,
  FinalOptions,
  Context,
  FinalContext
} from './types/index.js'
import {
  formatDate,
  stringify
} from './utils.js'

export function getCommitGroups<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Commit[],
  options: Pick<FinalOptions<Commit>, 'groupBy' | 'commitGroupsSort' | 'commitsSort'>
) {
  const {
    groupBy,
    commitGroupsSort,
    commitsSort
  } = options
  const commitGroups: CommitGroup<Commit>[] = []
  const commitGroupsObj = commits.reduce<Record<string, Commit[]>>((groups, commit) => {
    const key = commit[groupBy] as string || ''

    if (groups[key]) {
      groups[key].push(commit)
    } else {
      groups[key] = [commit]
    }

    return groups
  }, {})

  Object.entries(commitGroupsObj).forEach(([title, commits]) => {
    if (commitsSort) {
      commits.sort(commitsSort)
    }

    commitGroups.push({
      title,
      commits
    })
  })

  if (commitGroupsSort) {
    commitGroups.sort(commitGroupsSort)
  }

  return commitGroups
}

export function getNoteGroups<Commit extends CommitKnownProps = CommitKnownProps>(
  notes: CommitNote[],
  options: Pick<FinalOptions<Commit>, 'noteGroupsSort' | 'notesSort'>
) {
  const {
    noteGroupsSort,
    notesSort
  } = options
  const retGroups: NoteGroup[] = []

  notes.forEach((note) => {
    const { title } = note
    let titleExists = false

    retGroups.forEach((group) => {
      if (group.title === title) {
        titleExists = true
        group.notes.push(note)
      }
    })

    if (!titleExists) {
      retGroups.push({
        title,
        notes: [note]
      })
    }
  })

  if (noteGroupsSort) {
    retGroups.sort(noteGroupsSort)
  }

  if (notesSort) {
    retGroups.forEach((group) => {
      group.notes.sort(notesSort)
    })
  }

  return retGroups
}

export function getExtraContext<Commit extends CommitKnownProps = CommitKnownProps>(
  commits: Commit[],
  notes: CommitNote[],
  options: Pick<FinalOptions<Commit>, 'groupBy' | 'commitGroupsSort' | 'commitsSort' | 'noteGroupsSort' | 'notesSort'>
) {
  return {
    // group `commits` by `options.groupBy`
    commitGroups: getCommitGroups(commits, options),
    // group `notes` for footer
    noteGroups: getNoteGroups(notes, options)
  }
}

/**
 * Get final context with default values.
 * @param context
 * @param options
 * @returns Final context with default values.
 */
export function getFinalContext<Commit extends CommitKnownProps = CommitKnownProps>(
  context: Context<Commit>,
  options: Options<Commit>
) {
  const finalContext: FinalContext<Commit> = {
    commit: 'commits',
    issue: 'issues',
    date: formatDate(new Date(), options.timeZone),
    ...context
  }

  if (
    typeof finalContext.linkReferences !== 'boolean'
    && (finalContext.repository || finalContext.repoUrl)
    && finalContext.commit
    && finalContext.issue
  ) {
    finalContext.linkReferences = true
  }

  return finalContext
}

/**
 * Get context prepared for template.
 * @param keyCommit
 * @param commits
 * @param filteredCommits
 * @param notes
 * @param context
 * @param options
 * @returns Context prepared for template.
 */
export async function getTemplateContext<Commit extends CommitKnownProps = CommitKnownProps>(
  keyCommit: Commit | null,
  commits: Commit[],
  filteredCommits: Commit[],
  notes: CommitNote[],
  context: FinalContext<Commit>,
  options: FinalOptions<Commit>
) {
  let templateContext: FinalContext<Commit> = {
    ...context,
    ...keyCommit as Commit,
    ...getExtraContext(filteredCommits, notes, options)
  }

  if (keyCommit?.committerDate) {
    templateContext.date = keyCommit.committerDate
  }

  if (templateContext.version && semver.valid(templateContext.version)) {
    templateContext.isPatch = templateContext.isPatch || semver.patch(templateContext.version) !== 0
  }

  templateContext = await options.finalizeContext(templateContext, options, filteredCommits, keyCommit, commits)

  options.debug(`Your final context is:\n${stringify(templateContext)}`)

  return templateContext
}
