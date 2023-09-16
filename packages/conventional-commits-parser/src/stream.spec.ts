import { describe, it, expect } from 'vitest'
import { through } from '../../../tools/test-tools.js'
import { parseCommitsStream } from './stream.js'

describe('conventional-commits-parser', () => {
  describe('parseCommitsStream', () => {
    it('should parse raw commits', async () => {
      const stream = through()
      const commits = [
        'feat(ng-list): Allow custom separator\n'
        + 'bla bla bla\n\n'
        + 'Closes #123\nCloses #25\nFixes #33\n',

        'feat(scope): broadcast $destroy event on scope destruction\n'
        + 'bla bla bla\n\n'
        + 'BREAKING CHANGE: some breaking change\n',

        'fix(zzz): Very cool commit\n'
        + 'bla bla bla\n\n'
        + 'Closes #2, #3. Resolves #4. Fixes #5. Fixes #6.\n'
        + 'What not ?\n',

        'chore(scope with spaces): some chore\n'
        + 'bla bla bla\n\n'
        + 'BREAKING CHANGE: some other breaking change\n',

        'Revert "throw an error if a callback is passed to animate methods"\n\n'
        + 'This reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.\n\n'
        + '-hash-\n'
        + 'd7a40a29214f37d469e57d730dfd042b639d4d1f'
      ]

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      let i = 0

      for await (const chunk of stream.pipe(parseCommitsStream())) {
        if (i === 0) {
          expect(chunk.header).toBe('feat(ng-list): Allow custom separator')
        } else if (i === 1) {
          expect(chunk.notes).toEqual([
            {
              title: 'BREAKING CHANGE',
              text: 'some breaking change'
            }
          ])
        } else if (i === 2) {
          expect(chunk.header).toBe('fix(zzz): Very cool commit')
        } else if (i === 3) {
          expect(chunk.header).toBe('chore(scope with spaces): some chore')
        } else if (i === 4) {
          expect(chunk.revert).toEqual({
            header: 'throw an error if a callback is passed to animate methods',
            hash: '9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca'
          })
        }

        i++
      }

      expect(i).toBe(5)
    })

    it('should ignore malformed commits', async () => {
      const stream = through()
      const commits = [
        'chore(scope with spaces): some chore\n',

        '\n'
        + ' \n\n',

        'fix(zzz): Very cool commit\n'
        + 'bla bla bla\n\n'
      ]

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      let i = 0

      for await (const chunk of stream.pipe(parseCommitsStream())) {
        chunk.toString()
        i++
      }

      expect(i).toBe(2)
    })

    it('should warn if malformed commits found', async () => {
      const stream = through()
      const commit = ' \n\n'

      stream.write(commit)
      stream.end()

      let warning: string | null = null

      for await (const chunk of stream.pipe(parseCommitsStream({
        warn(message) {
          warning = message
        }
      }))) {
        chunk.toString()
      }

      expect(warning).toBe('TypeError: Expected a raw commit')
    })

    it('should error if malformed commits found and `options.warn === true`', async () => {
      const stream = through()
      const commit = ' \n\n'

      stream.write(commit)
      stream.end()

      await expect(async () => {
        for await (const chunk of stream.pipe(parseCommitsStream({
          warn: true
        }))) {
          chunk.toString()
        }
      }).rejects.toThrow('Expected a raw commit')
    })

    const commits = [
      'feat(ng-list) Allow custom separator\n'
      + 'bla bla bla\n\n'
      + 'Fix #123\nCloses #25\nfix #33\n',

      'fix(ng-list) Another custom separator\n'
      + 'bla bla bla\n\n'
      + 'BREAKING CHANGES: some breaking changes\n'
    ]

    it('should take options', async () => {
      const stream = through()
      let i = 0

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      for await (const chunk of stream.pipe(parseCommitsStream({
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))? (.*)$/,
        noteKeywords: ['BREAKING CHANGES'],
        referenceActions: ['fix']
      }))) {
        if (i === 0) {
          expect(chunk.type).toBe('feat')
          expect(chunk.scope).toBe('ng-list')
          expect(chunk.subject).toBe('Allow custom separator')
          expect(chunk.references).toEqual([
            {
              action: 'Fix',
              owner: null,
              repository: null,
              issue: '123',
              raw: '#123',
              prefix: '#'
            },
            {
              action: null,
              owner: null,
              repository: null,
              issue: '25',
              raw: 'Closes #25',
              prefix: '#'
            },
            {
              action: 'fix',
              owner: null,
              repository: null,
              issue: '33',
              raw: '#33',
              prefix: '#'
            }
          ])
        } else
          if (i === 1) {
            expect(chunk.type).toBe('fix')
            expect(chunk.scope).toBe('ng-list')
            expect(chunk.subject).toBe('Another custom separator')
            expect(chunk.notes[0]).toEqual({
              title: 'BREAKING CHANGES',
              text: 'some breaking changes'
            })
          }

        i++
      }

      expect(i).toBe(2)
    })

    it('should take more complex options', async () => {
      const stream = through()
      let i = 0

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.write('blabla\n-hash-\n9b1aff905b638aa274a5fc8f88662df446d374bd')
      stream.write('Revert "throw an error if a callback is passed to animate methods"\n\nThis reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.')
      stream.end()

      for await (const chunk of stream.pipe(parseCommitsStream({
        fieldPattern: /^-(.*?)-$/,
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))? (.*)$/,
        headerCorrespondence: [
          'subject',
          'type',
          'scope'
        ],
        issuePrefixes: ['#'],
        noteKeywords: ['BREAKING CHANGES'],
        referenceActions: ['fix'],
        revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
        mergePattern: /^Merge pull request #(\d+) from (.*)$/,
        revertCorrespondence: ['header']
      }))) {
        if (i === 0) {
          expect(chunk.subject).toBe('feat')
          expect(chunk.type).toBe('ng-list')
          expect(chunk.scope).toBe('Allow custom separator')
          expect(chunk.references).toEqual([
            {
              action: 'Fix',
              owner: null,
              repository: null,
              issue: '123',
              raw: '#123',
              prefix: '#'
            },
            {
              action: null,
              owner: null,
              repository: null,
              issue: '25',
              raw: 'Closes #25',
              prefix: '#'
            },
            {
              action: 'fix',
              owner: null,
              repository: null,
              issue: '33',
              raw: '#33',
              prefix: '#'
            }
          ])
        } else if (i === 1) {
          expect(chunk.type).toBe('ng-list')
          expect(chunk.scope).toBe('Another custom separator')
          expect(chunk.subject).toBe('fix')
          expect(chunk.notes[0]).toEqual({
            title: 'BREAKING CHANGES',
            text: 'some breaking changes'
          })
        } else if (i === 2) {
          expect(chunk.header).toBe('blabla')
          expect(chunk.hash).toBe('9b1aff905b638aa274a5fc8f88662df446d374bd')
        } else if (i === 3) {
          expect(chunk.revert.header).toBe('throw an error if a callback is passed to animate methods')
        }

        i++
      }

      expect(i).toBe(4)
    })
  })
})
