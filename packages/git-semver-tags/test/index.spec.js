import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/test-tools'
import gitSemverTags from '../'

let testTools

describe('git-semver-tags', () => {
  beforeAll(() => {
    testTools = new TestTools()
    testTools.gitInit()
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should error if no commits found', () => {
    return new Promise((resolve) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err) => {
        expect(err).toBeTruthy()
        resolve()
      })
    })
  })

  it('should get no semver tags', () => {
    testTools.writeFileSync('test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
    testTools.exec('git tag foo')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual([])
        resolve()
      })
    })
  })

  it('should get the semver tag', () => {
    testTools.writeFileSync('test2', '')
    testTools.exec('git add --all && git commit -m"Second commit"')
    testTools.exec('git tag v2.0.0')
    testTools.writeFileSync('test3', '')
    testTools.exec('git add --all && git commit -m"Third commit"')
    testTools.exec('git tag va.b.c')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v2.0.0'])
        resolve()
      })
    })
  })

  it('should get both semver tags', () => {
    testTools.exec('git tag v3.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v3.0.0', 'v2.0.0'])
        resolve()
      })
    })
  })

  it('should get all semver tags if two tags on the same commit', () => {
    testTools.exec('git tag v4.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v4.0.0', 'v3.0.0', 'v2.0.0'])
        resolve()
      })
    })
  })

  it('should still work if I run it again', () => {
    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v4.0.0', 'v3.0.0', 'v2.0.0'])
        resolve()
      })
    })
  })

  it('should be in reverse chronological order', () => {
    testTools.writeFileSync('test4', '')
    testTools.exec('git add --all && git commit -m"Fourth commit"')
    testTools.exec('git tag v1.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v1.0.0', 'v4.0.0', 'v3.0.0', 'v2.0.0'])
        resolve()
      })
    })
  })

  it('should work with prerelease', () => {
    testTools.writeFileSync('test5', '')
    testTools.exec('git add --all && git commit -m"Fifth commit"')
    testTools.exec('git tag 5.0.0-pre')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['5.0.0-pre', 'v1.0.0', 'v4.0.0', 'v3.0.0', 'v2.0.0'])
        resolve()
      })
    })
  })

  it('should work with empty commit', () => {
    testTools?.cleanup()
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit('empty commit')
    testTools.exec('git tag v1.1.0')
    testTools.exec('git tag blarg-project@1.0.0') // should be ignored.
    testTools.gitDummyCommit('empty commit2')
    testTools.gitDummyCommit('empty commit3')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['v1.1.0'])
        resolve()
      })
    })
  })

  it('should work with lerna style tags', () => {
    testTools.writeFileSync('test5', '2')
    testTools.exec('git add --all && git commit -m"sixth commit"')
    testTools.exec('git tag foo-project@4.0.0')
    testTools.writeFileSync('test5', '3')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag foo-project@5.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd,
        lernaTags: true
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['foo-project@5.0.0', 'foo-project@4.0.0', 'blarg-project@1.0.0'])
        resolve()
      })
    })
  })

  it('should work with lerna style tags with multiple digits', () => {
    testTools.writeFileSync('test5', '4')
    testTools.exec('git add --all && git commit -m"fifth commit"')
    testTools.exec('git tag foobar-project@0.0.10')
    testTools.writeFileSync('test5', '5')
    testTools.exec('git add --all && git commit -m"sixth commit"')
    testTools.exec('git tag foobar-project@0.10.0')
    testTools.writeFileSync('test5', '6')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag foobar-project@10.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd,
        lernaTags: true
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual([
          'foobar-project@10.0.0',
          'foobar-project@0.10.0',
          'foobar-project@0.0.10',
          'foo-project@5.0.0',
          'foo-project@4.0.0',
          'blarg-project@1.0.0'
        ])
        resolve()
      })
    })
  })

  it('should allow lerna style tags to be filtered by package', () => {
    testTools.writeFileSync('test5', '')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag bar-project@5.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd,
        lernaTags: true,
        package: 'bar-project'
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['bar-project@5.0.0'])
        resolve()
      })
    })
  })

  it('should not allow package filter without lernaTags=true', () => {
    return new Promise((resolve) => {
      gitSemverTags({
        cwd: testTools.cwd,
        package: 'bar-project'
      }, (err) => {
        expect(err.message).toBe('opts.package should only be used when running in lerna mode')
        resolve()
      })
    })
  })

  it('should work with tag prefix option', () => {
    testTools.writeFileSync('test6', '')
    testTools.exec('git add --all && git commit -m"eighth commit"')
    testTools.exec('git tag ms/6.0.0')
    testTools.writeFileSync('test6', '1')
    testTools.exec('git add --all && git commit -m"tenth commit"')
    testTools.exec('git tag ms/7.0.0')
    testTools.writeFileSync('test6', '2')
    testTools.exec('git add --all && git commit -m"eleventh commit"')
    testTools.exec('git tag notms/7.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd,
        tagPrefix: 'ms/'
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['ms/7.0.0', 'ms/6.0.0'])
        resolve()
      })
    })
  })

  it('should skip unstable tags', () => {
    testTools.writeFileSync('test7', '')
    testTools.exec('git add --all && git commit -m"twelfth commit"')
    testTools.exec('git tag skip/8.0.0')
    testTools.writeFileSync('test8', '')
    testTools.exec('git add --all && git commit -m"thirteenth commit"')
    testTools.exec('git tag skip/9.0.0-alpha.1')
    testTools.writeFileSync('test9', '')
    testTools.exec('git add --all && git commit -m"fourteenth commit"')
    testTools.exec('git tag skip/9.0.0-rc.1')
    testTools.writeFileSync('test10', '')
    testTools.exec('git add --all && git commit -m"fifteenth commit"')
    testTools.exec('git tag skip/9.0.0')

    return new Promise((resolve, reject) => {
      gitSemverTags({
        cwd: testTools.cwd,
        tagPrefix: 'skip/',
        skipUnstable: true
      }, (err, tags) => {
        if (err) return reject(err)
        expect(tags).toEqual(['skip/9.0.0', 'skip/8.0.0'])
        resolve()
      })
    })
  })
})
