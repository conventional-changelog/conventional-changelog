import path from 'path'
import { afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/index.ts'
import preset from '../src/index.js'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
let testTools

setups([
  () => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('./package.json', JSON.stringify({
      name: 'conventional-changelog-core',
      repository: {
        type: 'git',
        url: 'https://github.com/conventional-changelog/conventional-changelog.git'
      }
    }))

    testTools.gitCommit(['build: first build setup', 'BREAKING CHANGE: New build system.'])
    testTools.gitCommit(['ci(travis): add TravisCI pipeline', 'BREAKING CHANGE: Continuously integrated.'])
    testTools.gitCommit(['feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    testTools.gitCommit(['fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['perf(ngOptions): make it faster', ' closes #1, #2'])
    testTools.gitCommit('revert(ngOptions): bad commit')
    testTools.gitCommit('fix(*): oops')
  },
  () => {
    testTools.gitCommit(['feat(awesome): addresses the issue brought up in #133'])
  },
  () => {
    testTools.gitCommit(['feat(awesome): fix #88'])
  },
  () => {
    testTools.gitCommit(['feat(awesome): issue brought up by @bcoe! on Friday'])
  },
  () => {
    testTools.gitCommit(['build(npm): edit build script', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['ci(travis): setup travis', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['docs(readme): make it clear', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['style(whitespace): make it easier to read', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['refactor(code): change a lot of code', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['test(*): more tests', 'BREAKING CHANGE: The Change is huge.'])
  },
  () => {
    testTools.exec('git tag v1.0.0')
    testTools.gitCommit('feat: some more features')
  },
  () => {
    testTools.gitCommit(['feat(*): implementing #5 by @dlmr', ' closes #10'])
  },
  () => {
    testTools.gitCommit(['fix: use npm@5 (@username)'])
    testTools.gitCommit(['build(deps): bump @dummy/package from 7.1.2 to 8.0.0', 'BREAKING CHANGE: The Change is huge.'])
  },
  () => {
    testTools.gitCommit(['Revert \\"feat: default revert format\\"', 'This reverts commit 1234567.'])
    testTools.gitCommit(['revert: feat: custom revert format', 'This reverts commit 5678910.'])
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

afterAll(() => {
  testTools?.cleanup()
})

describe('conventional-changelog-angular', () => {
  it('should work if there is no semver tag', async () => {
    preparing(1)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('first build setup')
      expect(chunk).toContain('**travis:** add TravisCI pipeline')
      expect(chunk).toContain('**travis:** Continuously integrated.')
      expect(chunk).toContain('amazing new module')
      expect(chunk).toContain('**compile:** avoid a bug')
      expect(chunk).toContain('make it faster')
      expect(chunk).toContain(', closes [#1](https://github.com/conventional-changelog/conventional-changelog/issues/1) [#2](https://github.com/conventional-changelog/conventional-changelog/issues/2)')
      expect(chunk).toContain('New build system.')
      expect(chunk).toContain('Not backward compatible.')
      expect(chunk).toContain('**compile:** The Change is huge.')
      expect(chunk).toContain('Build System')
      expect(chunk).toContain('Continuous Integration')
      expect(chunk).toContain('Features')
      expect(chunk).toContain('Bug Fixes')
      expect(chunk).toContain('Performance Improvements')
      expect(chunk).toContain('Reverts')
      expect(chunk).toContain('bad commit')
      expect(chunk).toContain('BREAKING CHANGE')

      expect(chunk).not.toContain('ci')
      expect(chunk).not.toContain('feat')
      expect(chunk).not.toContain('fix')
      expect(chunk).not.toContain('perf')
      expect(chunk).not.toContain('revert')
      expect(chunk).not.toContain('***:**')
      expect(chunk).not.toContain(': Not backward compatible.')
      i++
    }

    expect(i).toBe(1)
  })

  it('should replace #[0-9]+ with GitHub issue URL', async () => {
    preparing(2)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')
      i++
    }

    expect(i).toBe(1)
  })

  it('should remove the issues that already appear in the subject', async () => {
    preparing(3)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
      expect(chunk).not.toContain('closes [#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
      i++
    }

    expect(i).toBe(1)
  })

  it('should replace @username with GitHub user URL', async () => {
    preparing(4)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[@bcoe](https://github.com/bcoe)')
      i++
    }

    expect(i).toBe(1)
  })

  it('should not discard commit if there is BREAKING CHANGE', async () => {
    preparing(5)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('Continuous Integration')
      expect(chunk).toContain('Build System')
      expect(chunk).toContain('Documentation')
      expect(chunk).toContain('Styles')
      expect(chunk).toContain('Code Refactoring')
      expect(chunk).toContain('Tests')
      i++
    }

    expect(i).toBe(1)
  })

  it('should work if there is a semver tag', async () => {
    preparing(6)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset,
      outputUnreleased: true
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('some more features')
      expect(chunk).not.toContain('BREAKING')
      i++
    }

    expect(i).toBe(1)
  })

  it('should work with unknown host', async () => {
    preparing(6)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_unknown-host.json')
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('(http://unknown/compare')
      expect(chunk).toContain('](http://unknown/commits/')
      i++
    }

    expect(i).toBe(1)
  })

  it('should work specifying where to find a package.json using conventional-changelog-core', async () => {
    preparing(7)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_known-host.json')
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('(https://github.com/conventional-changelog/example/compare')
      expect(chunk).toContain('](https://github.com/conventional-changelog/example/commit/')
      expect(chunk).toContain('](https://github.com/conventional-changelog/example/issues/')
      i++
    }

    expect(i).toBe(1)
  })

  it('should fallback to the closest package.json when not providing a location for a package.json', async () => {
    preparing(7)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('(https://github.com/conventional-changelog/conventional-changelog/compare')
      expect(chunk).toContain('](https://github.com/conventional-changelog/conventional-changelog/commit/')
      expect(chunk).toContain('](https://github.com/conventional-changelog/conventional-changelog/issues/')
      i++
    }

    expect(i).toBe(1)
  })

  it('should support non public GitHub repository locations', async () => {
    preparing(7)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_ghe-host.json')
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('(https://github.internal.example.com/dlmr')
      expect(chunk).toContain('(https://github.internal.example.com/conventional-changelog/internal/compare')
      expect(chunk).toContain('](https://github.internal.example.com/conventional-changelog/internal/commit/')
      expect(chunk).toContain('5](https://github.internal.example.com/conventional-changelog/internal/issues/5')
      expect(chunk).toContain(' closes [#10](https://github.internal.example.com/conventional-changelog/internal/issues/10)')
      i++
    }

    expect(i).toBe(1)
  })

  it('should only replace with link to user if it is a username', async () => {
    preparing(8)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).not.toContain('(https://github.com/5')
      expect(chunk).toContain('(https://github.com/username')

      expect(chunk).not.toContain('[@dummy](https://github.com/dummy)/package')
      expect(chunk).toContain('bump @dummy/package from')
      i++
    }

    expect(i).toBe(1)
  })

  it('should parse both default (Revert "<subject>") and custom (revert: <subject>) revert commits', async () => {
    preparing(9)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toMatch('custom revert format')
      expect(chunk).toMatch('default revert format')
      i++
    }

    expect(i).toBe(1)
  })
})
