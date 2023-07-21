import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools, through } from '../../../tools/test-tools'
import standardChangelog from '../'

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

  it('should generate angular changelog', () => {
    return new Promise((resolve, reject) => {
      let i = 0

      standardChangelog({
        cwd: testTools.cwd
      })
        .on('error', reject)
        .pipe(
          through((chunk, enc, cb) => {
            chunk = chunk.toString()

            expect(chunk).toContain('Features')

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
