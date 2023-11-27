import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/test-tools.ts'
import conventionalChangelog from '../index.js'

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
    let i = 0
    let warningCount = 0

    for await (let chunk of conventionalChangelog({
      cwd: testTools.cwd,
      preset: 'angular',
      warn () {
        warningCount++
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('#')
      i++
    }

    expect(i).toBe(1)
    expect(warningCount).toBe(0)
  })

  it('should work with mixed case', async () => {
    let i = 0
    let warningCount = 0

    for await (let chunk of conventionalChangelog({
      cwd: testTools.cwd,
      preset: 'aNgular',
      warn () {
        warningCount++
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('#')
      i++
    }

    expect(i).toBe(1)
    expect(warningCount).toBe(0)
  })

  it('should allow object for preset', async () => {
    let i = 0
    let warningCount = 0

    for await (let chunk of conventionalChangelog({
      cwd: testTools.cwd,
      preset: {
        name: 'conventionalcommits'
      },
      warn () {
        warningCount++
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('#')
      i++
    }

    expect(i).toBe(1)
    expect(warningCount).toBe(0)
  })

  it('should warn if preset is not found', async () => {
    let warningCount = 0

    for await (let chunk of conventionalChangelog({
      cwd: testTools.cwd,
      preset: 'no',
      warn (warning) {
        if (warningCount > 0) {
          return
        }

        expect(warning).toBe(
          'Error: Unable to load the "no" preset. Please make sure it\'s installed.'
        )

        warningCount++
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('#')
    }

    expect(warningCount).toBe(1)
  })

  it('should still work if preset is not found', async () => {
    let i = 0

    for await (let chunk of conventionalChangelog({
      cwd: testTools.cwd,
      preset: 'no'
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('#')
      i++
    }

    expect(i).toBe(1)
  })
})
