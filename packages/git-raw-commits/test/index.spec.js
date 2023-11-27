import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools, delay } from '../../../tools/test-tools.ts'
import gitRawCommits from '../index.js'

let testTools

describe('git-raw-commits', () => {
  beforeAll(() => {
    testTools = new TestTools()
    testTools.gitInit()
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should emit an error and the error should not be read only if there are no commits', async () => {
    await expect(async () => {
      for await (const commit of gitRawCommits({}, {
        cwd: testTools.cwd
      })) {
        commit.toString()
      }
    }).rejects.toThrow()
  })

  it('should execute the command without error', async () => {
    testTools.mkdirSync('./packages/foo', { recursive: true })
    testTools.writeFileSync('./packages/foo/test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
    testTools.writeFileSync('test2', '')
    testTools.exec('git add --all && git commit -m"Second commit"')
    testTools.writeFileSync('test3', '')
    testTools.exec('git add --all && git commit -m"Third commit"')

    for await (const commit of gitRawCommits({}, {
      cwd: testTools.cwd
    })) {
      commit.toString()
    }
  })

  it('should get commits without `options` (`options.from` defaults to the first commit)', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({}, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('Third commit\n\n')
      } else if (i === 1) {
        expect(chunk).toBe('Second commit\n\n')
      } else {
        expect(chunk).toBe('First commit\n\n')
      }

      i++
    }

    expect(i).toBe(3)
  })

  it('should honour `options.from`', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({
      from: 'HEAD~1'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      expect(chunk).toBe('Third commit\n\n')

      i++
    }

    expect(i).toBe(1)
  })

  it('should honour `options.to`', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({
      to: 'HEAD^'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('Second commit\n\n')
      } else {
        expect(chunk).toBe('First commit\n\n')
      }

      i++
    }

    expect(i).toBe(2)
  })

  it('should honour `options.ignore`', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({
      ignore: 'Second'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('Third commit\n\n')
      } else {
        expect(chunk).toBe('First commit\n\n')
      }

      i++
    }

    expect(i).toBe(2)
  })

  it('should honour `options.format`', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({
      format: 'what%n%B'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('what\nThird commit\n\n')
      } else if (i === 1) {
        expect(chunk).toBe('what\nSecond commit\n\n')
      } else {
        expect(chunk).toBe('what\nFirst commit\n\n')
      }

      i++
    }

    expect(i).toBe(3)
  })

  it('should allow commits to be scoped to a specific directory', async () => {
    let i = 0
    let output = ''

    for await (let chunk of gitRawCommits({
      path: './packages/foo'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      output += chunk
      i++
    }

    expect(i).toBe(1)
    expect(output).toMatch(/First commit/)
    expect(output).not.toMatch(/Second commit/)
  })

  it('should allow commits to be scoped to a list of directories', async () => {
    let i = 0
    let output = ''

    for await (let chunk of gitRawCommits({
      path: ['./packages/foo', './test2']
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      output += chunk
      i++
    }

    expect(i).toBe(2)
    expect(output).toMatch(/First commit/)
    expect(output).toMatch(/Second commit/)
    expect(output).not.toMatch(/Third commit/)
  })

  it('should show your git-log command', async () => {
    let cmd = ''

    for await (let chunk of gitRawCommits({
      format: 'what%n%B',
      debug (message) {
        cmd = message
      }
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()
    }

    expect(cmd).toContain('Your git-log command is:\ngit log --format')
  })

  it('should prevent variable expansion on Windows', async () => {
    let i = 0

    for await (let chunk of gitRawCommits({
      format: '%%cd%n%B'
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('%cd\nThird commit\n\n')
      } else if (i === 1) {
        expect(chunk).toBe('%cd\nSecond commit\n\n')
      } else {
        expect(chunk).toBe('%cd\nFirst commit\n\n')
      }

      i++
    }

    expect(i).toBe(3)
  })

  it('should allow commits to be scoped to a specific directory and specific date range', async () => {
    // Since milliseconds are ignored (https://git-scm.com/docs/git-commit#Documentation/git-commit.txt-ISO8601),
    // A one-second delay ensures that new commits are filtered (https://www.git-scm.com/docs/git-log#Documentation/git-log.txt---sinceltdategt)
    await delay(1000)

    const now = new Date().toISOString()
    let i = 0

    testTools.writeFileSync('./packages/foo/test1', 'hello')
    testTools.exec('git add --all && git commit -m"Fourth commit"')
    testTools.writeFileSync('test2', 'hello')
    testTools.exec('git add --all && git commit -m"Fifth commit"')

    for await (let chunk of gitRawCommits({
      path: './packages/foo',
      since: now
    }, {
      cwd: testTools.cwd
    })) {
      chunk = chunk.toString()

      if (i === 0) {
        expect(chunk).toBe('Fourth commit\n\n')
      }

      i++
    }

    expect(i).toBe(1)
  })
})
