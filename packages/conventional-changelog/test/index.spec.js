import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools, createRunConventionalChangelog } from '../../../tools/test-tools'
import conventionalChangelog from '../'

const runConventionalChangelog = createRunConventionalChangelog(conventionalChangelog, {
  rejectOnWarn: true
})
let testTools

describe('conventional-changelog', () => {
  beforeAll(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should not warn if preset is found', async () => {
    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: 'angular'
    }, (chunk) => {
      expect(chunk).toContain('#')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should work with mixed case', async () => {
    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: 'aNgular'
    }, (chunk) => {
      expect(chunk).toContain('#')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should allow object for preset', async () => {
    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: {
        name: 'conventionalcommits'
      }
    }, (chunk) => {
      expect(chunk).toContain('#')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should warn if preset is not found', async () => {
    let warningCount = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: 'no',
      warn: (warning) => {
        if (warningCount > 0) {
          return
        }

        expect(warning).toEqual(
          'Error: Unable to load the "no" preset. Please make sure it\'s installed.'
        )

        warningCount++
      }
    }, (chunk) => {
      expect(chunk).toContain('#')
    })

    expect(warningCount).toEqual(1)
  })

  it('should still work if preset is not found', async () => {
    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: 'no',
      warn () {}
    }, (chunk) => {
      expect(chunk).toContain('#')
    })

    expect(chunks.length).toEqual(1)
  })
})
