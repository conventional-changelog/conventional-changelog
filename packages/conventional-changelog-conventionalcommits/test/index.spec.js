import path from 'path'
import { describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import {
  TestTools,
  runConventionalChangelog
} from '../../../tools/test-tools'
import preset from '../'

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
    testTools.gitDummyCommit(['build!: first build setup', 'BREAKING CHANGE: New build system.'])
    testTools.gitDummyCommit(['ci(travis): add TravisCI pipeline', 'BREAKING CHANGE: Continuously integrated.'])
    testTools.gitDummyCommit(['Feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    testTools.gitDummyCommit(['Fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['perf(ngOptions): make it faster', ' closes #1, #2'])
    testTools.gitDummyCommit(['fix(changelog): proper issue links', ' see #1, conventional-changelog/standard-version#358'])
    testTools.gitDummyCommit('revert(ngOptions): bad commit')
    testTools.gitDummyCommit('fix(*): oops')
    testTools.gitDummyCommit(['fix(changelog): proper issue links', ' see GH-1'])
    testTools.gitDummyCommit(['feat(awesome): adress EXAMPLE-1'])
    testTools.gitDummyCommit(['chore(deps): upgrade example from 1 to 2'])
    testTools.gitDummyCommit(['chore(release): release 0.0.0'])
  },
  () => {
    testTools.gitDummyCommit(['feat(awesome): addresses the issue brought up in #133'])
  },
  () => {
    testTools.gitDummyCommit(['feat(awesome): fix #88'])
  },
  () => {
    testTools.gitDummyCommit(['feat(awesome): issue brought up by @bcoe! on Friday'])
  },
  () => {
    testTools.gitDummyCommit(['build(npm): edit build script', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['ci(travis): setup travis', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['docs(readme): make it clear', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['style(whitespace): make it easier to read', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['refactor(code): change a lot of code', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit(['test(*)!: more tests', 'BREAKING CHANGE: The Change is huge.'])
  },
  () => {
    testTools.exec('git tag v0.1.0')
    testTools.gitDummyCommit('feat: some more feats')
  },
  () => {
    testTools.exec('git tag v0.2.0')
    testTools.gitDummyCommit('feature: some more features')
  },
  () => {
    testTools.gitDummyCommit(['feat(*): implementing #5 by @dlmr', ' closes #10'])
  },
  () => {
    testTools.gitDummyCommit(['fix: use npm@5 (@username)'])
    testTools.gitDummyCommit(['build(deps): bump @dummy/package from 7.1.2 to 8.0.0', 'BREAKING CHANGE: The Change is huge.'])
    testTools.gitDummyCommit([
      'feat: complex new feature',
      'this is a complex new feature with many reviewers',
      'Reviewer: @hutson',
      'Fixes: #99',
      'Refs: #100',
      'BREAKING CHANGE: this completely changes the API'
    ])
    testTools.gitDummyCommit(['FEAT(foo)!: incredible new flag FIXES: #33'])
  },
  () => {
    testTools.gitDummyCommit(['Revert \\"feat: default revert format\\"', 'This reverts commit 1234.'])
    testTools.gitDummyCommit(['revert: feat: custom revert format', 'This reverts commit 5678.'])
  },
  () => {
    testTools.gitDummyCommit([
      'chore: release at different version',
      'Release-As: v3.0.2'
    ])
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

describe('conventional-changelog-conventionalcommits', () => {
  it('should work if there is no semver tag', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
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
      ).toEqual(true)
    })
  })

  it('should not list breaking change twice if ! is used', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).not.toMatch(/\* first build setup\r?\n/)
    })
  })

  it('should allow alternative "types" configuration to be provided', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        types: []
      })
    }, (chunk) => {
      expect(chunk).toContain('first build setup')
      expect(chunk).toContain('**travis:** add TravisCI pipeline')
      expect(chunk).toContain('**travis:** Continuously integrated.')
      expect(chunk).toContain('amazing new module')
      expect(chunk).toContain('**compile:** avoid a bug')
      expect(chunk).toContain('Feat')

      expect(chunk).not.toContain('make it faster')
      expect(chunk).not.toContain('Reverts')
    })
  })

  it('should allow matching "scope" to configuration', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        types: [
          { type: 'chore', scope: 'deps', section: 'Dependencies' }
        ]
      })
    }, (chunk) => {
      expect(chunk).toContain('### Dependencies')
      expect(chunk).toContain('**deps:** upgrade example from 1 to 2')

      expect(chunk).not.toContain('release 0.0.0')
    })
  })

  it('should properly format external repository issues', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('[#1](https://github.com/conventional-changelog/conventional-changelog/issues/1)')
      expect(chunk).toContain('[conventional-changelog/standard-version#358](https://github.com/conventional-changelog/standard-version/issues/358)')
    })
  })

  it('should properly format external repository issues given an `issueUrlFormat`', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        issuePrefixes: ['#', 'GH-'],
        issueUrlFormat: 'issues://{{repository}}/issues/{{id}}'
      })
    }, (chunk) => {
      expect(chunk).toContain('[#1](issues://conventional-changelog/issues/1)')
      expect(chunk).toContain('[conventional-changelog/standard-version#358](issues://standard-version/issues/358)')
      expect(chunk).toContain('[GH-1](issues://conventional-changelog/issues/1)')
    })
  })

  it('should properly format issues in external issue tracker given an `issueUrlFormat` with `prefix`', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        issueUrlFormat: 'https://example.com/browse/{{prefix}}{{id}}',
        issuePrefixes: ['EXAMPLE-']
      })
    }, (chunk) => {
      expect(chunk).toContain('[EXAMPLE-1](https://example.com/browse/EXAMPLE-1)')
    })
  })

  it('should replace #[0-9]+ with GitHub format issue URL by default', async () => {
    preparing(2)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('[#133](https://github.com/conventional-changelog/conventional-changelog/issues/133)')
    })
  })

  it('should remove the issues that already appear in the subject', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('[#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
      expect(chunk).not.toContain('closes [#88](https://github.com/conventional-changelog/conventional-changelog/issues/88)')
    })
  })

  it('should replace @user with configured userUrlFormat', async () => {
    preparing(4)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        userUrlFormat: 'https://foo/{{user}}'
      })
    }, (chunk) => {
      expect(chunk).toContain('[@bcoe](https://foo/bcoe)')
    })
  })

  it('should not discard commit if there is BREAKING CHANGE', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('Continuous Integration')
      expect(chunk).toContain('Build System')
      expect(chunk).toContain('Documentation')
      expect(chunk).toContain('Styles')
      expect(chunk).toContain('Code Refactoring')
      expect(chunk).toContain('Tests')
    })
  })

  it('should omit optional ! in breaking commit', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('### Tests')
      expect(chunk).toContain('* more tests')
    })
  })

  it('should work if there is a semver tag', async () => {
    preparing(6)

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset,
      outputUnreleased: true
    }, (chunk) => {
      expect(chunk).toContain('some more feats')
      expect(chunk).not.toContain('BREAKING')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should support "feature" as alias for "feat"', async () => {
    preparing(7)

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset,
      outputUnreleased: true
    }, (chunk) => {
      expect(chunk).toContain('some more features')
      expect(chunk).not.toContain('BREAKING')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should work with unknown host', async () => {
    preparing(7)

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset({
        commitUrlFormat: 'http://unknown/commit/{{hash}}',
        compareUrlFormat: 'http://unknown/compare/{{previousTag}}...{{currentTag}}'
      }),
      pkg: {
        path: path.join(__dirname, 'fixtures/_unknown-host.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('(http://unknown/compare')
      expect(chunk).toContain('](http://unknown/commit/')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should work specifying where to find a package.json using conventional-changelog-core', async () => {
    preparing(8)

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_known-host.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('(https://github.com/conventional-changelog/example/compare')
      expect(chunk).toContain('](https://github.com/conventional-changelog/example/commit/')
      expect(chunk).toContain('](https://github.com/conventional-changelog/example/issues/')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should fallback to the closest package.json when not providing a location for a package.json', async () => {
    preparing(8)

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('(https://github.com/conventional-changelog/conventional-changelog/compare')
      expect(chunk).toContain('](https://github.com/conventional-changelog/conventional-changelog/commit/')
      expect(chunk).toContain('](https://github.com/conventional-changelog/conventional-changelog/issues/')
    })

    expect(chunks.length).toEqual(1)
  })

  it('should support non public GitHub repository locations', async () => {
    preparing(8)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset,
      pkg: {
        path: path.join(__dirname, 'fixtures/_ghe-host.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('(https://github.internal.example.com/dlmr')
      expect(chunk).toContain('(https://github.internal.example.com/conventional-changelog/internal/compare')
      expect(chunk).toContain('](https://github.internal.example.com/conventional-changelog/internal/commit/')
      expect(chunk).toContain('5](https://github.internal.example.com/conventional-changelog/internal/issues/5')
      expect(chunk).toContain(' closes [#10](https://github.internal.example.com/conventional-changelog/internal/issues/10)')
    })
  })

  it('should only replace with link to user if it is an username', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).not.toContain('(https://github.com/5')
      expect(chunk).toContain('(https://github.com/username')

      expect(chunk).not.toContain('[@dummy](https://github.com/dummy)/package')
      expect(chunk).toContain('bump @dummy/package from')
    })
  })

  it('supports multiple lines of footer information', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('closes [#99]')
      expect(chunk).toContain('[#100]')
      expect(chunk).toContain('this completely changes the API')
    })
  })

  it('does not require that types are case sensitive', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toContain('incredible new flag')
    })
  })

  it('populates breaking change if ! is present', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toMatch(/incredible new flag FIXES: #33\r?\n/)
    })
  })

  it('parses both default (Revert "<subject>") and custom (revert: <subject>) revert commits', async () => {
    preparing(10)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toMatch(/custom revert format/)
      expect(chunk).toMatch(/default revert format/)
    })
  })
  it('should include commits with "Release-As:" footer in CHANGELOG', async () => {
    preparing(11)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      config: preset
    }, (chunk) => {
      expect(chunk).toMatch(/release at different version/)
    })
  })
})
