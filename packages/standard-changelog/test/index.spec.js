import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/test-tools.ts'
import standardChangelog from '../index.js'

let testTools

describe('standard-changelog', () => {
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
    let i = 0

    for await (let chunk of standardChangelog({
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('Features')

      i++
    }

    expect(i).toBe(1)
  })
})
