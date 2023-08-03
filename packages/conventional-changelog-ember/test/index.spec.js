import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import conventionalChangelogCore from 'conventional-changelog-core'
import { TestTools } from '../../../tools/test-tools'
import preset from '../'

let testTools

describe('conventional-changelog-ember', () => {
  beforeEach(() => {
    testTools = new TestTools()

    testTools.gitInit()
    testTools.gitDummyCommit(['Merge pull request #12001 from rwjblue/remove-with-controller', '[CLEANUP beta] Remove {{with}} keyword\'s controller option. Closes #1'])
    testTools.gitDummyCommit(['Merge pull request #11984 from emberjs/fix-each', '[PERF beta] `@each` should remain a stable node for chains.'])
    testTools.gitDummyCommit(['Merge pull request #11970 from pixelhandler/ember-rfc-80', '[DOC Release] Make ArrayProxy public'])
    testTools.gitDummyCommit(['Merge pull request #12010 from duggiefresh/12004-doc-array-methods', '[DOC release] Mark `Ember.Array` methods as public'])
    testTools.gitDummyCommit(['Merge pull request #12017 from rwjblue/deprecate-render-function', '[BUGFIX release] Deprecate specifying `.render` to views/components.'])
    testTools.gitDummyCommit(['Merge pull request #11968 from jayphelps/remove-ember-views-component-block-info', '[FEATURE ember-views-component-block-param-info] remove feature info and unflag tests'])
    testTools.gitDummyCommit(['Merge pull request #1000 from jayphelps/remove-ember-views-component-block-info', '[SECURITY CVE-2014-0013] Ensure primitive value contexts are escaped.'])
    testTools.gitDummyCommit('Bad commit')
    testTools.gitDummyCommit('Merge pull request #2000000 from jayphelps/remove-ember-views-component-block-info')
  })

  afterEach(() => {
    testTools?.cleanup()
  })

  it('should work if there is no semver tag', async () => {
    for await (let chunk of conventionalChangelogCore(
      {
        cwd: testTools.cwd,
        config: preset
      }
    )) {
      chunk = chunk.toString()

      expect(chunk).toContain('[12001]')
      expect(chunk).toContain('Remove {{with}} keyword\'s controller option.')
      expect(chunk).toContain('Release')
      expect(chunk).toContain('### Bug Fixes')
      expect(chunk).toContain('### Cleanup')
      expect(chunk).toContain('### Features')
      expect(chunk).toContain('### Documentation')
      expect(chunk).toContain('### Security')

      expect(chunk).not.toContain('CLEANUP')
      expect(chunk).not.toContain('FEATURE')
      expect(chunk).not.toContain('Bad')
    }
  })
})
