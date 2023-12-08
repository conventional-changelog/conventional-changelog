import { describe, it, expect } from 'vitest'
import { toArray } from '../../../tools/test-tools.js'
import { filterRevertedCommits } from './index.js'

describe('conventional-commits-filter', () => {
  describe('filters', () => {
    describe('filterRevertedCommits', () => {
      it('should error if `commits` is not an iterable', async () => {
        await expect(filterRevertedCommits(null as any).next()).rejects.toThrow()
      })

      it('should filter reverted commits', async () => {
        let commits = [
          {
            header: 'commit to revert 1',
            hash: 'r_1',
            revert: {
              header: 'commit to revert 1',
              hash: '1'
            }
          },
          {
            header: 'commit 3',
            hash: '3'
          },
          {
            header: 'commit to revert 2',
            hash: 'r_2',
            revert: {
              header: 'commit to revert 2',
              hash: '2'
            }
          },
          {
            header: 'commit 4',
            hash: '4'
          },
          {
            header: 'commit to revert 1',
            hash: '1'
          },
          {
            header: 'commit 5',
            hash: '5'
          },
          {
            header: 'commit to revert 2',
            hash: '2'
          },
          {
            header: 'commit 6',
            hash: '6'
          }
        ]

        commits = await toArray(filterRevertedCommits(commits))

        expect(commits.length).toBe(4)
        expect(commits).toEqual([
          {
            header: 'commit 3',
            hash: '3'
          },
          {
            header: 'commit 4',
            hash: '4'
          },
          {
            header: 'commit 5',
            hash: '5'
          },
          {
            header: 'commit 6',
            hash: '6'
          }
        ])
      })

      it('should filter reverted commits that stands after revert commit', async () => {
        let commits = [
          {
            header: 'revert: feat(): a very important feature\n',
            hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
            },
            raw: {
              header: 'revert: feat(): a very important feature\n',
              hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
              revert: {
                header: 'feat(): a very important feature',
                hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
              }
            }
          },
          {
            header: 'revert: feat(): amazing new module\n',
            hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
            },
            raw: {
              header: 'revert: feat(): amazing new module\n',
              hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
              revert: {
                header: 'feat(): amazing new module',
                hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
              }
            }
          },
          {
            header: 'amazing new module\n',
            hash: '56185b',
            raw: {
              header: 'feat(): amazing new module\n',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
            }
          },
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            raw: {
              header: 'feat(): new feature\n',
              hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
            }
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            raw: {
              header: 'chore: first commit\n',
              hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
            }
          }
        ]

        commits = await toArray(filterRevertedCommits(commits))

        expect(commits.length).toBe(3)
        expect(commits).toEqual([
          {
            header: 'revert: feat(): a very important feature\n',
            hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
            },
            raw: {
              header: 'revert: feat(): a very important feature\n',
              hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
              revert: {
                header: 'feat(): a very important feature',
                hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
              }
            }
          },
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            raw: {
              header: 'feat(): new feature\n',
              hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
            }
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            raw: {
              header: 'chore: first commit\n',
              hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
            }
          }
        ])
      })

      it('should filter revert of revert', async () => {
        let commits = [
          {
            header: 'revert: feat(): a very important feature\n',
            hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
            }
          },
          {
            header: 'revert: revert: feat(): amazing new module\n',
            hash: '098\n',
            revert: {
              header: 'revert: feat(): amazing new module',
              hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac'
            }
          },
          {
            header: 'revert: feat(): amazing new module\n',
            hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
            }
          },
          {
            header: 'amazing new module\n',
            hash: '56185b',
            revert: null
          },
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            revert: null
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            revert: null
          }
        ]

        commits = await toArray(filterRevertedCommits(commits))

        expect(commits.length).toBe(4)
        expect(commits).toEqual([
          {
            header: 'revert: feat(): a very important feature\n',
            hash: '207abfa16885ef5ff88dfc6cdde694bb3fd03104\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '048fe156c9eddbe566f040f64ca6be1f55b16a23'
            }
          },
          {
            header: 'amazing new module\n',
            hash: '56185b',
            revert: null
          },
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            revert: null
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            revert: null
          }
        ])
      })

      it('should fall back on commit if raw is undefined', async () => {
        let commits = [
          {
            header: 'revert: feat(): amazing new module\n',
            hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
            revert: {
              header: 'feat(): amazing new module',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
            }
          },
          {
            header: 'feat(): amazing new module\n',
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n',
            revert: null
          },
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            revert: null,
            raw: {
              header: 'feat(): new feature\n',
              hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n',
              revert: null
            }
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            revert: null,
            raw: {
              header: 'chore: first commit\n',
              hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n',
              revert: null
            }
          }
        ]

        commits = await toArray(filterRevertedCommits(commits))

        expect(commits.length).toBe(2)
        expect(commits).toEqual([
          {
            header: 'feat(): new feature\n',
            hash: '815a3f0',
            revert: null,
            raw: {
              header: 'feat(): new feature\n',
              hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n',
              revert: null
            }
          },
          {
            header: 'chore: first commit\n',
            hash: '74a3e4d6d25',
            revert: null,
            raw: {
              header: 'chore: first commit\n',
              hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n',
              revert: null
            }
          }
        ])
      })
    })
  })
})
