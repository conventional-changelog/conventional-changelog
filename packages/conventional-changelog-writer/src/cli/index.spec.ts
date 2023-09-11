import fs from 'fs'
import path from 'path'
import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools } from '../../../../tools/test-tools.js'

const CLI_PATH = path.join(__dirname, './index.ts')
const FIXTURES_RELATIVE_PATH = path.join('..', '..', 'test', 'fixtures')
const FIXTURES_ABSOLUTE_PATH = path.resolve(__dirname, FIXTURES_RELATIVE_PATH)
const COMMITS_RELATIVE_PATH = path.join(FIXTURES_RELATIVE_PATH, 'commits.ldjson')
const OPTIONS_RELATIVE_PATH = path.join(FIXTURES_RELATIVE_PATH, 'options.cjs')
const CONTEXT_RELATIVE_PATH = path.join(FIXTURES_RELATIVE_PATH, 'context.json')
const COMMITS_ABSOLUTE_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'commits.ldjson')
const OPTIONS_ABSOLUTE_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'options.cjs')
const CONTEXT_ABSOLUTE_PATH = path.join(FIXTURES_ABSOLUTE_PATH, 'context.json')

describe('conventional-changelog-writer', () => {
  describe('cli', () => {
    let testTools: TestTools

    beforeAll(() => {
      testTools = new TestTools(__dirname)
    })

    it('should work without context and options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [COMMITS_RELATIVE_PATH])

      expect(stdout).toBeTruthy()
    })

    it('should take context', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-c',
        CONTEXT_RELATIVE_PATH,
        COMMITS_RELATIVE_PATH
      ])

      expect(stdout).toContain('This is a title')
      expect(stdout).toContain('2015 March 14')
    })

    it('should take absolute context path', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-c',
        CONTEXT_ABSOLUTE_PATH,
        COMMITS_RELATIVE_PATH
      ])

      expect(stdout).toContain('This is a title')
      expect(stdout).toContain('2015 March 14')
    })

    it('should take options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-o',
        OPTIONS_RELATIVE_PATH,
        COMMITS_RELATIVE_PATH
      ])

      expect(stdout).toBe('template')
    })

    it('should take absolute options path', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-o',
        OPTIONS_ABSOLUTE_PATH,
        COMMITS_RELATIVE_PATH
      ])

      expect(stdout).toBe('template')
    })

    it('should take both context and options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-o',
        OPTIONS_RELATIVE_PATH,
        '-c',
        CONTEXT_RELATIVE_PATH,
        COMMITS_RELATIVE_PATH
      ])

      expect(stdout).toBe('dodge date :D\ntemplate')
    })

    it('should work if it is not tty', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-o',
        OPTIONS_RELATIVE_PATH,
        '-c',
        CONTEXT_RELATIVE_PATH
      ], {
        stdio: [
          fs.openSync(COMMITS_ABSOLUTE_PATH, 'r'),
          null,
          null,
          'ipc'
        ]
      })

      expect(stdout).toBe('dodge date :D\ntemplate')
    })

    it('should error when options file doesnt exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['-o', 'nofile'])

      expect(stderr).toContain('Failed to get options from file nofile')
    })

    it('should error when context file doesnt exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['--context', 'nofile'])

      expect(stderr).toContain('Failed to get context from file nofile')
    })

    it('should error when commit input files dont exist', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, ['nofile', 'fakefile'])

      expect(stderr).toContain('Failed to read file nofile')
      expect(stderr).toContain('Failed to read file fakefile')
    })

    it('should error when commit input file is invalid line delimited json if it is not tty', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [], {
        stdio: [
          fs.openSync(path.join(FIXTURES_ABSOLUTE_PATH, 'invalid_line_delimited.json'), 'r'),
          null,
          null,
          'ipc'
        ]
      })

      expect(stderr).toContain('Failed to split commits\n')
    })
  })
})
