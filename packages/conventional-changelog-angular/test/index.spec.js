import path from 'path'
import { afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
let testTools

setups([
  () => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('./package.json', JSON.stringify({
      name: 'conventional-changelog',
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

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('first build setup')
    expect(chunks[0]).toContain('**travis:** add TravisCI pipeline')
    expect(chunks[0]).toContain('**travis:** Continuously integrated.')
    expect(chunks[0]).toContain('amazing new module')
    expect(chunks[0]).toContain('**compile:** avoid a bug')
    expect(chunks[0]).toContain('make it faster')
    expect(chunks[0]).toContain(', closes [#1](https://github.com/conventional-changelog/conventional-changelog/issues/1) [#2](https://github.com/conventional-changelog/conventional-changelog/issues/2)')
    expect(chunks[0]).toContain('New build system.')
    expect(chunks[0]).toContain('Not backward compatible.')
    expect(chunks[0]).toContain('**compile:** The Change is huge.')
    expect(chunks[0]).toContain('Build System')
    expect(chunks[0]).toContain('Continuous Integration')
    expect(chunks[0]).toContain('Features')
    expect(chunks[0]).toContain('Bug Fixes')
    expect(chunks[0]).toContain('Performance Improvements')
    expect(chunks[0]).toContain('Reverts')
    expect(chunks[0]).toContain('bad commit')
    expect(chunks[0]).toContain('BREAKING CHANGE')

    expect(chunks[0]).not.toContain('ci')
    expect(chunks[0]).not.toContain('feat')
    expect(chunks[0]).not.toContain('fix')
    expect(chunks[0]).not.toContain('perf')
    expect(chunks[0]).not.toContain('revert')
    expect(chunks[0]).not.toContain('***:**')
    expect(chunks[0]).not.toContain(': Not backward compatible.')

    expect(chunks.length).toBe(1)
  })

  it('should replace #[0-9]+ with GitHub issue URL', async () => {
    preparing(2)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')

    expect(chunks.length).toBe(1)
  })

  it('should remove the issues that already appear in the subject', async () => {
    preparing(3)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
    expect(chunks[0]).not.toContain('closes [#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')

    expect(chunks.length).toBe(1)
  })

  it('should replace @username with GitHub user URL', async () => {
    preparing(4)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[@bcoe](https://github.com/bcoe)')

    expect(chunks.length).toBe(1)
  })

  it('should not discard commit if there is BREAKING CHANGE', async () => {
    preparing(5)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('Continuous Integration')
    expect(chunks[0]).toContain('Build System')
    expect(chunks[0]).toContain('Documentation')
    expect(chunks[0]).toContain('Styles')
    expect(chunks[0]).toContain('Code Refactoring')
    expect(chunks[0]).toContain('Tests')

    expect(chunks.length).toBe(1)
  })

  it('should work if there is a semver tag', async () => {
    preparing(6)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .options({
        outputUnreleased: true
      })
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('some more features')
    expect(chunks[0]).not.toContain('BREAKING')

    expect(chunks.length).toBe(1)
  })

  it('should work with unknown host', async () => {
    preparing(6)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage(path.join(__dirname, 'fixtures/_unknown-host.json'))
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('(http://unknown/compare')
    expect(chunks[0]).toContain('](http://unknown/commits/')

    expect(chunks.length).toBe(1)
  })

  it('should work specifying where to find a package.json using conventional-changelog', async () => {
    preparing(7)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage(path.join(__dirname, 'fixtures/_known-host.json'))
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('(https://github.com/conventional-changelog/example/compare')
    expect(chunks[0]).toContain('](https://github.com/conventional-changelog/example/commit/')
    expect(chunks[0]).toContain('](https://github.com/conventional-changelog/example/issues/')

    expect(chunks.length).toBe(1)
  })

  it('should fallback to the closest package.json when not providing a location for a package.json', async () => {
    preparing(7)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('(https://github.com/conventional-changelog/conventional-changelog/compare')
    expect(chunks[0]).toContain('](https://github.com/conventional-changelog/conventional-changelog/commit/')
    expect(chunks[0]).toContain('](https://github.com/conventional-changelog/conventional-changelog/issues/')

    expect(chunks.length).toBe(1)
  })

  it('should support non public GitHub repository locations', async () => {
    preparing(7)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage(path.join(__dirname, 'fixtures/_ghe-host.json'))
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('(https://github.internal.example.com/dlmr')
    expect(chunks[0]).toContain('(https://github.internal.example.com/conventional-changelog/internal/compare')
    expect(chunks[0]).toContain('](https://github.internal.example.com/conventional-changelog/internal/commit/')
    expect(chunks[0]).toContain('5](https://github.internal.example.com/conventional-changelog/internal/issues/5')
    expect(chunks[0]).toContain(' closes [#10](https://github.internal.example.com/conventional-changelog/internal/issues/10)')

    expect(chunks.length).toBe(1)
  })

  it('should only replace with link to user if it is a username', async () => {
    preparing(8)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).not.toContain('(https://github.com/5')
    expect(chunks[0]).toContain('(https://github.com/username')

    expect(chunks[0]).not.toContain('[@dummy](https://github.com/dummy)/package')
    expect(chunks[0]).toContain('bump @dummy/package from')

    expect(chunks.length).toBe(1)
  })

  it('should parse both default (Revert "<subject>") and custom (revert: <subject>) revert commits', async () => {
    preparing(9)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toMatch('custom revert format')
    expect(chunks[0]).toMatch('default revert format')

    expect(chunks.length).toBe(1)
  })
})
