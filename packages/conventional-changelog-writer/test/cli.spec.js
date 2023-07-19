import concat from 'concat-stream'
import fs from 'fs'
import { fork as spawn } from 'child_process'
import path from 'path'
import { describe, it, expect } from 'vitest'

const CLI_PATH = path.join(__dirname, './test-cli.js')
const COMMITS_PATH = 'fixtures/commits.ldjson'
const OPTIONS_PATH = 'fixtures/options.js'
const CONTEXT_PATH = 'fixtures/context.json'

describe('conventional-changelog-writer', () => {
  describe('cli', () => {
    it('should work without context and options', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, [COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            expect(chunk.toString()).toBeTruthy()
            resolve()
          }))
      })
    })

    it('should take context', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-c', CONTEXT_PATH, COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            const log = chunk.toString()
            expect(log).toContain('This is a title')
            expect(log).toContain('2015 March 14')
            resolve()
          }))
      })
    })

    it('should take absolute context path', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-c', path.join(__dirname, CONTEXT_PATH), COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            const log = chunk.toString()
            expect(log).toContain('This is a title')
            expect(log).toContain('2015 March 14')
            resolve()
          }))
      })
    })

    it('should take options', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-o', OPTIONS_PATH, COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            expect(chunk.toString()).toEqual('template')
            resolve()
          }))
      })
    })

    it('should take absolute options path', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-o', path.join(__dirname, OPTIONS_PATH), COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            expect(chunk.toString()).toEqual('template')
            resolve()
          }))
      })
    })

    it('should take both context and options', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-o', OPTIONS_PATH, '-c', CONTEXT_PATH, COMMITS_PATH], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stdout
          .pipe(concat(chunk => {
            expect(chunk.toString()).toEqual('dodge date :D\ntemplate')
            resolve()
          }))
      })
    })

    it('should work if it is not tty', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-o', OPTIONS_PATH, '-c', CONTEXT_PATH], {
          cwd: __dirname,
          stdio: [fs.openSync(path.join(__dirname, COMMITS_PATH), 'r'), null, null, 'ipc']
        })
        cp.stdout
          .pipe(concat(chunk => {
            expect(chunk.toString()).toEqual('dodge date :D\ntemplate')
            resolve()
          }))
      })
    })

    it('should error when there is no commit input', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, [], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(concat(err => {
            expect(err.toString()).toEqual('You must specify at least one line delimited json file\n')
            resolve()
          }))
      })
    })

    it('should error when options file doesnt exist', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['-o', 'nofile'], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(concat(err => {
            expect(err.toString()).toContain('Failed to get options from file nofile\n')
            resolve()
          }))
      })
    })

    it('should error when context file doesnt exist', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['--context', 'nofile'], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(concat(err => {
            expect(err.toString()).toContain('Failed to get context from file nofile\n')
            resolve()
          }))
      })
    })

    it('should error when commit input files dont exist', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['nofile', 'fakefile'], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(concat(err => {
            err = err.toString()
            expect(err).toContain('Failed to read file nofile\n')
            expect(err).toContain('Failed to read file fakefile\n')
            resolve()
          }))
      })
    })

    it('should error when commit input file is invalid line delimited json', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, ['fixtures/invalid_line_delimited.json'], {
          cwd: __dirname,
          stdio: [null, null, null, 'ipc'],
          env: {
            FORCE_STDIN_TTY: '1'
          }
        })
        cp.stderr
          .pipe(concat(err => {
            expect(err.toString()).toContain('Failed to split commits in file fixtures/invalid_line_delimited.json\n')
            resolve()
          }))
      })
    })

    it('should error when commit input file is invalid line delimited json if it is not tty', () => {
      return new Promise((resolve) => {
        const cp = spawn(CLI_PATH, [], {
          cwd: __dirname,
          stdio: [fs.openSync(path.join(__dirname, 'fixtures/invalid_line_delimited.json'), 'r'), null, null, 'ipc']
        })
        cp.stderr
          .pipe(concat(err => {
            expect(err.toString()).toContain('Failed to split commits\n')
            resolve()
          }))
      })
    })
  })
})
