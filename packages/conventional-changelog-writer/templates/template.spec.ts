import { describe, beforeAll, beforeEach, it, expect } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'

let template: any
let templateContext: any

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
    describe('template', () => {
      beforeAll(async () => {
        template = await fs.readFile(path.resolve(__dirname, './template.hbs'), 'utf8')
      })

      beforeEach(() => {
        Handlebars.registerPartial('header', 'my header\n')
        Handlebars.registerPartial('commit', 'my commit\n')
        Handlebars.registerPartial('footer', 'my footer\n')
        templateContext = {}
      })

      it('should generate template', () => {
        templateContext.commitGroups = [
          {
            commits: [1, 2]
          }
        ]

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('my header\n\nmy commit\nmy commit\nmy footer\n')
      })

      it('should not produce double blank line before noteGroups when footer has content', async () => {
        const footerWithNotes = await fs.readFile(path.resolve(__dirname, './footer.hbs'), 'utf8')

        Handlebars.registerPartial('footer', footerWithNotes)

        templateContext.commitGroups = [
          {
            commits: [1]
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

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('my header\n\nmy commit\n\n### BREAKING CHANGES\n\n* some breaking change\n')
      })
    })
  })
})
