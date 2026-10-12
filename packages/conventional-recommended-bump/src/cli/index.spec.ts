import path from 'path'
import {
  describe,
  beforeAll,
  afterAll,
  it,
  expect
} from 'vitest'
import { TestTools } from '../../../../tools/index.js'

const CLI_PATH = path.join(__dirname, './index.ts')

describe('conventional-recommended-bump', () => {
  describe('cli', () => {
    let testTools: TestTools

    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInit()
      testTools.gitCommit('feat - add login')
    })

    afterAll(() => {
      testTools?.cleanup()
    })

    it('should use parser options', async () => {
      const { stdout } = await testTools.fork(CLI_PATH, [
        '-p',
        'conventionalcommits',
        '-h',
        '^(\\w*) - (.*)$',
        '-c',
        'type, subject'
      ])

      expect(stdout).toBe('minor\n')
    })
  }, 15_000)
})
