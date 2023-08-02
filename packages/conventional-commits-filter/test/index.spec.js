import { describe, it, expect } from 'vitest'
import conventionalCommitsFilter from '../'

describe('conventional-commits-filter', () => {
  it('should error if `commits` is not an array', () => {
    expect(() => {
      conventionalCommitsFilter()
    }).toThrow()
  })

  it('should filter reverted commits that exist in the commits array', () => {
    let commits = [
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): a very important feature',
        header: 'revert: feat(): a very important feature\n',
        body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
          body: null
        },
        hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
        raw: {
          type: 'revert',
          scope: null,
          subject: 'feat(): a very important feature',
          header: 'revert: feat(): a very important feature\n',
          body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
          footer: null,
          notes: [],
          references: [],
          revert: {
            header: 'feat(): a very important feature',
            hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
            body: null
          },
          hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n'
        }
      },
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): amazing new module',
        header: 'revert: feat(): amazing new module\n',
        body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
          body: null
        },
        hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
        raw: {
          type: 'revert',
          scope: null,
          subject: 'feat(): amazing new module',
          header: 'revert: feat(): amazing new module\n',
          body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
          footer: null,
          notes: [],
          references: [],
          revert: {
            header: 'feat(): amazing new module',
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
            body: null
          },
          hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
        }
      },
      {
        type: 'Features',
        scope: null,
        subject: 'wow',
        header: 'amazing new module\n',
        body: null,
        footer: 'BREAKING CHANGE: Not backward compatible.\n',
        notes: [],
        references: [],
        revert: null,
        hash: '56185b',
        raw: {
          type: 'feat',
          scope: null,
          subject: 'amazing new module',
          header: 'feat(): amazing new module\n',
          body: null,
          footer: 'BREAKING CHANGE: Not backward compatible.\n',
          notes: [],
          references: [],
          revert: null,
          hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
        }
      },
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0',
        raw: {
          type: 'feat',
          scope: null,
          subject: 'new feature',
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25',
        raw: {
          type: 'chore',
          scope: null,
          subject: 'first commit',
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }
      }
    ]

    commits = conventionalCommitsFilter(commits)

    expect(commits.length).toBe(3)

    expect(commits).toEqual([
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): a very important feature',
        header: 'revert: feat(): a very important feature\n',
        body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
          body: null
        },
        hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
        raw: {
          type: 'revert',
          scope: null,
          subject: 'feat(): a very important feature',
          header: 'revert: feat(): a very important feature\n',
          body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
          footer: null,
          notes: [],
          references: [],
          revert: {
            header: 'feat(): a very important feature',
            hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
            body: null
          },
          hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n'
        }
      },
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0',
        raw: {
          type: 'feat',
          scope: null,
          subject: 'new feature',
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25',
        raw: {
          type: 'chore',
          scope: null,
          subject: 'first commit',
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }
      }
    ])
  })

  it('should filter revert of revert', () => {
    let commits = [
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): a very important feature',
        header: 'revert: feat(): a very important feature\n',
        body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
          body: null
        },
        hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n'
      },
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): amazing new module',
        header: 'revert: revert: feat(): amazing new module\n',
        body: 'This reverts commit 789d898b5f8422d7f65cc25135af2c1a95a125ac.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'revert: feat(): amazing new module',
          hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac',
          body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.'
        },
        hash: '098\n'
      },
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): amazing new module',
        header: 'revert: feat(): amazing new module\n',
        body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
          body: null
        },
        hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
      },
      {
        type: 'Features',
        scope: null,
        subject: 'wow',
        header: 'amazing new module\n',
        body: null,
        footer: 'BREAKING CHANGE: Not backward compatible.\n',
        notes: [],
        references: [],
        revert: null,
        hash: '56185b'
      },
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0'
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25'
      }
    ]

    commits = conventionalCommitsFilter(commits)

    expect(commits.length).toBe(4)

    expect(commits).toEqual([
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): a very important feature',
        header: 'revert: feat(): a very important feature\n',
        body: 'This reverts commit 048fe156c9eddbe566f040f64ca6be1f55b16a23.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23',
          body: null
        },
        hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n'
      },
      {
        type: 'Features',
        scope: null,
        subject: 'wow',
        header: 'amazing new module\n',
        body: null,
        footer: 'BREAKING CHANGE: Not backward compatible.\n',
        notes: [],
        references: [],
        revert: null,
        hash: '56185b'
      },
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0'
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25'
      }
    ])
  })

  it('should fall back on commit if raw is undefined', () => {
    let commits = [
      {
        type: 'revert',
        scope: null,
        subject: 'feat(): amazing new module',
        header: 'revert: feat(): amazing new module\n',
        body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
        footer: null,
        notes: [],
        references: [],
        revert: {
          header: 'feat(): amazing new module',
          hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
          body: null
        },
        hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
      },
      {
        type: 'feat',
        scope: null,
        subject: 'amazing new module',
        header: 'feat(): amazing new module\n',
        body: null,
        footer: 'BREAKING CHANGE: Not backward compatible.\n',
        notes: [],
        references: [],
        revert: null,
        hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
      },
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0',
        raw: {
          type: 'feat',
          scope: null,
          subject: 'new feature',
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25',
        raw: {
          type: 'chore',
          scope: null,
          subject: 'first commit',
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }
      }
    ]

    commits = conventionalCommitsFilter(commits)

    expect(commits.length).toBe(2)

    expect(commits).toEqual([
      {
        type: 'What',
        scope: null,
        subject: 'new feature',
        header: 'feat(): new feature\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '815a3f0',
        raw: {
          type: 'feat',
          scope: null,
          subject: 'new feature',
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }
      },
      {
        type: 'Chores',
        scope: null,
        subject: 'first commit',
        header: 'chore: first commit\n',
        body: null,
        footer: null,
        notes: [],
        references: [],
        revert: null,
        hash: '74a3e4d6d25',
        raw: {
          type: 'chore',
          scope: null,
          subject: 'first commit',
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }
      }
    ])
  })
})
