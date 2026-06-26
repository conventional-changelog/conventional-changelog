export const DEFAULT_COMMIT_TYPES = Object.freeze([
  {
    type: 'feat',
    section: 'Features',
    effect: 'bump'
  },
  {
    type: 'feature',
    section: 'Features',
    effect: 'bump'
  },
  {
    type: 'fix',
    section: 'Bug Fixes',
    effect: 'bump'
  },
  {
    type: 'perf',
    section: 'Performance Improvements',
    effect: 'bump'
  },
  {
    type: 'revert',
    section: 'Reverts',
    effect: 'bump'
  },
  {
    type: 'docs',
    section: 'Documentation',
    effect: 'hidden'
  },
  {
    type: 'style',
    section: 'Styles',
    effect: 'hidden'
  },
  {
    type: 'chore',
    section: 'Miscellaneous Chores',
    effect: 'hidden'
  },
  {
    type: 'refactor',
    section: 'Code Refactoring',
    effect: 'hidden'
  },
  {
    type: 'test',
    section: 'Tests',
    effect: 'hidden'
  },
  {
    type: 'build',
    section: 'Build System',
    effect: 'hidden'
  },
  {
    type: 'ci',
    section: 'Continuous Integration',
    effect: 'hidden'
  }
].map(Object.freeze))
