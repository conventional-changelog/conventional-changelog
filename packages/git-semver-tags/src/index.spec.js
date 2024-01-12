import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { TestTools } from '../../../tools/index.ts'
import { getSemverTags } from './index.js'

let testTools

describe('git-semver-tags', () => {
  beforeAll(() => {
    testTools = new TestTools()
    testTools.gitInit()
  })

  afterAll(() => {
    testTools?.cleanup()
  })

  it('should error if no commits found', async () => {
    await expect(() => getSemverTags({
      cwd: testTools.cwd
    })).rejects.toThrow()
  })

  it('should get no semver tags', async () => {
    testTools.writeFileSync('test1', '')
    testTools.exec('git add --all && git commit -m"First commit"')
    testTools.exec('git tag foo')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual([])
  })

  it('should get the semver tag', async () => {
    testTools.writeFileSync('test2', '')
    testTools.exec('git add --all && git commit -m"Second commit"')
    testTools.exec('git tag v2.0.0')
    testTools.writeFileSync('test3', '')
    testTools.exec('git add --all && git commit -m"Third commit"')
    testTools.exec('git tag va.b.c')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v2.0.0'])
  })

  it('should get both semver tags', async () => {
    testTools.exec('git tag v3.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v3.0.0', 'v2.0.0'])
  })

  it('should get all semver tags if two tags on the same commit', async () => {
    testTools.exec('git tag v4.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v4.0.0', 'v3.0.0', 'v2.0.0'])
  })

  it('should still work if I run it again', async () => {
    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v4.0.0', 'v3.0.0', 'v2.0.0'])
  })

  it('should be in reverse chronological order', async () => {
    testTools.writeFileSync('test4', '')
    testTools.exec('git add --all && git commit -m"Fourth commit"')
    testTools.exec('git tag v1.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v1.0.0', 'v4.0.0', 'v3.0.0', 'v2.0.0'])
  })

  it('should work with prerelease', async () => {
    testTools.writeFileSync('test5', '')
    testTools.exec('git add --all && git commit -m"Fifth commit"')
    testTools.exec('git tag 5.0.0-pre')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['5.0.0-pre', 'v1.0.0', 'v4.0.0', 'v3.0.0', 'v2.0.0'])
  })

  it('should work with empty commit', async () => {
    testTools?.cleanup()
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit('empty commit')
    testTools.exec('git tag v1.1.0')
    testTools.exec('git tag blarg-project@1.0.0') // should be ignored.
    testTools.gitCommit('empty commit2')
    testTools.gitCommit('empty commit3')

    const tags = await getSemverTags({
      cwd: testTools.cwd
    })

    expect(tags).toEqual(['v1.1.0'])
  })

  it('should work with lerna style tags', async () => {
    testTools.writeFileSync('test5', '2')
    testTools.exec('git add --all && git commit -m"sixth commit"')
    testTools.exec('git tag foo-project@4.0.0')
    testTools.writeFileSync('test5', '3')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag foo-project@5.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      lernaTags: true
    })

    expect(tags).toEqual(['foo-project@5.0.0', 'foo-project@4.0.0', 'blarg-project@1.0.0'])
  })

  it('should work with lerna style tags with multiple digits', async () => {
    testTools.writeFileSync('test5', '4')
    testTools.exec('git add --all && git commit -m"fifth commit"')
    testTools.exec('git tag foobar-project@0.0.10')
    testTools.writeFileSync('test5', '5')
    testTools.exec('git add --all && git commit -m"sixth commit"')
    testTools.exec('git tag foobar-project@0.10.0')
    testTools.writeFileSync('test5', '6')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag foobar-project@10.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      lernaTags: true
    })

    expect(tags).toEqual([
      'foobar-project@10.0.0',
      'foobar-project@0.10.0',
      'foobar-project@0.0.10',
      'foo-project@5.0.0',
      'foo-project@4.0.0',
      'blarg-project@1.0.0'
    ])
  })

  it('should allow lerna style tags to be filtered by package', async () => {
    testTools.writeFileSync('test5', '')
    testTools.exec('git add --all && git commit -m"seventh commit"')
    testTools.exec('git tag bar-project@5.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      lernaTags: true,
      package: 'bar-project'
    })

    expect(tags).toEqual(['bar-project@5.0.0'])
  })

  it('should not allow package filter without lernaTags=true', async () => {
    await expect(() => getSemverTags({
      cwd: testTools.cwd,
      package: 'bar-project'
    })).rejects.toThrow('opts.package should only be used when running in lerna mode')
  })

  it('should work with tag prefix option', async () => {
    testTools.writeFileSync('test6', '')
    testTools.exec('git add --all && git commit -m"eighth commit"')
    testTools.exec('git tag ms/6.0.0')
    testTools.writeFileSync('test6', '1')
    testTools.exec('git add --all && git commit -m"tenth commit"')
    testTools.exec('git tag ms/7.0.0')
    testTools.writeFileSync('test6', '2')
    testTools.exec('git add --all && git commit -m"eleventh commit"')
    testTools.exec('git tag notms/7.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      tagPrefix: 'ms/'
    })

    expect(tags).toEqual(['ms/7.0.0', 'ms/6.0.0'])
  })

  it('should handle regexp escaped characters in the tag prefix', async () => {
    testTools.writeFileSync('test6', '')
    testTools.exec('git add --all && git commit -m"eighth commit"')
    testTools.exec('git tag ms+6.0.0')
    testTools.writeFileSync('test6', '1')
    testTools.exec('git add --all && git commit -m"tenth commit"')
    testTools.exec('git tag ms+7.0.0')
    testTools.writeFileSync('test6', '2')
    testTools.exec('git add --all && git commit -m"eleventh commit"')
    testTools.exec('git tag notms+7.0.0')

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      tagPrefix: 'ms+'
    })

    expect(tags).toEqual(['ms+7.0.0', 'ms+6.0.0'])
  })

  it('should skip unstable tags', async () => {
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

    const tags = await getSemverTags({
      cwd: testTools.cwd,
      tagPrefix: 'skip/',
      skipUnstable: true
    })

    expect(tags).toEqual(['skip/9.0.0', 'skip/8.0.0'])
  })
})
