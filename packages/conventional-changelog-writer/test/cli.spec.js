import fs from 'fs'
import path from 'path'
import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/test-tools.js'

const CLI_PATH = path.join(__dirname, './test-cli.cjs')
const COMMITS_PATH = 'fixtures/commits.ldjson'
const OPTIONS_PATH = 'fixtures/options.cjs'
const CONTEXT_PATH = 'fixtures/context.json'

describe('conventional-changelog-writer', () => {
  describe('cli', () => {
    let testTools

    beforeAll(() => {
      testTools = new TestTools(__dirname)
    })

    it('should work without context and options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toBeTruthy()
    })

    it('should take context', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-c', CONTEXT_PATH, COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toContain('This is a title')
      expect(stdout).toContain('2015 March 14')
    })

    it('should take absolute context path', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-c', path.join(__dirname, CONTEXT_PATH), COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toContain('This is a title')
      expect(stdout).toContain('2015 March 14')
    })

    it('should take options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-o', OPTIONS_PATH, COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toBe('template')
    })

    it('should take absolute options path', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-o', path.join(__dirname, OPTIONS_PATH), COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toBe('template')
    })

    it('should take both context and options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-o', OPTIONS_PATH, '-c', CONTEXT_PATH, COMMITS_PATH], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stdout).toBe('dodge date :D\ntemplate')
    })

    it('should work if it is not tty', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-o', OPTIONS_PATH, '-c', CONTEXT_PATH], {
        stdio: [fs.openSync(path.join(__dirname, COMMITS_PATH), 'r'), null, null, 'ipc']
      })

      expect(stdout).toBe('dodge date :D\ntemplate')
    })

    it('should error when there is no commit input', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stderr).toBe('You must specify at least one line delimited json file\n')
    })

    it('should error when options file doesnt exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['-o', 'nofile'], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stderr).toContain('Failed to get options from file nofile\n')
    })

    it('should error when context file doesnt exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['--context', 'nofile'], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stderr).toContain('Failed to get context from file nofile\n')
    })

    it('should error when commit input files dont exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['nofile', 'fakefile'], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stderr).toContain('Failed to read file nofile\n')
      expect(stderr).toContain('Failed to read file fakefile\n')
    })

    it('should error when commit input file is invalid line delimited json', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['fixtures/invalid_line_delimited.json'], {
        env: {
          FORCE_STDIN_TTY: '1'
        }
      })

      expect(stderr).toContain('Failed to split commits in file fixtures/invalid_line_delimited.json\n')
    })

    it('should error when commit input file is invalid line delimited json if it is not tty', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [], {
        stdio: [fs.openSync(path.join(__dirname, 'fixtures/invalid_line_delimited.json'), 'r'), null, null, 'ipc']
      })

      expect(stderr).toContain('Failed to split commits\n')
    })
  })
})
