import { isBreakingNote } from '@conventional-changelog/template'

export function whatBump(commits) {
  let level = 2
  let breakings = 0
  let features = 0

  commits.forEach((commit) => {
    // only breaking change notes affect the version,
    // any other note keyword is just a changelog section
    const breakingNotes = commit.notes.filter(isBreakingNote)

    if (breakingNotes.length > 0) {
      breakings += breakingNotes.length
      level = 0
    } else if (commit.type === 'feat') {
      features += 1

      if (level === 2) {
        level = 1
      }
    }
  })

  return {
    level,
    reason: breakings === 1
      ? `There is ${breakings} BREAKING CHANGE and ${features} features`
      : `There are ${breakings} BREAKING CHANGES and ${features} features`
  }
}
