import { vi, afterAll, describe, it, expect } from 'vitest'
import BetterThanBefore from 'better-than-before'
import path from 'path'
import {
  TestTools,
  toArray
} from '../../../tools/index.js'
import {
  ConventionalChangelog,
  packagePrefix
} from './ConventionalChangelog.js'

const FIXTURES_RELATIVE_PATH = path.join('..', 'test', 'fixtures')
const FIXTURES_ABSOLUTE_PATH = path.resolve(__dirname, FIXTURES_RELATIVE_PATH)
const {
  setups,
  preparing,
  tearsWithJoy
} = BetterThanBefore()
let testTools: TestTools

setups([
  () => { // 1
    testTools = new TestTools()

    testTools.gitInit()
    testTools.writeFileSync('package.json', JSON.stringify({
      name: 'conventional-changelog',
      repository: {
        type: 'git',
        url: 'https://github.com/conventional-changelog/conventional-changelog.git'
      }
    }))
    testTools.gitCommit('First commit')
  },
  () => { // 2
    testTools.exec('git tag v0.1.0')
    testTools.gitCommit('Second commit')
    testTools.gitCommit('Third commit closes #1')
  },
  () => { // 3
    testTools.exec('git checkout -b feature')
    testTools.gitCommit('This commit is from feature branch')
    testTools.exec('git checkout master')
    testTools.gitCommit('This commit is from master branch')
    testTools.exec('git merge feature -m"Merge branch \'feature\'"')
  },
  () => { // 4
    testTools.gitCommit('Custom prefix closes @42')
  },
  () => { // 5
    testTools.gitCommit('Custom prefix closes @43')
    testTools.gitCommit('Old prefix closes #71')
  },
  () => { // 6
    testTools.gitCommit('some more features')
    testTools.exec('git tag v2.0.0')
  },
  () => { // 7
    testTools.gitCommit('test8')
  },
  () => { // 8
    testTools.gitCommit('test8')
  },
  () => { // 9
    testTools.gitCommit(['test9', 'Release note: super release!'])
  },
  () => { // 10
    testTools.exec('git remote add origin https://github.com/user/repo.git')
  },
  (context) => { // 11
    testTools.exec('git tag -d v0.1.0')

    const tails = testTools.gitTails()!

    context.tail = tails.pop()!.substring(0, 7)
  },
  (context) => { // 12
    testTools.exec('git tag not-semver')
    testTools.gitCommit()

    const head = testTools.exec('git rev-parse HEAD').trim()

    testTools.gitCommit(`Revert \\"test9\\" This reverts commit ${head}.`)
    context.head = testTools.exec('git rev-parse HEAD').substring(0, 7)
  },
  (context) => { // 13
    const tail = context.tail

    testTools.exec(`git tag v0.0.1 ${tail}`)
  },
  () => { // 14
    testTools.gitCommit()
    testTools.exec('git tag v1.0.0')
  },
  () => { // 15
    testTools.gitCommit()
    testTools.gitCommit('something unreleased yet :)')
  },
  () => { // 16
    testTools.writeFileSync('./package.json', '{"version": "2.0.0"}') // required by angular preset.
    testTools.exec('git tag foo@1.0.0')
    testTools.mkdirSync('./packages/foo', {
      recursive: true
    })
    testTools.writeFileSync('./packages/foo/test1', '')
    testTools.exec('git add --all && git commit -m"feat: first lerna style commit hooray"')
    testTools.mkdirSync('./packages/bar', {
      recursive: true
    })
    testTools.writeFileSync('./packages/bar/test1', '')
    testTools.exec('git add --all && git commit -m"feat: another lerna package, this should be skipped"')
  },
  () => { // 17
    testTools.exec('git tag foo@1.1.0')
    testTools.mkdirSync('./packages/foo', {
      recursive: true
    })
    testTools.writeFileSync('./packages/foo/test2', '')
    testTools.exec('git add --all && git commit -m"feat: second lerna style commit woo"')
  },
  () => { // 18
    testTools.gitCommit()
    testTools.exec('git tag 3.0.0')
  },
  () => { // 19
    testTools.exec('git checkout feature')
    testTools.gitCommit('included in 5.0.0')
    testTools.exec('git checkout -b feature2')
    testTools.gitCommit('merged, unreleased')
    testTools.exec('git checkout master')
    testTools.gitCommit('included in 4.0.0')
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

afterAll(() => {
  testTools?.cleanup()
})

describe('conventional-changelog', () => {
  describe('ConventionalChangelog', () => {
    it('should work if there is no tag', async () => {
      preparing(1)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks[0]).toContain('First commit')
    })

    it('should generate the changelog for the upcoming release', async () => {
      preparing(2)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit')

      expect(chunks[0]).not.toContain('First commit')
    })

    it('should generate the changelog of the last two releases', async () => {
      preparing(2)

      const log = new ConventionalChangelog(testTools.cwd)
        .options({
          releaseCount: 2
        })
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(2)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit')

      expect(chunks[1]).toContain('First commit')
    })

    it('should generate the changelog of the last two releases even if release count exceeds the limit', async () => {
      preparing(2)

      const log = new ConventionalChangelog(testTools.cwd)
        .options({
          releaseCount: 100
        })
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(2)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit')

      expect(chunks[1]).toContain('First commit')
    })

    it('should work when there is no `HEAD` ref', async () => {
      preparing(2)

      try {
        testTools.rmSync('.git/refs/HEAD', {
          recursive: true
        })
      } catch {}

      const log = new ConventionalChangelog(testTools.cwd)
        .options({
          releaseCount: 100
        })
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(2)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit')

      expect(chunks[1]).toContain('First commit')
    })

    it('should honour `gitRawCommitsOpts.from`', async () => {
      preparing(2)

      const log = new ConventionalChangelog(testTools.cwd)
        .commits({
          from: 'HEAD~2'
        })
        .writer({
          commitsSort: undefined
        })
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit')
      expect(chunks[0]).toMatch(/Third commit closes #1[\w\W]*?\* Second commit/)
      expect(chunks[0]).not.toContain('First commit')
    })

    it('should ignore merge commits by default', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('This commit is from feature branch')
      expect(chunks[0]).not.toContain('Merge')
    })

    it('should spit out some debug info', async () => {
      preparing(3)

      const debug = vi.fn()
      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          debug
        })
        .write()

      await toArray(log)

      expect(debug.mock.calls.map(_ => _[0])).toEqual([
        'git-client',
        'git-client',
        'git-client',
        'writer'
      ])
    })

    it('should load package.json for data', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_package.json'))
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('## <small>0.0.17')
      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('closes [#1](https://github.com/ajoslin/conventional-changelog/issues/1)')
    })

    it('should load package.json for data even if repository field is missing', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_version-only.json'))
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('## <small>0.0.17')
      expect(chunks[0]).toContain('Second commit')
    })

    it('should fallback to use repo url if repo is repository is null', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_host-only.json'))
        .context({
          linkReferences: true
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](https://unknown-host/commits/')
      expect(chunks[0]).toContain('closes [#1](https://unknown-host/issues/1)')
    })

    it('should fallback to use repo url if repo is repository is null', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_unknown-host.json'))
        .context({
          linkReferences: true
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](https://stash.local/scm/conventional-changelog/conventional-changelog/commits/')
      expect(chunks[0]).toContain('closes [#1](https://stash.local/scm/conventional-changelog/conventional-changelog/issues/1)')
    })

    it('should transform package.json data', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(
          path.join(FIXTURES_ABSOLUTE_PATH, '_short.json'),
          (pkg) => {
            pkg.version = `v${pkg.version}`

            if (pkg.repository) {
              pkg.repository.url = 'a/b'
            }

            return pkg
          }
        )
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('## <small>v0.0.17')
      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('closes [#1](https://github.com/a/b/issues/1)')
    })

    it('should work in append mode', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          append: true
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toMatch(/Second commit[\w\W]*?\* Third commit/)
    })

    it('should read package.json if only `context.version` is missing', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_package.json'))
        .context({
          host: 'github',
          owner: 'a',
          repository: 'b'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('## <small>0.0.17')
      expect(chunks[0]).toContain('closes [#1](github/a/b/issues/1)')
    })

    it('should read the closest package.json by default', async () => {
      preparing(3)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('closes [#1](https://github.com/conventional-changelog/conventional-changelog/issues/1)')
    })

    it('should ignore other prefixes if an `issuePrefixes` option is not provided', async () => {
      preparing(4)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'github',
          owner: 'b',
          repository: 'a'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](github/b/a/commit/')
      expect(chunks[0]).not.toContain('closes [#42](github/b/a/issues/42)')
    })

    it('should use custom prefixes if an `issuePrefixes` option is provided', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'github',
          owner: 'b',
          repository: 'a'
        })
        .commits({}, {
          issuePrefixes: ['@']
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](github/b/a/commit/')
      expect(chunks[0]).toContain('closes [#42](github/b/a/issues/42)')
      expect(chunks[0]).not.toContain('closes [#71](github/b/a/issues/71)')
    })

    it('should read host configs if only `parserOpts.referenceActions` is missing', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'github',
          owner: 'b',
          repository: 'a',
          issue: 'issue',
          commit: 'commits'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](github/b/a/commits/')
      expect(chunks[0]).toContain('closes [#1](github/b/a/issue/1)')
    })

    it('should read github\'s host configs', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'github',
          owner: 'b',
          repository: 'a'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](github/b/a/commit/')
      expect(chunks[0]).toContain('closes [#1](github/b/a/issues/1)')
    })

    it('should read bitbucket\'s host configs', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'bitbucket',
          owner: 'b',
          repository: 'a'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](bitbucket/b/a/commits/')
      expect(chunks[0]).toContain('closes [#1](bitbucket/b/a/issue/1)')
    })

    it('should read gitlab\'s host configs', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .context({
          host: 'gitlab',
          owner: 'b',
          repository: 'a'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('](gitlab/b/a/commit/')
      expect(chunks[0]).toContain('closes [#1](gitlab/b/a/issues/1)')
    })

    it('should transform the commit', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .writer({
          transform() {
            return {
              header: 'A tiny header'
            }
          }
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('A tiny header')
      expect(chunks[0]).not.toContain('Third')
    })

    it('should generate all log blocks', async () => {
      preparing(5)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          releaseCount: 0
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(2)

      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('Third commit closes #1')

      expect(chunks[1]).toContain('First commit')
    })

    it('should work if there are two semver tags', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          releaseCount: 0
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(3)

      expect(chunks[1]).toContain('# 2.0.0')

      expect(chunks[2]).toContain('# 0.1.0')
    })

    it('semverTags should be attached to the `context` object', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          releaseCount: 0
        })
        .writer({
          mainTemplate: '{{gitSemverTags}} or {{gitSemverTags.[0]}}'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(3)

      expect(chunks).toEqual([
        'v2.0.0,v0.1.0 or v2.0.0\n',
        '\nv2.0.0,v0.1.0 or v2.0.0\n',
        '\nv2.0.0,v0.1.0 or v2.0.0\n'
      ])
    })

    it('should not link compare', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          releaseCount: 0,
          append: true
        })
        .context({
          version: '3.0.0',
          linkCompare: false
        })
        .writer({
          mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
          transform: () => null
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(3)

      expect(chunks).toEqual([
        'Not linked\n',
        '\nNot linked\n',
        '\nNot linked\n'
      ])
    })

    it('should warn if host is not found', async () => {
      preparing(6)

      const warn = vi.fn()
      const log = new ConventionalChangelog(testTools.cwd)
        .options({
          warn
        })
        .context({
          host: 'no'
        })
        .write()

      await toArray(log)

      expect(warn).toBeCalledWith('core', 'Host is not supported: no')
    })

    it('should error if package.json is not found', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage('no')
        .write()

      await expect(() => toArray(log)).rejects.toThrow('ENOENT')
    })

    it('should error if package.json cannot be parsed', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_malformation.json'))
        .write()

      await expect(() => toArray(log)).rejects.toThrow('Unexpected end')
    })

    it('should error if there is an error in `options.pkg.transform`', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(
          path.join(FIXTURES_ABSOLUTE_PATH, '_short.json'),
          () => {
            throw new Error('Error in pkg transform')
          }
        )
        .write()

      await expect(() => toArray(log)).rejects.toThrow('Error in pkg transform')
    })

    it('should error if it errors in commits', async () => {
      preparing(6)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .commits({
          get since(): string {
            throw new Error('Error in commits')
          }
        })
        .write()

      await expect(() => toArray(log)).rejects.toThrow('Error in commits')
    })

    it('should error if it emits an error in `options.transformCommit`', async () => {
      preparing(7)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          transformCommit() {
            throw new Error('Error in transformCommit')
          }
        })
        .write()

      await expect(() => toArray(log)).rejects.toThrow('Error in transformCommit')
    })

    it('should error if it errors in writer', async () => {
      preparing(8)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .writer({
          finalizeContext: () => {
            throw new Error('Error in writer')
          }
        })
        .write()

      await expect(() => toArray(log)).rejects.toThrow('Error in writer')
    })

    it('should be object mode if `writerOpts.includeDetails` is `true`', async () => {
      preparing(8)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write(true)
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toBeTypeOf('object')
    })

    it('should pass `parserOpts` to conventional-commits-parser', async () => {
      preparing(9)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .commits({}, {
          noteKeywords: ['Release note']
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('* test9')
      expect(chunks[0]).toContain('### Release note\n\n* super release!')
    })

    it('should read each commit range exactly once', async () => {
      preparing(9)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .writer({
          headerPartial: '',
          commitPartial: '* {{header}}\n'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toBe('* test8\n* test8\n* test9\n')
    })

    it('should recreate the changelog from scratch', async () => {
      preparing(10)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          reset: true
        })
        .context({
          version: '2.0.0'
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(2)

      expect(chunks[0]).toContain('## 2.0.0')
      expect(chunks[0]).toContain('Custom prefix closes @42')
      expect(chunks[0]).toContain('Custom prefix closes @43')
      expect(chunks[0]).toContain('Old prefix closes #71')
      expect(chunks[0]).toContain('Second commit')
      expect(chunks[0]).toContain('some more features')
      expect(chunks[0]).toContain('Third commit closes #1')
      expect(chunks[0]).toContain('This commit is from feature branch')
      expect(chunks[0]).toContain('This commit is from master branch')
      expect(chunks[0]).not.toContain('test8')
      expect(chunks[0]).not.toContain('test9')

      expect(chunks[1]).toContain('## 0.1.0')
      expect(chunks[1]).toContain('First commit')
    })

    it('should pass fallback to git remote origin url', async () => {
      preparing(10)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage(path.join(FIXTURES_ABSOLUTE_PATH, '_version-only.json'))
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(1)

      expect(chunks[0]).toContain('https://github.com/user/repo')
      expect(chunks[0]).not.toContain('.git')
    })

    it('should respect merge order', async () => {
      preparing(19)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .options({
          releaseCount: 0,
          append: true,
          outputUnreleased: true
        })
        .write()
      const chunks = await toArray(log)

      expect(chunks.length).toBe(7)

      expect(chunks[4]).toContain('included in 4.0.0')
      expect(chunks[4]).not.toContain('included in 5.0.0')

      expect(chunks[5]).toContain('included in 5.0.0')
      expect(chunks[5]).not.toContain('merged, unreleased')

      expect(chunks[6]).toContain('merged, unreleased')
    })

    it('should generate hosted git commit url with short hash', async () => {
      preparing(2)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .write()
      const chunks = await toArray(log)

      expect(chunks[0]).toMatch(/\/commit\/\w{7}\)\)/)
    })

    it('should generate hosted git commit url with long hash', async () => {
      preparing(16)

      const log = new ConventionalChangelog(testTools.cwd)
        .readPackage()
        .loadPreset('angular')
        .write()
      const chunks = await toArray(log)

      expect(chunks[0]).toMatch(/\/commit\/\w{40}\)\)/)
    })

    describe('finalizeContext', () => {
      it('should make `context.previousTag` default to a previous semver version of generated log (prepend)', async () => {
        const { tail } = preparing(11)
        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(2)

        expect(chunks[0]).toBe('v2.0.0...v3.0.0\n')

        expect(chunks[1]).toBe(`\n${tail}...v2.0.0\n`)
      })

      it('should make `context.previousTag` default to a previous semver version of generated log (append)', async () => {
        const { tail } = preparing(11)
        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0,
            append: true
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(2)

        expect(chunks[0]).toBe(`${tail}...v2.0.0\n`)

        expect(chunks[1]).toBe('\nv2.0.0...v3.0.0\n')
      })

      it('`context.previousTag` and `context.currentTag` should be `null` if `keyCommit.gitTags` is not a semver', async () => {
        const { tail } = preparing(12)
        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0,
            append: true
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}',
            generateOn: 'version'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(3)

        expect(chunks[0]).toBe(`${tail}...v2.0.0\n`)

        expect(chunks[1]).toBe('\n...\n')

        expect(chunks[2]).toBe('\nv2.0.0...v3.0.0\n')
      })

      it('should still work if first release has no commits (prepend)', async () => {
        preparing(13)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}',
            transform: () => null
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(3)

        expect(chunks[0]).toBe('v2.0.0...v3.0.0\n')

        expect(chunks[1]).toBe('\nv0.0.1...v2.0.0\n')

        expect(chunks[2]).toBe('\n...v0.0.1\n')
      })

      it('should still work if first release has no commits (append)', async () => {
        preparing(13)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0,
            append: true
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}',
            transform: () => null
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(3)

        expect(chunks[0]).toBe('...v0.0.1\n')

        expect(chunks[1]).toBe('\nv0.0.1...v2.0.0\n')

        expect(chunks[2]).toBe('\nv2.0.0...v3.0.0\n')
      })

      it('should change `context.currentTag` to last commit hash if it is unreleased', async () => {
        const { head } = preparing(13)
        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            outputUnreleased: true
          })
          .context({
            version: '2.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toBe(`v2.0.0...${head}\n`)
      })

      it('should not prefix with a "v"', async () => {
        preparing(18)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0
          })
          .context({
            version: '4.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(5)

        expect(chunks[0]).toBe('3.0.0...4.0.0\n')
      })

      it('should remove the first "v"', async () => {
        preparing(18)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0
          })
          .context({
            version: 'v4.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(5)

        expect(chunks[0]).toBe('3.0.0...4.0.0\n')
      })

      it('should prefix a leading v to version if no previous tags found', async () => {
        preparing(1)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .context({
            version: '1.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toBe('...v1.0.0\n')
      })

      it('should not prefix a leading v to version if there is already a leading v', async () => {
        preparing(1)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .context({
            version: 'v1.0.0'
          })
          .writer({
            mainTemplate: '{{previousTag}}...{{currentTag}}'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toBe('...v1.0.0\n')
      })

      it('should not link compare if previousTag is not truthy', async () => {
        preparing(13)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 0,
            append: true
          })
          .context({
            version: '3.0.0'
          })
          .writer({
            mainTemplate: '{{#if linkCompare}}{{previousTag}}...{{currentTag}}{{else}}Not linked{{/if}}',
            transform: () => null
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(3)

        expect(chunks[0]).toBe('Not linked\n')

        expect(chunks[1]).toBe('\nv0.0.1...v2.0.0\n')

        expect(chunks[2]).toBe('\nv2.0.0...v3.0.0\n')
      })

      it('takes into account tagPrefix option', async () => {
        preparing(16)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .loadPreset('angular')
          .tags({
            prefix: 'foo@'
          })
          .commits({
            path: './packages/foo'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toContain('foo@1.0.0...foo@2.0.0')
      })
    })

    describe('unreleased', () => {
      it('should not output unreleased', async () => {
        preparing(14)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .context({
            version: '1.0.0'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(0)
      })

      it('should output unreleased', async () => {
        preparing(15)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            outputUnreleased: true
          })
          .context({
            version: '1.0.0'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toContain('something unreleased yet :)')
        expect(chunks[0]).toContain('Unreleased')
      })
    })

    describe('lerna style repository', () => {
      it('handles upcoming release', async () => {
        preparing(16)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .tags({
            prefix: packagePrefix('foo')
          })
          .commits({
            path: './packages/foo'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toContain('first lerna style commit hooray')
        expect(chunks[0]).not.toContain('second lerna style commit woo')
        expect(chunks[0]).not.toContain('another lerna package, this should be skipped')
        expect(chunks[0]).not.toContain('something unreleased yet :)')
      })

      it('takes into account lerna tag format when generating context.currentTag', async () => {
        preparing(16)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .loadPreset('angular')
          .tags({
            prefix: packagePrefix('foo')
          })
          .commits({
            path: './packages/foo'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toContain('foo@1.0.0...foo@2.0.0')
      })

      it('should generate the changelog of the last two releases', async () => {
        preparing(17)

        const log = new ConventionalChangelog(testTools.cwd)
          .readPackage()
          .options({
            releaseCount: 2
          })
          .tags({
            prefix: packagePrefix('foo')
          })
          .commits({
            path: './packages/foo'
          })
          .write()
        const chunks = await toArray(log)

        expect(chunks.length).toBe(1)

        expect(chunks[0]).toContain('first lerna style commit hooray')
        expect(chunks[0]).toContain('second lerna style commit woo')
        expect(chunks[0]).not.toContain('another lerna package, this should be skipped')
        expect(chunks[0]).not.toContain('something unreleased yet :)')
      })
    })
  })
})
