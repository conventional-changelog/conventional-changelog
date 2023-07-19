import concat from 'concat-stream'
import fs from 'fs'
import { fork as spawn } from 'child_process'
import path from 'path'
import { describe, it, expect } from 'vitest'
import { through } from '../../../tools/test-tools'

const CLI_PATH = path.join(__dirname, './test-cli.js')

describe('conventional-commits-parser', () => {
  describe('cli', () => {
    it('should parse commits in a file', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, [path.join(__dirname, 'fixtures/log1.txt')], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat((chunk) => {
            expect(chunk.toString()).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should work with a separator', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, [path.join(__dirname, 'fixtures/log2.txt'), '==='], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat((chunk) => {
            chunk = chunk.toString()
            expect(chunk).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
            expect(chunk).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should work with two files', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, [path.join(__dirname, 'fixtures/log1.txt'), path.join(__dirname, 'fixtures/log2.txt'), '==='], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat((chunk) => {
            chunk = chunk.toString()
            expect(chunk).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
            expect(chunk).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
            expect(chunk).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should error if files cannot be found', () => {
      return new Promise((resolve, reject) => {
        let i = 0
        const cp = spawn(CLI_PATH, [path.join(__dirname, 'fixtures/log1.txt'), path.join(__dirname, 'fixtures/log4.txt'), path.join(__dirname, 'fixtures/log2.txt'), path.join(__dirname, 'fixtures/log5.txt'), '==='], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(through((chunk, enc, cb) => {
            chunk = chunk.toString()
            if (i === 0) {
              expect(chunk).toContain(`Failed to read file ${path.join(__dirname, 'fixtures/log4.txt')}`)
            } else {
              expect(chunk).toContain(`Failed to read file ${path.join(__dirname, 'fixtures/log5.txt')}`)
            }
            i++
            cb()
          }, () => {
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should work with options', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, [path.join(__dirname, 'fixtures/log3.txt'), '-p', '^(\\w*)(?:\\(([:\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$', '--reference-actions', 'close, fix', '-n', 'BREAKING NEWS', '--headerCorrespondence', 'scope, type,subject '], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat((chunk) => {
            const data = JSON.parse(chunk.toString())[0]

            expect(data.scope).toEqual('category')
            expect(data.type).toEqual('fix:subcategory')
            expect(data.subject).toEqual('My subject')

            expect(data.references).toEqual([
              {
                action: 'Close',
                owner: null,
                repository: null,
                issue: '10036',
                raw: '#10036',
                prefix: '#'
              },
              {
                action: null,
                issue: '13233',
                owner: null,
                prefix: '#',
                raw: 'Fixed #13233',
                repository: null
              },
              {
                action: 'fix',
                owner: null,
                repository: null,
                issue: '9338',
                raw: '#9338',
                prefix: '#'
              }
            ])

            expect(data.notes).toEqual([
              {
                title: 'BREAKING NEWS',
                text: 'A lot of changes!'
              }
            ])

            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should work if it is not a tty', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, {
          cwd: __dirname,
          stdio: [fs.openSync(path.join(__dirname, 'fixtures/log1.txt'), 'r'), null, null, 'ipc']
        })
        cp.stdout
          .pipe(concat((chunk) => {
            expect(chunk.toString()).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should separate if it is not a tty', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, ['==='], {
          cwd: __dirname,
          stdio: [fs.openSync(path.join(__dirname, 'fixtures/log2.txt'), 'r'), null, null, 'ipc']
        })

        cp.stdout
          .pipe(concat((chunk) => {
            chunk = chunk.toString()
            expect(chunk).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
            expect(chunk).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
            resolve()
          }))
        cp.on('error', reject)
      })
    })

    it('should error if it is not a tty and commit cannot be parsed', () => {
      return new Promise((resolve, reject) => {
        const cp = spawn(CLI_PATH, {
          cwd: __dirname,
          stdio: [fs.openSync(path.join(__dirname, 'fixtures/bad_commit.txt'), 'r'), null, null, 'ipc']
        })
        cp.stderr
          .pipe(concat((chunk) => {
            expect(chunk.toString()).toEqual('TypeError: Expected a raw commit\n')
            resolve()
          }))
        cp.on('error', reject)
      })
    })
  })
})
