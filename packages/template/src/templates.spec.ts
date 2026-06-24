import {
  describe,
  beforeEach,
  it,
  expect
} from 'vitest'
import {
  template,
  headerPartial,
  commitPartial,
  footerPartial
} from './templates.js'

let templateContext: any

function render(context: any) {
  return `* ${commitPartial(context, context)}`
}

describe('@conventional-changelog/template', () => {
  describe('templates', () => {
    describe('header', () => {
      beforeEach(() => {
        templateContext = {
          version: 'my version'
        }
      })

      it('should generate header if `isPatch` is truthy', () => {
        templateContext.isPatch = true

        const log = headerPartial(templateContext)

        expect(log).toBe('## <small>my version</small>')
      })

      it('should generate header if `isPatch` is falsy', () => {
        templateContext.isPatch = false

        const log = headerPartial(templateContext)

        expect(log).toBe('## my version')
      })

      it('should generate header if `title` is truthy', () => {
        templateContext.title = 'my title'

        const log = headerPartial(templateContext)

        expect(log).toBe('## my version "my title"')
      })

      it('should generate header if `date` is truthy', () => {
        templateContext.date = 'my date'

        const log = headerPartial(templateContext)

        expect(log).toBe('## my version (my date)')
      })
    })

    describe('footer', () => {
      beforeEach(() => {
        templateContext = {
          noteGroups: [
            {
              title: 'my title',
              notes: [
                {
                  title: 'my title',
                  text: 'my note 1'
                },
                {
                  title: 'my title',
                  text: 'my note 2'
                }
              ]
            },
            {
              title: 'my other title',
              notes: [
                {
                  title: 'my other title',
                  text: 'my note 3'
                },
                {
                  title: 'my other title',
                  text: 'my note 4'
                }
              ]
            }
          ]
        }
      })

      it('should generate footer', () => {
        const log = footerPartial(templateContext)

        expect(log).toBe('### my title\n\n* my note 1\n* my note 2\n\n### my other title\n\n* my note 3\n* my note 4')
      })
    })

    describe('commit', () => {
      beforeEach(() => {
        templateContext = {
          header: 'my header',
          host: 'www.myhost.com',
          owner: 'a',
          repository: 'b',
          commit: 'my commits',
          issue: 'my issue',
          hash: 'hash'
        }
      })

      it('should ignore host and owner if they do not exist and just use repository to link', () => {
        const log = render({
          header: 'my header',
          repository: 'www.myhost.com/a/b',
          commit: 'my commits',
          issue: 'my issue',
          hash: 'hash',
          linkReferences: true,
          references: [
            {
              issue: 1
            }
          ]
        })

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [#1](www.myhost.com/a/b/my issue/1)')
      })

      it('should ignore owner if it does not exist and use host and repository to link', () => {
        const log = render({
          header: 'my header',
          host: 'www.myhost.com',
          repository: 'a/b',
          commit: 'my commits',
          issue: 'my issue',
          hash: 'hash',
          linkReferences: true,
          references: [
            {
              issue: 1
            }
          ]
        })

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [#1](www.myhost.com/a/b/my issue/1)')
      })

      it('should just use repoUrl to link', () => {
        const log = render({
          header: 'my header',
          host: 'www.myhost.com',
          repoUrl: 'www.myhost.com',
          commit: 'my commits',
          issue: 'my issue',
          hash: 'hash',
          linkReferences: true,
          references: [
            {
              issue: 1
            }
          ]
        })

        expect(log).toBe('* my header ([hash](www.myhost.com/my commits/hash)), closes [#1](www.myhost.com/my issue/1)')
      })

      it('should not link the commit if `linkReferences` is falsy', () => {
        const log = render(templateContext)

        expect(log).toBe('* my header hash')
      })

      it('should link the commit if `linkReferences` is truthy', () => {
        templateContext.linkReferences = true

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash))')
      })

      it('should link reference commit if `linkReferences` is truthy and no `owner`', () => {
        templateContext.linkReferences = true
        templateContext.owner = null
        templateContext.repository = 'a/b'

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash))')
      })

      it('should not link reference if `references` is truthy and `linkReferences` is falsy', () => {
        templateContext.references = [
          {
            issue: 1
          },
          {
            issue: 2
          },
          {
            issue: 3
          }
        ]

        const log = render(templateContext)

        expect(log).toBe('* my header hash, closes #1 #2 #3')
      })

      it('should link reference if `references` is truthy and `linkReferences` is truthy', () => {
        templateContext.linkReferences = true
        templateContext.references = [
          {
            issue: 1
          },
          {
            issue: 2
          },
          {
            issue: 3
          }
        ]

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [#1](www.myhost.com/a/b/my issue/1) [#2](www.myhost.com/a/b/my issue/2) [#3](www.myhost.com/a/b/my issue/3)')
      })

      it('should link reference if `references` is truthy and `linkReferences` is truthy without an owner', () => {
        templateContext.linkReferences = true
        templateContext.owner = null
        templateContext.repository = 'a/b'
        templateContext.references = [
          {
            issue: 1
          },
          {
            issue: 2
          },
          {
            issue: 3
          }
        ]

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [#1](www.myhost.com/a/b/my issue/1) [#2](www.myhost.com/a/b/my issue/2) [#3](www.myhost.com/a/b/my issue/3)')
      })

      it('should link reference from a different repository with an owner', () => {
        templateContext.linkReferences = true
        templateContext.references = [
          {
            owner: 'c',
            repository: 'd',
            issue: 1
          }
        ]

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [c/d#1](www.myhost.com/c/d/my issue/1)')
      })

      it('should link reference from a different repository without an owner', () => {
        templateContext.linkReferences = true
        templateContext.references = [
          {
            repository: 'c/d',
            issue: 1
          }
        ]

        const log = render(templateContext)

        expect(log).toBe('* my header ([hash](www.myhost.com/a/b/my commits/hash)), closes [c/d#1](www.myhost.com/c/d/my issue/1)')
      })
    })

    describe('template', () => {
      beforeEach(() => {
        templateContext = {
          version: 'my version',
          headerPartial,
          commitPartial,
          footerPartial
        }
      })

      it('should generate template', () => {
        templateContext.commitGroups = [
          {
            commits: [
              {
                header: 'my commit'
              },
              {
                header: 'my other commit'
              }
            ]
          }
        ]

        const log = template(templateContext)

        expect(log).toBe('## my version\n\n* my commit\n* my other commit')
      })

      it('should generate template with customized partials', () => {
        templateContext.headerPartial = () => 'my header'
        templateContext.commitPartial = (_context: any, commit: any) => commit.header
        templateContext.footerPartial = () => 'my footer'
        templateContext.commitGroups = [
          {
            commits: [
              {
                header: 'my commit'
              },
              {
                header: 'my other commit'
              }
            ]
          }
        ]

        const log = template(templateContext)

        expect(log).toBe('my header\n\n* my commit\n* my other commit\n\nmy footer')
      })

      it('should not produce double blank line before noteGroups when footer has content', () => {
        templateContext.commitGroups = [
          {
            commits: [
              {
                header: 'my commit'
              }
            ]
          }
        ]
        templateContext.noteGroups = [
          {
            title: 'BREAKING CHANGES',
            notes: [
              {
                text: 'some breaking change'
              }
            ]
          }
        ]

        const log = template(templateContext)

        expect(log).toBe('## my version\n\n* my commit\n\n### BREAKING CHANGES\n\n* some breaking change')
      })
    })
  })
})
