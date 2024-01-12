import path from 'path'
import { afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/index.ts'
import preset, { DEFAULT_COMMIT_TYPES } from '../index.js'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
let testTools

setups([
  () => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('package.json', JSON.stringify({
      name: 'conventional-changelog-core',
      repository: {
        type: 'git',
        url: 'https://github.com/conventional-changelog/conventional-changelog.git'
      }
    }))
    testTools.gitCommit(['build!: first build setup', 'BREAKING CHANGE: New build system.'])
    testTools.gitCommit(['ci(travis): add TravisCI pipeline', 'BREAKING CHANGE: Continuously integrated.'])
    testTools.gitCommit(['Feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    testTools.gitCommit(['Fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit(['perf(ngOptions): make it faster', ' closes #1, #2'])
    testTools.gitCommit(['fix(changelog): proper issue links', ' see #1, conventional-changelog/standard-version#358'])
    testTools.gitCommit('revert(ngOptions): bad commit')
    testTools.gitCommit('fix(*): oops')
    testTools.gitCommit(['fix(changelog): proper issue links', ' see GH-1'])
    testTools.gitCommit(['feat(awesome): adress EXAMPLE-1'])
    testTools.gitCommit(['chore(deps): upgrade example from 1 to 2'])
    testTools.gitCommit(['chore(release): release 0.0.0'])
  },
  () => {
    testTools.gitCommit(['feat(awesome): addresses the issue brought up in #133'])
    testTools.gitCommit(['feat(awesome): addresses the issue brought up in #1a2b'])
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
    testTools.gitCommit(['test(*)!: more tests', 'BREAKING CHANGE: The Change is huge.'])
  },
  () => {
    testTools.exec('git tag v0.1.0')
    testTools.gitCommit('feat: some more feats')
  },
  () => {
    testTools.exec('git tag v0.2.0')
    testTools.gitCommit('feature: some more features')
  },
  () => {
    testTools.gitCommit(['feat(*): implementing #5 by @dlmr', ' closes #10'])
  },
  () => {
    testTools.gitCommit(['fix: use npm@5 (@username)'])
    testTools.gitCommit(['build(deps): bump @dummy/package from 7.1.2 to 8.0.0', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitCommit([
      'feat: complex new feature',
      'this is a complex new feature with many reviewers',
      'Reviewer: @hutson',
      'Fixes: #99',
      'Refs: #100',
      'BREAKING CHANGE: this completely changes the API'
    ])
    testTools.gitCommit(['FEAT(foo)!: incredible new flag FIXES: #33'])
  },
  () => {
    testTools.gitCommit(['Revert \\"feat: default revert format\\"', 'This reverts commit 1234.'])
    testTools.gitCommit(['revert: feat: custom revert format', 'This reverts commit 5678.'])
  },
  () => {
    testTools.gitCommit([
      'chore: release at different version',
      'Release-As: v3.0.2'
    ])
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

afterAll(() => {
  testTools?.cleanup()
})

describe('conventional-changelog-conventionalcommits', () => {
  it('should work if there is no semver tag', async () => {
    preparing(1)

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

      // CHANGELOG should group sections in order of importance:
      expect(
        chunk.indexOf('BREAKING CHANGE') < chunk.indexOf('Features') &&
        chunk.indexOf('Features') < chunk.indexOf('Bug Fixes') &&
        chunk.indexOf('Bug Fixes') < chunk.indexOf('Performance Improvements') &&
        chunk.indexOf('Performance Improvements') < chunk.indexOf('Reverts')
      ).toBe(true)
    }
  })

  it('should not list breaking change twice if ! is used', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).not.toMatch(/\* first build setup\r?\n/)
    }
  })

  it('should allow alternative "types" configuration to be provided', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        types: []
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('first build setup')
      expect(chunk).toContain('**travis:** add TravisCI pipeline')
      expect(chunk).toContain('**travis:** Continuously integrated.')
      expect(chunk).toContain('amazing new module')
      expect(chunk).toContain('**compile:** avoid a bug')
      expect(chunk).toContain('Feat')

      expect(chunk).not.toContain('make it faster')
      expect(chunk).not.toContain('Reverts')
    }
  })

  it('should allow matching "scope" to configuration', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        types: [
          { type: 'chore', scope: 'deps', section: 'Dependencies' }
        ]
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('### Dependencies')
      expect(chunk).toContain('**deps:** upgrade example from 1 to 2')

      expect(chunk).not.toContain('release 0.0.0')
    }
  })

  it('should handle alternative "types" configuration', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        types: DEFAULT_COMMIT_TYPES.map((commitType) => (
          commitType.type === 'chore'
            ? { ...commitType, hidden: false }
            : commitType
        ))
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('### Miscellaneous Chores')
      expect(chunk).toContain('**deps:** upgrade example from 1 to 2')

      expect(chunk).toContain('### Performance Improvements')
      expect(chunk).toContain('**ngOptions:** make it faster')
    }
  })

  it('should properly format external repository issues', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#1](https://github.com/conventional-changelog/conventional-changelog/issues/1)')
      expect(chunk).toContain('[conventional-changelog/standard-version#358](https://github.com/conventional-changelog/standard-version/issues/358)')
    }
  })

  it('should properly format external repository issues given an `issueUrlFormat`', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        issuePrefixes: ['#', 'GH-'],
        issueUrlFormat: 'issues://{{repository}}/issues/{{id}}'
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#1](issues://conventional-changelog/issues/1)')
      expect(chunk).toContain('[conventional-changelog/standard-version#358](issues://standard-version/issues/358)')
      expect(chunk).toContain('[GH-1](issues://conventional-changelog/issues/1)')
    }
  })

  it('should properly format issues in external issue tracker given an `issueUrlFormat` with `prefix`', async () => {
    preparing(1)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        issueUrlFormat: 'https://example.com/browse/{{prefix}}{{id}}',
        issuePrefixes: ['EXAMPLE-']
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[EXAMPLE-1](https://example.com/browse/EXAMPLE-1)')
    }
  })

  it('should replace #[a-z0-9]+ with issue URL by default', async () => {
    preparing(2)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')
      expect(chunk).toContain('[#1a2b](https://github.com/conventional-changelog/conventional-changelog/issues/1a2b)')
    }
  })

  it('should remove the issues that already appear in the subject', async () => {
    preparing(3)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
      expect(chunk).not.toContain('closes [#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
    }
  })

  it('should replace @user with configured userUrlFormat', async () => {
    preparing(4)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        userUrlFormat: 'https://foo/{{user}}'
      })
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('[@bcoe](https://foo/bcoe)')
    }
  })

  it('should not discard commit if there is BREAKING CHANGE', async () => {
    preparing(5)

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
    }
  })

  it('should omit optional ! in breaking commit', async () => {
    preparing(5)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('### Tests')
      expect(chunk).toContain('* more tests')
    }
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

      expect(chunk).toContain('some more feats')
      expect(chunk).not.toContain('BREAKING')
      i++
    }

    expect(i).toBe(1)
  })

  it('should support "feature" as alias for "feat"', async () => {
    preparing(7)
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
    preparing(7)
    let i = 0

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset({
        commitUrlFormat: 'http://unknown/commit/{{hash}}',
        compareUrlFormat: 'http://unknown/compare/{{previousTag}}...{{currentTag}}'
      }),
      pkg: {
        path: path.join(__dirname, 'fixtures/_unknown-host.json')
      }
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('(http://unknown/compare')
      expect(chunk).toContain('](http://unknown/commit/')
      i++
    }

    expect(i).toBe(1)
  })

  it('should work specifying where to find a package.json using conventional-changelog-core', async () => {
    preparing(8)
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
    preparing(8)
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
    preparing(8)

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
    }
  })

  it('should only replace with link to user if it is an username', async () => {
    preparing(9)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).not.toContain('(https://github.com/5')
      expect(chunk).toContain('(https://github.com/username')

      expect(chunk).not.toContain('[@dummy](https://github.com/dummy)/package')
      expect(chunk).toContain('bump @dummy/package from')
    }
  })

  it('supports multiple lines of footer information', async () => {
    preparing(9)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('closes [#99]')
      expect(chunk).toContain('[#100]')
      expect(chunk).toContain('this completely changes the API')
    }
  })

  it('does not require that types are case sensitive', async () => {
    preparing(9)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toContain('incredible new flag')
    }
  })

  it('populates breaking change if ! is present', async () => {
    preparing(9)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toMatch(/incredible new flag FIXES: #33\r?\n/)
    }
  })

  it('parses both default (Revert "<subject>") and custom (revert: <subject>) revert commits', async () => {
    preparing(10)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toMatch(/custom revert format/)
      expect(chunk).toMatch(/default revert format/)
    }
  })

  it('should include commits with "Release-As:" footer in CHANGELOG', async () => {
    preparing(11)

    for await (let chunk of conventionalChangelogCore({
      cwd: testTools.cwd,
      config: preset
    })) {
      chunk = chunk.toString()

      expect(chunk).toMatch(/release at different version/)
    }
  })
})
