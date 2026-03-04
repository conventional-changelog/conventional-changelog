import { describe, beforeEach, it, expect } from 'vitest'
import Handlebars from 'handlebars'
import { footerPartial as template } from '../src/templates.js'

let templateContext: any

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
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
        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('\n### my title\n\n* my note 1\n* my note 2\n\n### my other title\n\n* my note 3\n* my note 4\n')
      })
    })
  })
})
