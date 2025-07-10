import path from 'path'
import { afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset, { DEFAULT_COMMIT_TYPES } from '../src/index.js'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
let testTools

setups([
  () => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('package.json', JSON.stringify({
      name: 'conventional-changelog',
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
    testTools.gitCommit(['chore: release at different version', 'Release-As: v3.0.2'])
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

    // CHANGELOG should group sections in order of importance:
    expect(
      chunks[0].indexOf('BREAKING CHANGE') < chunks[0].indexOf('Features')
      && chunks[0].indexOf('Features') < chunks[0].indexOf('Bug Fixes')
      && chunks[0].indexOf('Bug Fixes') < chunks[0].indexOf('Performance Improvements')
      && chunks[0].indexOf('Performance Improvements') < chunks[0].indexOf('Reverts')
    ).toBe(true)
  })

  it('should not list breaking change twice if ! is used', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).not.toMatch(/\* first build setup\r?\n/)
  })

  it('should allow alternative "types" configuration to be provided', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        types: []
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('first build setup')
    expect(chunks[0]).toContain('**travis:** add TravisCI pipeline')
    expect(chunks[0]).toContain('**travis:** Continuously integrated.')
    expect(chunks[0]).toContain('amazing new module')
    expect(chunks[0]).toContain('**compile:** avoid a bug')
    expect(chunks[0]).toContain('Feat')

    expect(chunks[0]).not.toContain('make it faster')
    expect(chunks[0]).not.toContain('Reverts')
  })

  it('should allow matching "scope" to configuration', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        types: [
          {
            type: 'chore',
            scope: 'deps',
            section: 'Dependencies'
          }
        ]
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('### Dependencies')
    expect(chunks[0]).toContain('**deps:** upgrade example from 1 to 2')

    expect(chunks[0]).not.toContain('release 0.0.0')
  })

  it('should handle alternative "types" configuration', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        types: DEFAULT_COMMIT_TYPES.map(commitType => (
          commitType.type === 'chore'
            ? {
              ...commitType,
              hidden: false
            }
            : commitType
        ))
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('### Miscellaneous Chores')
    expect(chunks[0]).toContain('**deps:** upgrade example from 1 to 2')

    expect(chunks[0]).toContain('### Performance Improvements')
    expect(chunks[0]).toContain('**ngOptions:** make it faster')
  })

  it('should properly format external repository issues', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[#1](https://github.com/conventional-changelog/conventional-changelog/issues/1)')
    expect(chunks[0]).toContain('[conventional-changelog/standard-version#358](https://github.com/conventional-changelog/standard-version/issues/358)')
  })

  it('should properly format external repository issues given an `issueUrlFormat`', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        issuePrefixes: ['#', 'GH-'],
        issueUrlFormat: 'issues://{{repository}}/issues/{{id}}'
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[#1](issues://conventional-changelog/issues/1)')
    expect(chunks[0]).toContain('[conventional-changelog/standard-version#358](issues://standard-version/issues/358)')
    expect(chunks[0]).toContain('[GH-1](issues://conventional-changelog/issues/1)')
  })

  it('should properly format issues in external issue tracker given an `issueUrlFormat` with `prefix`', async () => {
    preparing(1)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        issueUrlFormat: 'https://example.com/browse/{{prefix}}{{id}}',
        issuePrefixes: ['EXAMPLE-']
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[EXAMPLE-1](https://example.com/browse/EXAMPLE-1)')
  })

  it('should replace #[a-z0-9]+ with issue URL by default', async () => {
    preparing(2)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')
    expect(chunks[0]).toContain('[#1a2b](https://github.com/conventional-changelog/conventional-changelog/issues/1a2b)')
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
  })

  it('should replace @user with configured userUrlFormat', async () => {
    preparing(4)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset({
        userUrlFormat: 'https://foo/{{user}}'
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[@bcoe](https://foo/bcoe)')
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
  })

  it('should omit optional ! in breaking commit', async () => {
    preparing(5)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('### Tests')
    expect(chunks[0]).toContain('* more tests')
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

    expect(chunks[0]).toContain('some more feats')
    expect(chunks[0]).not.toContain('BREAKING')

    expect(chunks.length).toBe(1)
  })

  it('should support "feature" as alias for "feat"', async () => {
    preparing(7)

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
    preparing(7)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage(path.join(__dirname, 'fixtures/_unknown-host.json'))
      .config(preset({
        commitUrlFormat: 'http://unknown/commit/{{hash}}',
        compareUrlFormat: 'http://unknown/compare/{{previousTag}}...{{currentTag}}'
      }))
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('(http://unknown/compare')
    expect(chunks[0]).toContain('](http://unknown/commit/')

    expect(chunks.length).toBe(1)
  })

  it('should work specifying where to find a package.json using conventional-changelog', async () => {
    preparing(8)

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
    preparing(8)

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
    preparing(8)

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
  })

  it('should only replace with link to user if it is an username', async () => {
    preparing(9)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).not.toContain('(https://github.com/5')
    expect(chunks[0]).toContain('(https://github.com/username')

    expect(chunks[0]).not.toContain('[@dummy](https://github.com/dummy)/package')
    expect(chunks[0]).toContain('bump @dummy/package from')
  })

  it('supports multiple lines of footer information', async () => {
    preparing(9)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('closes [#99]')
    expect(chunks[0]).toContain('[#100]')
    expect(chunks[0]).toContain('this completely changes the API')
  })

  it('does not require that types are case sensitive', async () => {
    preparing(9)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('incredible new flag')
  })

  it('populates breaking change if ! is present', async () => {
    preparing(9)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toMatch(/incredible new flag FIXES: #33\r?\n/)
  })

  it('parses both default (Revert "<subject>") and custom (revert: <subject>) revert commits', async () => {
    preparing(10)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toMatch(/custom revert format/)
    expect(chunks[0]).toMatch(/default revert format/)
  })

  it('should include commits with "Release-As:" footer in CHANGELOG', async () => {
    preparing(11)

    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toMatch(/release at different version/)
  })

  describe('bumpStrict parameter', () => {
    it('should not bump version when bumpStrict is true and only hidden types are present', async () => {
      const config = await preset({
        bumpStrict: true,
        types: [
          {
            type: 'feat',
            section: 'Features'
          },
          {
            type: 'fix',
            section: 'Bug Fixes'
          },
          {
            type: 'chore',
            section: 'Chores',
            hidden: true
          }
        ]
      })
      const whatBump = config.whatBump
      const commits = [
        {
          type: 'chore',
          scope: 'deps',
          notes: []
        },
        {
          type: 'chore',
          scope: 'release',
          notes: []
        }
      ]
      const result = whatBump(commits)

      expect(result).toBe(null)
    })

    it('should bump version when bumpStrict is true and non-hidden types are present', async () => {
      const config = await preset({
        bumpStrict: true,
        types: [
          {
            type: 'feat',
            section: 'Features'
          },
          {
            type: 'fix',
            section: 'Bug Fixes'
          },
          {
            type: 'chore',
            section: 'Chores',
            hidden: true
          }
        ]
      })
      const whatBump = config.whatBump
      const commits = [
        {
          type: 'fix',
          scope: 'core',
          notes: []
        },
        {
          type: 'chore',
          scope: 'deps',
          notes: []
        }
      ]
      const result = whatBump(commits)

      expect(result).not.toBe(null)
      expect(result.level).toBe(2)
    })
  })

  describe('scope and scopeOnly parameters', () => {
    it('should filter changelog generation by scope (includes commits without scope)', async () => {
      preparing(1)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .config(preset({
          scope: 'compile'
        }))
        .write()
      const changelog = (await toArray(log)).join('')

      expect(changelog).toContain('avoid a bug')
      expect(changelog).not.toContain('add TravisCI pipeline')
      expect(changelog).toContain('amazing new module')
      expect(changelog).toContain('first build setup')
    })

    it('should filter changelog generation by scopeOnly (excludes commits without scope)', async () => {
      preparing(1)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .config(preset({
          scope: 'compile',
          scopeOnly: true
        }))
        .write()
      const changelog = (await toArray(log)).join('')

      expect(changelog).toContain('avoid a bug')
      expect(changelog).not.toContain('add TravisCI pipeline')
      expect(changelog).not.toContain('amazing new module')
      expect(changelog).not.toContain('first build setup')
    })

    it('should filter changelog generation by scope array (includes commits without scope)', async () => {
      preparing(1)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .config(preset({
          scope: ['compile', 'travis']
        }))
        .write()
      const changelog = (await toArray(log)).join('')

      expect(changelog).toContain('avoid a bug')
      expect(changelog).toContain('add TravisCI pipeline')
      expect(changelog).toContain('amazing new module')
      expect(changelog).toContain('first build setup')
      expect(changelog).not.toContain('make it faster')
      expect(changelog).not.toContain('upgrade example from 1 to 2')
    })

    it('should filter changelog generation by scope array with scopeOnly (excludes commits without scope)', async () => {
      preparing(1)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .config(preset({
          scope: ['compile', 'travis'],
          scopeOnly: true
        }))
        .write()
      const changelog = (await toArray(log)).join('')

      expect(changelog).toContain('avoid a bug')
      expect(changelog).toContain('add TravisCI pipeline')
      expect(changelog).not.toContain('amazing new module')
      expect(changelog).not.toContain('first build setup')
      expect(changelog).not.toContain('make it faster')
      expect(changelog).not.toContain('upgrade example from 1 to 2')
    })
  })
})
