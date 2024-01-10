import { describe, beforeAll, it, expect } from 'vitest'
import { TestTools, toArray, delay } from '../../../tools/test-tools.js'
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

      it('should honour `options.from`', async () => {
        const commitsStream = client.getRawCommits({
          from: 'HEAD~1'
        })
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining([expect.stringContaining(': ')]))
        expect(commits).toHaveLength(1)
      })

      it('should honour `options.to`', async () => {
        const commitsStream = client.getRawCommits({
          to: 'HEAD^'
        })
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining([expect.stringContaining(': ')]))
        expect(commits).toHaveLength(19)
      })

      it('should honour `options.format`', async () => {
        const commitsStream = client.getRawCommits({
          format: 'what%n%B'
        })
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining(
          [expect.stringContaining('what\n'), expect.stringContaining(': ')]
        ))
      })

      it('should allow commits to be scoped to a specific directory', async () => {
        testTools.mkdirSync('./packages/foo', {
          recursive: true
        })
        testTools.writeFileSync('./packages/foo/test1', '')
        testTools.exec('git add --all && git commit -m"feat(foo): add test1"')

        const commitsStream = client.getRawCommits({
          path: 'packages/foo'
        })
        const commits = await toArray(commitsStream)

        expect(commits).toEqual(['feat(foo): add test1\n\n'])
      })

      it('should allow commits to be scoped to a list of directories', async () => {
        testTools.mkdirSync('./packages/bar', {
          recursive: true
        })
        testTools.writeFileSync('./packages/bar/test1', '')
        testTools.exec('git add --all && git commit -m"feat(bar): add test1"')

        const commitsStream = client.getRawCommits({
          path: ['packages/foo', 'packages/bar']
        })
        const commits = await toArray(commitsStream)

        expect(commits).toEqual(['feat(bar): add test1\n\n', 'feat(foo): add test1\n\n'])
      })

      it('should prevent variable expansion on Windows', async () => {
        const commitsStream = client.getRawCommits({
          format: '%%cd%n%B'
        })
        const commits = await toArray(commitsStream)

        expect(commits).toMatchObject(expect.arrayContaining(
          [expect.stringContaining('%cd\n'), expect.stringContaining(': ')]
        ))
      })

      it('should pass raw args', async () => {
        await delay(1000)

        const now = new Date().toISOString()

        testTools.writeFileSync('test2', 'hello')
        testTools.exec('git add --all && git commit -m"chore: hello"')

        const commitsStream = client.getRawCommits({
          since: now
        })
        const commits = await toArray(commitsStream)

        expect(commits).toEqual(['chore: hello\n\n'])
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
