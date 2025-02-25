import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import { ConventionalChangelog } from 'conventional-changelog'
import {
  TestTools,
  toArray
} from '../../../tools/index.ts'
import preset from '../src/index.js'

let testTools

describe('conventional-changelog-ember', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitCommit(['Merge pull request #12001 from rwjblue/remove-with-controller', '[CLEANUP beta] Remove {{with}} keyword\'s controller option. Closes #1'])
    testTools.gitCommit(['Merge pull request #11984 from emberjs/fix-each', '[PERF beta] `@each` should remain a stable node for chains.'])
    testTools.gitCommit(['Merge pull request #11970 from pixelhandler/ember-rfc-80', '[DOC Release] Make ArrayProxy public'])
    testTools.gitCommit(['Merge pull request #12010 from duggiefresh/12004-doc-array-methods', '[DOC release] Mark `Ember.Array` methods as public'])
    testTools.gitCommit(['Merge pull request #12017 from rwjblue/deprecate-render-function', '[BUGFIX release] Deprecate specifying `.render` to views/components.'])
    testTools.gitCommit(['Merge pull request #11968 from jayphelps/remove-ember-views-component-block-info', '[FEATURE ember-views-component-block-param-info] remove feature info and unflag tests'])
    testTools.gitCommit(['Merge pull request #1000 from jayphelps/remove-ember-views-component-block-info', '[SECURITY CVE-2014-0013] Ensure primitive value contexts are escaped.'])
    testTools.gitCommit('Bad commit')
    testTools.gitCommit('Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info')
  })

  afterEach(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    const log = new ConventionalChangelog(testTools.cwd)
      .readPackage()
      .config(preset())
      .write()
    const chunks = await toArray(log)

    expect(chunks[0]).toContain('[12001]')
    expect(chunks[0]).toContain('Remove {{with}} keyword\'s controller option.')
    expect(chunks[0]).toContain('Release')
    expect(chunks[0]).toContain('### Bug Fixes')
    expect(chunks[0]).toContain('### Cleanup')
    expect(chunks[0]).toContain('### Features')
    expect(chunks[0]).toContain('### Documentation')
    expect(chunks[0]).toContain('### Security')

    expect(chunks[0]).not.toContain('CLEANUP')
    expect(chunks[0]).not.toContain('FEATURE')
    expect(chunks[0]).not.toContain('Bad')
  })
})
