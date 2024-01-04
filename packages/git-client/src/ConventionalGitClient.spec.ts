import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools, toArray } from '../../../tools/test-tools.js'
import { ConventionalGitClient } from './ConventionalGitClient.js'

describe('git-client', () => {
  describe('ConventionalGitClient', () => {
    let testTools: TestTools
    let client: ConventionalGitClient

    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInitSimpleRepository()

      client = new ConventionalGitClient(testTools.cwd)
    })

    describe('getCommits', () => {
      it('should parse commits', async () => {
        const commitsStream = client.getCommits()
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining([
          expect.objectContaining({
            header: expect.stringContaining(': '),
            type: expect.stringMatching(/^(chore|test|ci|feat|refactor|style|docs)$/),
            subject: expect.any(String)
          })
        ]))
      })
    })

    describe('getSemverTags', () => {
      it('should get semver tags list', async () => {
        const tagsStream = client.getSemverTags()
        const tags = await toArray(tagsStream)

        expect(tags).toMatchObject(expect.arrayContaining([expect.stringMatching(/^v\d+\.\d+\.\d+$/)]))
      })
    })
  })
})
