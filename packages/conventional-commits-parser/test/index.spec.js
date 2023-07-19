import { describe, it, expect } from 'vitest'
import { through, throughObj } from '../../../tools/test-tools'
import conventionalCommitsParser from '../'

describe('conventional-commits-parser', () => {
  it('should parse raw commits', () => {
    return new Promise((resolve) => {
      const stream = through()
      const commits = [
        'feat(ng-list): Allow custom separator\n' +
        'bla bla bla\n\n' +
        'Closes #123\nCloses #25\nFixes #33\n',

        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'bla bla bla\n\n' +
        'BREAKING CHANGE: some breaking change\n',

        'fix(zzz): Very cool commit\n' +
        'bla bla bla\n\n' +
        'Closes #2, #3. Resolves #4. Fixes #5. Fixes #6.\n' +
        'What not ?\n',

        'chore(scope with spaces): some chore\n' +
        'bla bla bla\n\n' +
        'BREAKING CHANGE: some other breaking change\n',

        'Revert "throw an error if a callback is passed to animate methods"\n\n' +
        'This reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.\n\n' +
        '-hash-\n' +
        'd7a40a29214f37d469e57d730dfd042b639d4d1f'
      ]

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      let i = 0

      stream
        .pipe(conventionalCommitsParser())
        .pipe(throughObj((chunk, enc, cb) => {
          if (i === 0) {
            expect(chunk.header).toEqual('feat(ng-list): Allow custom separator')
          } else if (i === 1) {
            expect(chunk.notes).toEqual([{
              title: 'BREAKING CHANGE',
              text: 'some breaking change'
            }])
          } else if (i === 2) {
            expect(chunk.header).toEqual('fix(zzz): Very cool commit')
          } else if (i === 3) {
            expect(chunk.header).toEqual('chore(scope with spaces): some chore')
          } else if (i === 4) {
            expect(chunk.revert).toEqual({
              header: 'throw an error if a callback is passed to animate methods',
              hash: '9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca'
            })
          }

          i++
          cb()
        }, () => {
          expect(i).toEqual(5)
          resolve()
        }))
    })
  })

  it('should ignore malformed commits', () => {
    return new Promise((resolve) => {
      const stream = through()
      const commits = [
        'chore(scope with spaces): some chore\n',

        '\n' +
        ' \n\n',

        'fix(zzz): Very cool commit\n' +
        'bla bla bla\n\n'
      ]

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      let i = 0

      stream
        .pipe(conventionalCommitsParser())
        .pipe(throughObj((chunk, enc, cb) => {
          ++i
          cb()
        }, () => {
          expect(i).toEqual(3)
          resolve()
        }))
    })
  })

  it('should warn if malformed commits found', () => {
    return new Promise((resolve) => {
      const stream = through()
      const commit = ' \n\n'

      stream.write(commit)
      stream.end()

      stream
        .pipe(conventionalCommitsParser({
          warn: (warning) => {
            expect(warning).toEqual('TypeError: Expected a raw commit')
            resolve()
          }
        }))
        .pipe(throughObj((chunk, enc, cb) => {
          cb()
        }))
    })
  })

  it('should error if malformed commits found and `options.warn === true`', () => {
    return new Promise((resolve) => {
      const stream = through()
      const commit = ' \n\n'

      stream.write(commit)
      stream.end()

      stream
        .pipe(conventionalCommitsParser({
          warn: true
        }))
        .on('error', (err) => {
          expect(err.toString()).toEqual('TypeError: Expected a raw commit')
          resolve()
        })
    })
  })

  const commits = [
    'feat(ng-list) Allow custom separator\n' +
    'bla bla bla\n\n' +
    'Fix #123\nCloses #25\nfix #33\n',

    'fix(ng-list) Another custom separator\n' +
    'bla bla bla\n\n' +
    'BREAKING CHANGES: some breaking changes\n'
  ]

  it('should take options', () => {
    return new Promise((resolve) => {
      const stream = through()
      let i = 0

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.end()

      stream
        .pipe(conventionalCommitsParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))? (.*)$/,
          noteKeywords: ['BREAKING CHANGES'],
          referenceActions: ['fix']
        }))
        .pipe(throughObj((chunk, enc, cb) => {
          if (i === 0) {
            expect(chunk.type).toEqual('feat')
            expect(chunk.scope).toEqual('ng-list')
            expect(chunk.subject).toEqual('Allow custom separator')
            expect(chunk.references).toEqual([{
              action: 'Fix',
              owner: null,
              repository: null,
              issue: '123',
              raw: '#123',
              prefix: '#'
            }, {
              action: null,
              owner: null,
              repository: null,
              issue: '25',
              raw: 'Closes #25',
              prefix: '#'
            }, {
              action: 'fix',
              owner: null,
              repository: null,
              issue: '33',
              raw: '#33',
              prefix: '#'
            }])
          }
          if (i === 1) {
            expect(chunk.type).toEqual('fix')
            expect(chunk.scope).toEqual('ng-list')
            expect(chunk.subject).toEqual('Another custom separator')
            expect(chunk.notes[0]).toEqual({
              title: 'BREAKING CHANGES',
              text: 'some breaking changes'
            })
          }

          i++
          cb()
        }, () => {
          expect(i).toEqual(2)
          resolve()
        }))
    })
  })

  it('should take string options', () => {
    return new Promise((resolve) => {
      const stream = through()
      let i = 0

      commits.forEach((commit) => {
        stream.write(commit)
      })
      stream.write('blabla\n-hash-\n9b1aff905b638aa274a5fc8f88662df446d374bd')
      stream.write('Revert "throw an error if a callback is passed to animate methods"\n\nThis reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.')
      stream.end()

      stream
        .pipe(conventionalCommitsParser({
          fieldPattern: '^-(.*?)-$',
          headerPattern: '^(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\ (.*)$',
          headerCorrespondence: 'subject,type,  scope,',
          issuePrefixes: '#',
          noteKeywords: 'BREAKING CHANGES',
          referenceActions: 'fix',
          revertPattern: '^Revert\\s"([\\s\\S]*)"\\s*This reverts commit (\\w*)\\.',
          mergePattern: '/^Merge pull request #(\\d+) from (.*)$/',
          revertCorrespondence: ' header'
        }))
        .pipe(throughObj((chunk, enc, cb) => {
          if (i === 0) {
            expect(chunk.subject).toEqual('feat')
            expect(chunk.type).toEqual('ng-list')
            expect(chunk.scope).toEqual('Allow custom separator')
            expect(chunk.references).toEqual([{
              action: 'Fix',
              owner: null,
              repository: null,
              issue: '123',
              raw: '#123',
              prefix: '#'
            }, {
              action: null,
              owner: null,
              repository: null,
              issue: '25',
              raw: 'Closes #25',
              prefix: '#'
            }, {
              action: 'fix',
              owner: null,
              repository: null,
              issue: '33',
              raw: '#33',
              prefix: '#'
            }])
          } else if (i === 1) {
            expect(chunk.type).toEqual('ng-list')
            expect(chunk.scope).toEqual('Another custom separator')
            expect(chunk.subject).toEqual('fix')
            expect(chunk.notes[0]).toEqual({
              title: 'BREAKING CHANGES',
              text: 'some breaking changes'
            })
          } else if (i === 2) {
            expect(chunk.header).toEqual('blabla')
            expect(chunk.hash).toEqual('9b1aff905b638aa274a5fc8f88662df446d374bd')
          } else if (i === 3) {
            expect(chunk.revert.header).toEqual('throw an error if a callback is passed to animate methods')
          }

          i++
          cb()
        }, () => {
          expect(i).toEqual(4)
          resolve()
        }))
    })
  })
})

describe('sync', () => {
  it('should work', () => {
    const commit = 'feat(ng-list): Allow custom separator\n' +
      'bla bla bla\n\n' +
      'Closes #123\nCloses #25\nFixes #33\n'
    const result = conventionalCommitsParser.sync(commit)

    expect(result.header).toEqual('feat(ng-list): Allow custom separator')
    expect(result.footer).toEqual('Closes #123\nCloses #25\nFixes #33')
    expect(result.references).toEqual([
      {
        action: 'Closes',
        issue: '123',
        owner: null,
        prefix: '#',
        raw: '#123',
        repository: null
      },
      {
        action: 'Closes',
        issue: '25',
        owner: null,
        prefix: '#',
        raw: '#25',
        repository: null
      },
      {
        action: 'Fixes',
        issue: '33',
        owner: null,
        prefix: '#',
        raw: '#33',
        repository: null
      }
    ])
  })

  it('should parse references from header', () => {
    const commit = 'Subject #1'
    const result = conventionalCommitsParser.sync(commit)

    expect(result.references).toEqual([{
      action: null,
      issue: '1',
      owner: null,
      prefix: '#',
      raw: 'Subject #1',
      repository: null
    }])
  })

  it('should parse slash in the header with default headerPattern option', () => {
    const commit = 'feat(hello/world): message'
    const result = conventionalCommitsParser.sync(commit)

    expect(result.type).toEqual('feat')
    expect(result.scope).toEqual('hello/world')
    expect(result.subject).toEqual('message')
  })
})
