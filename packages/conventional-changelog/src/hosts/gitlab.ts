export const gitlab = {
  // GitLab removed the legacy urls without the `-/` separator in 16.0
  issue: '-/issues',
  commit: '-/commit',
  compare: '-/compare',
  referenceActions: [
    'close',
    'closes',
    'closed',
    'closing',
    'fix',
    'fixes',
    'fixed',
    'fixing'
  ],
  issuePrefixes: ['#']
}
