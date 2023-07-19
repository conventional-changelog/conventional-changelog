import { describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import path from 'path'
import {
  TestTools,
  createRunConventionalChangelog
} from '../../../tools/test-tools'
import conventionalChangelogCore from '../'

const { setups, preparing, tearsWithJoy } = BetterThanBefore()
const runConventionalChangelog = createRunConventionalChangelog(conventionalChangelogCore)
let testTools

setups([
  () => { // 1
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('package.json', JSON.stringify({
      name: 'conventional-changelog-core',
      repository: {
        type: 'git',
        url: 'https://github.com/conventional-changelog/conventional-changelog-core.git'
      }
    }))
    testTools.gitDummyCommit('First commit')
  },
  () => { // 2
    testTools.exec('git tag v0.1.0')
    testTools.gitDummyCommit('Second commit')
    testTools.gitDummyCommit('Third commit closes #1')
  },
  () => { // 3
    testTools.exec('git checkout -b feature')
    testTools.gitDummyCommit('This commit is from feature branch')
    testTools.exec('git checkout master')
    testTools.gitDummyCommit('This commit is from master branch')
    testTools.exec('git merge feature -m"Merge branch \'feature\'"')
  },
  () => { // 4
    testTools.gitDummyCommit('Custom prefix closes @42')
  },
  () => { // 5
    testTools.gitDummyCommit('Custom prefix closes @43')
    testTools.gitDummyCommit('Old prefix closes #71')
  },
  () => { // 6
    testTools.gitDummyCommit('some more features')
    testTools.exec('git tag v2.0.0')
  },
  () => { // 7
    testTools.gitDummyCommit('test8')
  },
  () => { // 8
    testTools.gitDummyCommit('test8')
  },
  () => { // 9
    testTools.gitDummyCommit(['test9', 'Release note: super release!'])
  },
  () => { // 10
    testTools.exec('git remote add origin https://github.com/user/repo.git')
  },
  (context) => { // 11
    testTools.exec('git tag -d v0.1.0')
    const tails = testTools.gitTails()
    context.tail = tails.pop().substring(0, 7)
  },
  (context) => { // 12
    testTools.exec('git tag not-semver')
    testTools.gitDummyCommit()

    const head = testTools.exec('git rev-parse HEAD').trim()
    testTools.gitDummyCommit('Revert \\"test9\\" This reverts commit ' + head + '.')
    context.head = testTools.exec('git rev-parse HEAD').substring(0, 7)
  },
  (context) => { // 13
    const tail = context.tail
    testTools.exec('git tag v0.0.1 ' + tail)
  },
  () => { // 14
    testTools.gitDummyCommit()
    testTools.exec('git tag v1.0.0')
  },
  () => { // 15
    testTools.gitDummyCommit()
    testTools.gitDummyCommit('something unreleased yet :)')
  },
  () => { // 16
    testTools.writeFileSync('./package.json', '{"version": "2.0.0"}') // required by angular preset.
    testTools.exec('git tag foo@1.0.0')
    testTools.mkdirSync('./packages/foo', { recursive: true })
    testTools.writeFileSync('./packages/foo/test1', '')
    testTools.exec('git add --all && git commit -m"feat: first lerna style commit hooray"')
    testTools.mkdirSync('./packages/bar', { recursive: true })
    testTools.writeFileSync('./packages/bar/test1', '')
    testTools.exec('git add --all && git commit -m"feat: another lerna package, this should be skipped"')
  },
  () => { // 17
    testTools.exec('git tag foo@1.1.0')
    testTools.mkdirSync('./packages/foo', { recursive: true })
    testTools.writeFileSync('./packages/foo/test2', '')
    testTools.exec('git add --all && git commit -m"feat: second lerna style commit woo"')
  },
  () => { // 18
    testTools.gitDummyCommit()
    testTools.exec('git tag 3.0.0')
  },
  () => { // 19
    testTools.exec('git checkout feature')
    testTools.gitDummyCommit('included in 5.0.0')
    testTools.exec('git checkout -b feature2')
    testTools.gitDummyCommit('merged, unreleased')
    testTools.exec('git checkout master')
    testTools.gitDummyCommit('included in 4.0.0')
    testTools.exec('git tag v4.0.0')
    testTools.exec('git merge feature -m"Merge branch \'feature\'"')
    testTools.writeFileSync('./package.json', '{"version": "5.0.0"}') // required by angular preset.
    testTools.exec('git add --all && git commit -m"5.0.0"')
    testTools.exec('git tag v5.0.0')
    testTools.exec('git merge feature2 -m"Merge branch \'feature2\'"')
  }
])

tearsWithJoy(() => {
  testTools?.cleanup()
})

describe('conventional-changelog-core', () => {
  it('should work if there is no tag', async () => {
    preparing(1)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, (chunk) => {
      expect(chunk).toContain('First commit')
    })
  })

  it('should generate the changelog for the upcoming release', async () => {
    preparing(2)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, (chunk) => {
      expect(chunk).toContain('Second commit')
      expect(chunk).toContain('Third commit')

      expect(chunk).not.toContain('First commit')
    })
  })

  it('should generate the changelog of the last two releases', async () => {
    preparing(2)
    let i = 0

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 2
    }, (chunk) => {
      if (i === 0) {
        expect(chunk).toContain('Second commit')
        expect(chunk).toContain('Third commit')
      } else if (i === 1) {
        expect(chunk).toContain('First commit')
      }

      i++
    })

    expect(chunks.length).toEqual(2)
  })

  it('should generate the changelog of the last two releases even if release count exceeds the limit', async () => {
    preparing(2)
    let i = 0

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 100
    }, (chunk) => {
      if (i === 0) {
        expect(chunk).toContain('Second commit')
        expect(chunk).toContain('Third commit')
      } else if (i === 1) {
        expect(chunk).toContain('First commit')
      }

      i++
    })

    expect(chunks.length).toEqual(2)
  })

  it('should work when there is no `HEAD` ref', async () => {
    preparing(2)
    try {
      testTools.rmSync('.git/refs/HEAD', { recursive: true })
    } catch (err) {
      // ignore
    }
    let i = 0

    const chunks = await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 100
    }, (chunk) => {
      if (i === 0) {
        expect(chunk).toContain('Second commit')
        expect(chunk).toContain('Third commit')
      } else if (i === 1) {
        expect(chunk).toContain('First commit')
      }

      i++
    })

    expect(chunks.length).toEqual(2)
  })

  it('should honour `gitRawCommitsOpts.from`', async () => {
    preparing(2)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {}, {
      from: 'HEAD~2'
    }, {}, {
      commitsSort: null
    }, (chunk) => {
      expect(chunk).toContain('Second commit')
      expect(chunk).toContain('Third commit')
      expect(chunk).toMatch(/Third commit closes #1[\w\W]*?\* Second commit/)

      expect(chunk).not.toContain('First commit')
    })
  })

  it('should ignore merge commits by default', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, (chunk) => {
      expect(chunk).toContain('This commit is from feature branch')

      expect(chunk).not.toContain('Merge')
    })
  })

  it('should spit out some debug info', async () => {
    preparing(3)

    let cmd = ''

    await runConventionalChangelog({
      cwd: testTools.cwd,
      debug (c) {
        if (!cmd) {
          cmd = c
        }
      }
    })

    expect(cmd).toContain('Your git-log command is:')
  })

  it('should load package.json for data', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_package.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('## <small>0.0.17')
      expect(chunk).toContain('Second commit')
      expect(chunk).toContain('closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1)')
    })
  })

  it('should load package.json for data even if repository field is missing', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_version-only.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('## <small>0.0.17')
      expect(chunk).toContain('Second commit')
    })
  })

  it('should fallback to use repo url if repo is repository is null', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_host-only.json')
      }
    }, {
      linkReferences: true
    }, (chunk) => {
      expect(chunk).toContain('](https://unknown-host/commits/')
      expect(chunk).toContain('closes [#1](https://unknown-host/issues/1)')
    })
  })

  it('should fallback to use repo url if repo is repository is null', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_unknown-host.json')
      }
    }, {
      linkReferences: true
    }, (chunk) => {
      expect(chunk).toContain('](https://stash.local/scm/conventional-changelog/conventional-changelog/commits/')
      expect(chunk).toContain('closes [#1](https://stash.local/scm/conventional-changelog/conventional-changelog/issues/1)')
    })
  })

  it('should transform package.json data', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_short.json'),
        transform: (pkg) => {
          pkg.version = 'v' + pkg.version
          pkg.repository = 'a/b'
          return pkg
        }
      }
    }, (chunk) => {
      expect(chunk).toContain('## <small>v0.0.17')
      expect(chunk).toContain('Second commit')
      expect(chunk).toContain('closes [#1](https://github.com/a/b/issues/1)')
    })
  })

  it('should work in append mode', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      append: true
    }, (chunk) => {
      expect(chunk).toMatch(/Second commit[\w\W]*?\* Third commit/)
    })
  })

  it('should read package.json if only `context.version` is missing', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_package.json')
      }
    }, {
      host: 'github',
      owner: 'a',
      repository: 'b'
    }, (chunk) => {
      expect(chunk).toContain('## <small>0.0.17')
      expect(chunk).toContain('closes [#1](github/a/b/issues/1)')
    })
  })

  it('should read the closest package.json by default', async () => {
    preparing(3)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, (chunk) => {
      expect(chunk).toContain('closes [#1](https://github.com/conventional-changelog/conventional-changelog-core/issues/1)')
    })
  })

  it('should ignore other prefixes if an `issuePrefixes` option is not provided', async () => {
    preparing(4)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'github',
      owner: 'b',
      repository: 'a'
    }, {}, {}, (chunk) => {
      expect(chunk).toContain('](github/b/a/commit/')
      expect(chunk).not.toContain('closes [#42](github/b/a/issues/42)')
    })
  })

  it('should use custom prefixes if an `issuePrefixes` option is provided', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'github',
      owner: 'b',
      repository: 'a'
    }, {}, {
      issuePrefixes: ['@']
    }, (chunk) => {
      expect(chunk).toContain('](github/b/a/commit/')
      expect(chunk).toContain('closes [#42](github/b/a/issues/42)')
      expect(chunk).not.toContain('closes [#71](github/b/a/issues/71)')
    })
  })

  it('should read host configs if only `parserOpts.referenceActions` is missing', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'github',
      owner: 'b',
      repository: 'a',
      issue: 'issue',
      commit: 'commits'
    }, {}, {}, (chunk) => {
      expect(chunk).toContain('](github/b/a/commits/')
      expect(chunk).toContain('closes [#1](github/b/a/issue/1)')
    })
  })

  it('should read github\'s host configs', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'github',
      owner: 'b',
      repository: 'a'
    }, {}, {}, (chunk) => {
      expect(chunk).toContain('](github/b/a/commit/')
      expect(chunk).toContain('closes [#1](github/b/a/issues/1)')
    })
  })

  it('should read bitbucket\'s host configs', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'bitbucket',
      owner: 'b',
      repository: 'a'
    }, {}, {}, (chunk) => {
      expect(chunk).toContain('](bitbucket/b/a/commits/')
      expect(chunk).toContain('closes [#1](bitbucket/b/a/issue/1)')
    })
  })

  it('should read gitlab\'s host configs', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {
      host: 'gitlab',
      owner: 'b',
      repository: 'a'
    }, {}, {}, (chunk) => {
      expect(chunk).toContain('](gitlab/b/a/commit/')
      expect(chunk).toContain('closes [#1](gitlab/b/a/issues/1)')
    })
  })

  it('should transform the commit', async () => {
    preparing(5)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      transform (chunk, cb) {
        chunk.header = 'A tiny header'
        cb(null, chunk)
      }
    }, (chunk) => {
      expect(chunk).toContain('A tiny header')
      expect(chunk).not.toContain('Third')
    })
  })

  it('should generate all log blocks', async () => {
    preparing(5)
    let i = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 0
    }, (chunk) => {
      if (i === 0) {
        expect(chunk).toContain('Second commit')
        expect(chunk).toContain('Third commit closes #1')
      } else {
        expect(chunk).toContain('First commit')
      }

      i++
    })

    expect(i).toEqual(2)
  })

  it('should work if there are two semver tags', async () => {
    preparing(6)
    let i = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 0
    }, (chunk) => {
      if (i === 1) {
        expect(chunk).toContain('# 2.0.0')
      } else if (i === 2) {
        expect(chunk).toContain('# 0.1.0')
      }

      i++
    })

    expect(i).toEqual(3)
  })

  it('semverTags should be attached to the `context` object', async () => {
    preparing(6)
    let i = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 0
    }, {}, {}, {}, {
      mainTemplate: '{{gitSemverTags}} or {{gitSemverTags.[0]}}'
    }, (chunk) => {
      expect(chunk).toEqual('v2.0.0,v0.1.0 or v2.0.0')

      i++
    })

    expect(i).toEqual(3)
  })

  it('should not link compare', async () => {
    preparing(6)
    let i = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 0,
      append: true
    }, {
      version: '3.0.0',
      linkCompare: false
    }, {}, {}, {
      mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
      transform: () => {
        return null
      }
    }, (chunk) => {
      expect(chunk).toEqual('Not linked')

      i++
    })

    expect(i).toEqual(3)
  })

  it('should warn if host is not found', async () => {
    preparing(6)

    let warning = ''

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: null,
      warn (message) {
        warning = message
      }
    }, {
      host: 'no'
    })

    expect(warning).toEqual('Host: "no" does not exist')
  })

  it('should warn if package.json is not found', async () => {
    preparing(6)

    let warning = ''

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: 'no'
      },
      warn: (message) => {
        warning = message
      }
    })

    expect(warning).toContain('Error')
  })

  it('should warn if package.json cannot be parsed', async () => {
    preparing(6)

    let warning = ''

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_malformation.json')
      },
      warn: (message) => {
        warning = message
      }
    })

    expect(warning).toContain('Error')
  })

  it('should error if anything throws', async () => {
    preparing(6)

    let error = null

    try {
      await runConventionalChangelog({
        cwd: testTools.cwd,
        pkg: {
          path: path.join(__dirname, 'fixtures/_malformation.json')
        },
        warn: () => {
          undefined.a = 10
        }
      })
    } catch (err) {
      error = err
    }

    expect(error).toBeTruthy()
  })

  it('should error if there is an error in `options.pkg.transform`', async () => {
    preparing(6)

    let error = null

    try {
      await runConventionalChangelog({
        cwd: testTools.cwd,
        pkg: {
          path: path.join(__dirname, 'fixtures/_short.json'),
          transform: () => {
            undefined.a = 10
          }
        }
      })
    } catch (err) {
      error = err
    }

    expect(error.message).toContain('undefined')
  })

  it('should error if it errors in git-raw-commits', async () => {
    preparing(6)

    conventionalChangelogCore({}, {}, {
      unknowOptions: false
    })
      .on('error', (err) => {
        expect(err.message).toContain('Error in git-raw-commits:')
      })
  })

  it('should error if it emits an error in `options.transform`', async () => {
    preparing(7)

    let error = null

    try {
      await runConventionalChangelog({
        cwd: testTools.cwd,
        transform: (commit, cb) => {
          cb(new Error('error'))
        }
      })
    } catch (err) {
      error = err
    }

    expect(error.message).toContain('Error in options.transform:')
  })

  it('should error if there is an error in `options.transform`', async () => {
    preparing(8)

    let error = null

    try {
      await runConventionalChangelog({
        cwd: testTools.cwd,
        transform: () => {
          undefined.a = 10
        }
      })
    } catch (err) {
      error = err
    }

    expect(error.message).toContain('Error in options.transform:')
  })

  it('should error if it errors in conventional-changelog-writer', async () => {
    preparing(8)

    let error = null

    try {
      await runConventionalChangelog({
        cwd: testTools.cwd
      }, {}, {}, {}, {
        finalizeContext: () => {
          return undefined.a
        }
      })
    } catch (err) {
      error = err
    }

    expect(error.message).toContain('Error in conventional-changelog-writer:')
  })

  it('should be object mode if `writerOpts.includeDetails` is `true`', async () => {
    preparing(8)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {}, {}, {}, {
      includeDetails: true
    }, (chunk) => {
      expect(chunk).toBeTypeOf('object')
    })
  })

  it('should pass `parserOpts` to conventional-commits-parser', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, {}, {}, {
      noteKeywords: [
        'Release note'
      ]
    }, (chunk) => {
      expect(chunk).toContain('* test9')
      expect(chunk).toContain('### Release note\n\n* super release!')
    })
  })

  it('should read each commit range exactly once', async () => {
    preparing(9)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      preset: {
        compareUrlFormat: '/compare/{{previousTag}}...{{currentTag}}'
      }
    }, {}, {}, {}, {
      headerPartial: '',
      commitPartial: '* {{header}}\n'
    }, (chunk) => {
      expect(chunk).toEqual('\n* test8\n* test8\n* test9\n\n\n\n')
    })
  })

  it('should recreate the changelog from scratch', async () => {
    preparing(10)

    const context = {
      resetChangelog: true,
      version: '2.0.0'
    }

    let chunkNumber = 0

    await runConventionalChangelog({
      cwd: testTools.cwd
    }, context, (chunk) => {
      chunkNumber += 1

      if (chunkNumber === 1) {
        expect(chunk).toContain('## 2.0.0')
        expect(chunk).toContain('Custom prefix closes @42')
        expect(chunk).toContain('Custom prefix closes @43')
        expect(chunk).toContain('Old prefix closes #71')
        expect(chunk).toContain('Second commit')
        expect(chunk).toContain('some more features')
        expect(chunk).toContain('Third commit closes #1')
        expect(chunk).toContain('This commit is from feature branch')
        expect(chunk).toContain('This commit is from master branch')
        expect(chunk).not.toContain('test8')
        expect(chunk).not.toContain('test9')
      } else if (chunkNumber === 2) {
        expect(chunk).toContain('## 0.1.0')
        expect(chunk).toContain('First commit')
      }
    })
  })

  it('should pass fallback to git remote origin url', async () => {
    preparing(10)

    await runConventionalChangelog({
      cwd: testTools.cwd,
      pkg: {
        path: path.join(__dirname, 'fixtures/_version-only.json')
      }
    }, (chunk) => {
      expect(chunk).toContain('https://github.com/user/repo')
      expect(chunk).not.toContain('.git')
    })
  })

  it('should respect merge order', async () => {
    preparing(19)
    let i = 0

    await runConventionalChangelog({
      cwd: testTools.cwd,
      releaseCount: 0,
      append: true,
      outputUnreleased: true
    }, {}, {}, {}, {}, (chunk) => {
      if (i === 4) {
        expect(chunk).toContain('included in 4.0.0')
        expect(chunk).not.toContain('included in 5.0.0')
      } else if (i === 5) {
        expect(chunk).toContain('included in 5.0.0')
        expect(chunk).not.toContain('merged, unreleased')
      } else if (i === 6) {
        expect(chunk).toContain('merged, unreleased')
      }

      i++
    })

    expect(i).toEqual(7)
  })

  describe('finalizeContext', () => {
    it('should make `context.previousTag` default to a previous semver version of generated log (prepend)', async () => {
      const tail = preparing(11).tail
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        } else if (i === 1) {
          expect(chunk).toEqual(tail + '...v2.0.0')
        }

        i++
      })

      expect(i).toEqual(2)
    })

    it('should make `context.previousTag` default to a previous semver version of generated log (append)', async () => {
      const tail = preparing(11).tail
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual(tail + '...v2.0.0')
        } else if (i === 1) {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        }

        i++
      })

      expect(i).toEqual(2)
    })

    it('`context.previousTag` and `context.currentTag` should be `null` if `keyCommit.gitTags` is not a semver', async () => {
      const tail = preparing(12).tail
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}',
        generateOn: 'version'
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual(tail + '...v2.0.0')
        } else if (i === 1) {
          expect(chunk).toEqual('...')
        } else {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        }

        i++
      })

      expect(i).toEqual(3)
    })

    it('should still work if first release has no commits (prepend)', async () => {
      preparing(13)
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}',
        transform: () => {
          return null
        }
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        } else if (i === 1) {
          expect(chunk).toEqual('v0.0.1...v2.0.0')
        } else if (i === 2) {
          expect(chunk).toEqual('...v0.0.1')
        }

        i++
      })

      expect(i).toEqual(3)
    })

    it('should still work if first release has no commits (append)', async () => {
      preparing(13)
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}',
        transform: () => {
          return null
        }
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual('...v0.0.1')
        } else if (i === 1) {
          expect(chunk).toEqual('v0.0.1...v2.0.0')
        } else if (i === 2) {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        }

        i++
      })

      expect(i).toEqual(3)
    })

    it('should change `context.currentTag` to last commit hash if it is unreleased', async () => {
      const head = preparing(13).head
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        outputUnreleased: true
      }, {
        version: '2.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      }, (chunk) => {
        expect(chunk).toEqual('v2.0.0...' + head)

        i++
      })

      expect(i).toEqual(1)
    })

    it('should not prefix with a "v"', async () => {
      preparing(18)
      let i = 0

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          releaseCount: 0
        },
        {
          version: '4.0.0'
        },
        {},
        {},
        {
          mainTemplate: '{{previousTag}}...{{currentTag}}'
        },
        (chunk) => {
          if (i === 0) {
            expect(chunk).toEqual('3.0.0...4.0.0')
          }

          i++
        }
      )
    })

    it('should remove the first "v"', async () => {
      preparing(18)
      let i = 0

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          releaseCount: 0
        },
        {
          version: 'v4.0.0'
        },
        {},
        {},
        {
          mainTemplate: '{{previousTag}}...{{currentTag}}'
        },
        (chunk) => {
          if (i === 0) {
            expect(chunk).toEqual('3.0.0...4.0.0')
          }

          i++
        }
      )
    })

    it('should prefix a leading v to version if no previous tags found', async () => {
      preparing(1)

      await runConventionalChangelog({
        cwd: testTools.cwd
      }, {
        version: '1.0.0'
      }, {}, {}, {
        mainTemplate: '{{previousTag}}...{{currentTag}}'
      }, (chunk) => {
        expect(chunk).toContain('...v1.0.0')
      })
    })

    it('should not prefix a leading v to version if there is already a leading v', async () => {
      preparing(1)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd
        },
        {
          version: 'v1.0.0'
        },
        {},
        {},
        {
          mainTemplate: '{{previousTag}}...{{currentTag}}'
        },
        (chunk) => {
          expect(chunk).toContain('...v1.0.0')
        }
      )
    })

    it('should not link compare if previousTag is not truthy', async () => {
      preparing(13)
      let i = 0

      await runConventionalChangelog({
        cwd: testTools.cwd,
        releaseCount: 0,
        append: true
      }, {
        version: '3.0.0'
      }, {}, {}, {
        mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
        transform: () => {
          return null
        }
      }, (chunk) => {
        if (i === 0) {
          expect(chunk).toEqual('Not linked')
        } else if (i === 1) {
          expect(chunk).toEqual('v0.0.1...v2.0.0')
        } else if (i === 2) {
          expect(chunk).toEqual('v2.0.0...v3.0.0')
        }

        i++
      })

      expect(i).toEqual(3)
    })

    it('takes into account tagPrefix option', async () => {
      preparing(16)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          tagPrefix: 'foo@',
          config: require('conventional-changelog-angular')
        },
        {},
        { path: './packages/foo' },
        (chunk) => {
          // confirm that context.currentTag behaves differently when
          // tagPrefix is used
          expect(chunk).toContain('foo@1.0.0...foo@2.0.0')
        }
      )
    })
  })

  describe('config', () => {
    const config = {
      context: {
        version: 'v100.0.0'
      }
    }

    const promise = new Promise((resolve) => {
      resolve(config)
    })

    const fn = () => config

    it('should load object config', async () => {
      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          config,
          pkg: {
            path: path.join(__dirname, 'fixtures/_package.json')
          }
        }, (chunk) => {
          expect(chunk).toContain('v100.0.0')
        }
      )
    })

    it('should load promise config', async () => {
      await runConventionalChangelog({
        cwd: testTools.cwd,
        config: promise
      }, (chunk) => {
        expect(chunk).toContain('v100.0.0')
      })
    })

    it('should load function config', async () => {
      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          config: fn
        },
        (chunk) => {
          expect(chunk).toContain('v100.0.0')
        }
      )
    })

    it('should warn if config errors', async () => {
      let warning = ''

      await runConventionalChangelog({
        cwd: testTools.cwd,
        config: new Promise((resolve, reject) => {
          reject('config error') // eslint-disable-line prefer-promise-reject-errors
        }),
        warn: (warn) => {
          warning = warn
        }
      })

      expect(warning).toContain('config error')
    })
  })

  describe('unreleased', () => {
    it('should not output unreleased', async () => {
      preparing(14)

      await runConventionalChangelog({
        cwd: testTools.cwd
      }, {
        version: '1.0.0'
      }, () => {
        throw new Error('should not output unreleased')
      })
    })

    it('should output unreleased', async () => {
      preparing(15)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          outputUnreleased: true
        },
        {
          version: 'v1.0.0'
        },
        (chunk) => {
          expect(chunk).toContain('something unreleased yet :)')
          expect(chunk).toContain('Unreleased')
        }
      )
    })
  })

  describe('lerna style repository', () => {
    it('handles upcoming release', async () => {
      preparing(16)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          lernaPackage: 'foo'
        },
        {},
        { path: './packages/foo' },
        (chunk) => {
          expect(chunk).toContain('first lerna style commit hooray')
          expect(chunk).not.toContain('second lerna style commit woo')
          expect(chunk).not.toContain('another lerna package, this should be skipped')
          expect(chunk).not.toContain('something unreleased yet :)')
        }
      )
    })

    it('takes into account lerna tag format when generating context.currentTag', async () => {
      preparing(16)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          lernaPackage: 'foo',
          config: require('conventional-changelog-angular')
        },
        {},
        { path: './packages/foo' },
        (chunk) => {
          // confirm that context.currentTag behaves differently when
          // lerna style tags are applied.
          expect(chunk).toContain('foo@1.0.0...foo@2.0.0')
        }
      )
    })

    it('should generate the changelog of the last two releases', async () => {
      preparing(17)

      await runConventionalChangelog(
        {
          cwd: testTools.cwd,
          lernaPackage: 'foo',
          releaseCount: 2
        },
        {},
        { path: './packages/foo' },
        (chunk) => {
          expect(chunk).toContain('first lerna style commit hooray')
          expect(chunk).toContain('second lerna style commit woo')
          expect(chunk).not.toContain('another lerna package, this should be skipped')
          expect(chunk).not.toContain('something unreleased yet :)')
        }
      )
    })
  })
})
