export const breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/

// todo: drop, CommitParser currently handles this case
export function addBangNotes (commit) {
  const match = commit.header.match(breakingHeaderPattern)
  if (match && commit.notes.length === 0) {
    const noteText = match[3] // the description of the change.

    return [
      {
        title: 'BREAKING CHANGE',
        text: noteText
      }
    ]
  }

  return commit.notes
}
