import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import {
  TestTools,
  toArray
} from '../../../tools/index.js'
import { StandardChangelog } from './index.js'

let testTools: TestTools

describe('standard-changelog', () => {
  describe('StandardChangelog', () => {
    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInit()
      testTools.writeFileSync('test1', '')
      testTools.exec('git add --all && git commit -m"feat: first commit"')
    })

    afterAll(() => {
      testTools?.cleanup()
    })

    it('should generate angular changelog', async () => {
      const log = new StandardChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks[0]).toContain('Features')
      expect(chunks.length).toBe(1)
    })
  })
})
