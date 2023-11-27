import fs from 'fs/promises'
import path from 'path'
import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools } from '../../../../tools/test-tools.js'

const CLI_PATH = path.join(__dirname, './index.ts')
const FIXTURES_PATH = path.resolve(__dirname, '..', '..', 'test', 'fixtures')

describe('conventional-commits-parser', () => {
  describe('cli', () => {
    let testTools: TestTools

    beforeAll(() => {
      testTools = new TestTools(FIXTURES_PATH)
    })

    it('should parse commits in a file', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [path.join(FIXTURES_PATH, 'log1.txt')])

      expect(stdout).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
    })

    it('should work with a separator', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        path.join(FIXTURES_PATH, 'log2.txt'),
        '-s',
        '==='
      ])

      expect(stdout).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
      expect(stdout).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
    })

    it('should work with two files', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        path.join(FIXTURES_PATH, 'log1.txt'),
        path.join(FIXTURES_PATH, 'log2.txt'),
        '-s',
        '==='
      ])

      expect(stdout).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
      expect(stdout).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
      expect(stdout).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
    })

    it('should error if files cannot be found', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [
        path.join(FIXTURES_PATH, 'log1.txt'),
        path.join(FIXTURES_PATH, 'log4.txt'),
        path.join(FIXTURES_PATH, 'log2.txt'),
        path.join(FIXTURES_PATH, 'log5.txt'),
        '-s',
        '==='
      ])

      expect(stderr).toContain(`Failed to read file ${path.join(FIXTURES_PATH, 'log4.txt')}`)
      expect(stderr).toContain(`Failed to read file ${path.join(FIXTURES_PATH, 'log5.txt')}`)
    })

    it('should work with options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        path.join(FIXTURES_PATH, 'log3.txt'),
        '-p',
        '^(\\w*)(?:\\(([:\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$',
        '--reference-actions',
        'close, fix',
        '-n',
        'BREAKING NEWS',
        '--headerCorrespondence',
        'scope, type,subject '
      ])
      const data = JSON.parse(stdout)[0]

      expect(data.scope).toBe('category')
      expect(data.type).toBe('fix:subcategory')
      expect(data.subject).toBe('My subject')

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
    })

    it('should work if it is not a tty', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [], {
        stdio: [
          (await fs.open(path.join(FIXTURES_PATH, 'log1.txt'), 'r')).fd,
          null,
          null,
          'ipc'
        ]
      })

      expect(stdout).toContain('"type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution"')
    })

    it('should separate if it is not a tty', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, ['-s', '==='], {
        stdio: [
          (await fs.open(path.join(FIXTURES_PATH, 'log2.txt'), 'r')).fd,
          null,
          null,
          'ipc'
        ]
      })

      expect(stdout).toContain('"type":"docs","scope":"ngMessageExp","subject":"split ngMessage docs up to show its alias more clearly"')
      expect(stdout).toContain('"type":"fix","scope":"$animate","subject":"applyStyles from options on leave"')
    })

    it('should error if it is not a tty and commit cannot be parsed', async () => {
      const { stderr } = await testTools.fork(CLI_PATH, [], {
        stdio: [
          (await fs.open(path.join(FIXTURES_PATH, 'bad_commit.txt'), 'r')).fd,
          null,
          null,
          'ipc'
        ]
      })

      expect(stderr).toContain('TypeError: Expected a raw commit\n')
    })
  })
})
