import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools, toArray } from '../../../tools/index.js'
import {
  ConventionalGitClient,
  packagePrefix
} from './ConventionalGitClient.js'

describe('git-client', () => {
  describe('ConventionalGitClient', () => {
    let testTools: TestTools
    let client: ConventionalGitClient

    beforeAll(() => {
      testTools = new TestTools()
      testTools.gitInitSimpleRepository()

      client = new ConventionalGitClient(testTools.cwd)
    })

    afterAll(() => {
      testTools?.cleanup()
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

        expect(tags).toEqual([
          'v18.0.0',
          'v15.0.0',
          'v12.0.0',
          'v9.0.0',
          'v6.0.0',
          'v3.0.0',
          'v0.0.0'
        ])
      })

      it('should work with prerelease', async () => {
        testTools.writeFileSync('test5', '')
        testTools.exec('git add --all && git commit -m"chore: prerelease"')
        testTools.exec('git tag 19.0.0-pre')

        const tagsStream = client.getSemverTags()
        const tags = await toArray(tagsStream)

        expect(tags).toEqual([
          '19.0.0-pre',
          'v18.0.0',
          'v15.0.0',
          'v12.0.0',
          'v9.0.0',
          'v6.0.0',
          'v3.0.0',
          'v0.0.0'
        ])
      })

      it('should work with lerna style tags', async () => {
        testTools.writeFileSync('test5', '2')
        testTools.exec('git add --all && git commit -m"chore: foo-project@4.0.0"')
        testTools.exec('git tag foo-project@4.0.0')
        testTools.writeFileSync('test5', '3')
        testTools.exec('git add --all && git commit -m"chore: bar-project@5.0.0"')
        testTools.exec('git tag bar-project@5.0.0')

        const tagsStream = client.getSemverTags({
          prefix: packagePrefix()
        })
        const tags = await toArray(tagsStream)

        expect(tags).toEqual(['bar-project@5.0.0', 'foo-project@4.0.0'])
      })

      it('should allow lerna style tags to be filtered by package', async () => {
        const tagsStream = client.getSemverTags({
          prefix: packagePrefix('foo-project')
        })
        const tags = await toArray(tagsStream)

        expect(tags).toEqual(['foo-project@4.0.0'])
      })

      it('should work with tag prefix option', async () => {
        testTools.writeFileSync('test6', '')
        testTools.exec('git add --all && git commit -m"chore: ms/6.0.0"')
        testTools.exec('git tag ms/6.0.0')
        testTools.writeFileSync('test6', '1')
        testTools.exec('git add --all && git commit -m"chore: ms/7.0.0"')
        testTools.exec('git tag ms/7.0.0')
        testTools.writeFileSync('test6', '2')
        testTools.exec('git add --all && git commit -m"chore: notms/7.0.0"')
        testTools.exec('git tag notms/7.0.0')

        const tagsStream = client.getSemverTags({
          prefix: 'ms/'
        })
        const tags = await toArray(tagsStream)

        expect(tags).toEqual(['ms/7.0.0', 'ms/6.0.0'])
      })

      it('should handle regexp escaped characters in the tag prefix', async () => {
        testTools.writeFileSync('test6', '')
        testTools.exec('git add --all && git commit -m"chore: ms+6.0.0"')
        testTools.exec('git tag ms+6.0.0')
        testTools.writeFileSync('test6', '1')
        testTools.exec('git add --all && git commit -m"chores: ms+7.0.0"')
        testTools.exec('git tag ms+7.0.0')
        testTools.writeFileSync('test6', '2')
        testTools.exec('git add --all && git commit -m"chore: notms+7.0.0"')
        testTools.exec('git tag notms+7.0.0')

        const tagsStream = client.getSemverTags({
          prefix: 'ms+'
        })
        const tags = await toArray(tagsStream)

        expect(tags).toEqual(['ms+7.0.0', 'ms+6.0.0'])
      })

      it('should skip unstable tags', async () => {
        testTools.writeFileSync('test7', '')
        testTools.exec('git add --all && git commit -m"chore: 8.0.0"')
        testTools.exec('git tag skip/8.0.0')
        testTools.writeFileSync('test8', '')
        testTools.exec('git add --all && git commit -m"chore: 9.0.0-alpha.1"')
        testTools.exec('git tag skip/9.0.0-alpha.1')
        testTools.writeFileSync('test9', '')
        testTools.exec('git add --all && git commit -m"chore: 9.0.0-rc.1"')
        testTools.exec('git tag skip/9.0.0-rc.1')
        testTools.writeFileSync('test10', '')
        testTools.exec('git add --all && git commit -m"chore: 9.0.0"')
        testTools.exec('git tag skip/9.0.0')

        const tagsStream = client.getSemverTags({
          prefix: 'skip/',
          skipUnstable: true
        })
        const tags = await toArray(tagsStream)

        expect(tags).toEqual(['skip/9.0.0', 'skip/8.0.0'])
      })
    })
  })
})
