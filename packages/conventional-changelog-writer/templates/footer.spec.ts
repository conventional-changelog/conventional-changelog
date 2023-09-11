import { describe, beforeAll, beforeEach, it, expect } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'

let template
let templateContext

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
    describe('footer', () => {
      beforeAll(async () => {
        template = await fs.readFile(path.resolve(__dirname, './footer.hbs'), 'utf8')
      })

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
