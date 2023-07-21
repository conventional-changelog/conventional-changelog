import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools, through, delay } from '../../../tools/test-tools'
import gitRawCommits from '../'

let testTools

describe('git-raw-commits', () => {
  beforeAll(() => {
    testTools = new TestTools()
    testTools.gitInit()
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should emit an error and the error should not be read only if there are no commits', () => {
    return new Promise((resolve, reject) => {
      gitRawCommits({}, {
        cwd: testTools.cwd
      })
        .on('error', (err) => {
          expect(err).toBeTruthy()
          err.message = 'error message'
          resolve()
        })
        .pipe(
          through(() => {
            reject(new Error('should error'))
          }, () => {
            reject(new Error('should error'))
          })
        )
    })
  })

  it('should execute the command without error', () => {
    testTools.mkdirSync('./packages/foo', { recursive: true })
    testTools.writeFileSync('./packages/foo/test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
    testTools.writeFileSync('test2', '')
    testTools.exec('git add --all && git commit -m"Second commit"')
    testTools.writeFileSync('test3', '')
    testTools.exec('git add --all && git commit -m"Third commit"')

    return new Promise((resolve, reject) => {
      gitRawCommits({}, {
        cwd: testTools.cwd
      })
        .on('close', resolve)
        .on('error', reject)
    })
  })

  it('should get commits without `options` (`options.from` defaults to the first commit)', () => {
    let i = 0

    return new Promise((resolve) => {
      gitRawCommits({}, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            if (i === 0) {
              expect(chunk).toEqual('Third commit\n\n')
            } else if (i === 1) {
              expect(chunk).toEqual('Second commit\n\n')
            } else {
              expect(chunk).toEqual('First commit\n\n')
            }

            i++
            cb()
          }, () => {
            expect(i).toEqual(3)
            resolve()
          })
        )
    })
  })

  it('should honour `options.from`', () => {
    let i = 0

    return new Promise((resolve) => {
      gitRawCommits({
        from: 'HEAD~1'
      }, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            expect(chunk).toEqual('Third commit\n\n')

            i++
            cb()
          }, () => {
            expect(i).toEqual(1)
            resolve()
          })
        )
    })
  })

  it('should honour `options.to`', () => {
    let i = 0

    return new Promise((resolve) => {
      gitRawCommits({
        to: 'HEAD^'
      }, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            if (i === 0) {
              expect(chunk).toEqual('Second commit\n\n')
            } else {
              expect(chunk).toEqual('First commit\n\n')
            }

            i++
            cb()
          }, () => {
            expect(i).toEqual(2)
            resolve()
          })
        )
    })
  })

  it('should honour `options.format`', () => {
    let i = 0

    return new Promise((resolve) => {
      gitRawCommits({
        format: 'what%n%B'
      }, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            if (i === 0) {
              expect(chunk).toEqual('what\nThird commit\n\n')
            } else if (i === 1) {
              expect(chunk).toEqual('what\nSecond commit\n\n')
            } else {
              expect(chunk).toEqual('what\nFirst commit\n\n')
            }

            i++
            cb()
          }, () => {
            expect(i).toEqual(3)
            resolve()
          })
        )
    })
  })

  it('should allow commits to be scoped to a specific directory', () => {
    let i = 0
    let output = ''

    return new Promise((resolve) => {
      gitRawCommits({
        path: './packages/foo'
      }, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            output += chunk.toString()

            i++
            cb()
          }, () => {
            expect(i).toEqual(1)
            expect(output).toMatch(/First commit/)
            expect(output).not.toMatch(/Second commit/)
            resolve()
          })
        )
    })
  })

  it('should show your git-log command', () => {
    return new Promise((resolve) => {
      gitRawCommits({
        format: 'what%n%B',
        debug: (cmd) => {
          expect(cmd).toContain('Your git-log command is:\ngit log --format')
          resolve()
        }
      }, {
        cwd: testTools.cwd
      })
    })
  })

  it('should prevent variable expansion on Windows', () => {
    let i = 0

    return new Promise((resolve) => {
      gitRawCommits({
        format: '%%cd%n%B'
      }, {
        cwd: testTools.cwd
      })
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            if (i === 0) {
              expect(chunk).toEqual('%cd\nThird commit\n\n')
            } else if (i === 1) {
              expect(chunk).toEqual('%cd\nSecond commit\n\n')
            } else {
              expect(chunk).toEqual('%cd\nFirst commit\n\n')
            }

            i++
            cb()
          }, () => {
            expect(i).toEqual(3)
            resolve()
          })
        )
    })
  })

  it('should allow commits to be scoped to a specific directory and specific date range', () => {
    let i = 0

    // Since milliseconds are ignored (https://git-scm.com/docs/git-commit#Documentation/git-commit.txt-ISO8601),
    // A one-second delay ensures that new commits are filtered (https://www.git-scm.com/docs/git-log#Documentation/git-log.txt---sinceltdategt)
    return delay(1000)
      .then(() => {
        const now = new Date().toISOString()
        testTools.writeFileSync('./packages/foo/test1', 'hello')
        testTools.exec('git add --all && git commit -m"Fourth commit"')
        testTools.writeFileSync('test2', 'hello')
        testTools.exec('git add --all && git commit -m"Fifth commit"')

        return new Promise((resolve) => {
          gitRawCommits({
            path: './packages/foo',
            since: now
          }, {
            cwd: testTools.cwd
          })
            .pipe(
              through((chunk, enc, cb) => {
                chunk = chunk.toString()

                if (i === 0) {
                  expect(chunk).toEqual('Fourth commit\n\n')
                }

                i++
                cb()
              }, () => {
                expect(i).toEqual(1)
                resolve()
              })
            )
        })
      })
  })
})
