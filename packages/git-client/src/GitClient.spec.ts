import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools, toArray } from '../../../tools/test-tools.js'
import { GitClient } from './GitClient.js'

describe('git-client', () => {
  describe('GitClient', () => {
    let testTools: TestTools
    let client: GitClient

    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInitSimpleRepository()

      client = new GitClient(testTools.cwd)
    })

    describe('getRawCommits', () => {
      it('should get raw git commits', async () => {
        const commitsStream = client.getRawCommits()
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining([expect.stringContaining(': ')]))
      })
    })

    describe('getTags', () => {
      it('should get tags list', async () => {
        const tagsStream = client.getTags()
        const tags = await toArray(tagsStream)

        expect(tags).toMatchObject(expect.arrayContaining([expect.stringMatching(/^v\d+\.\d+\.\d+$/)]))
      })
    })

    describe('getCurrentBranch', () => {
      it('should get current branch name', async () => {
        expect(await client.getCurrentBranch()).toBe('master')
      })
    })
  })
})
