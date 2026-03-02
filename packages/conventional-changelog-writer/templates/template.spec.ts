import { describe, beforeEach, it, expect } from 'vitest'
import Handlebars from 'handlebars'
import { mainTemplate as template, footerPartial } from '../src/templates.js'

let templateContext: any

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
    describe('template', () => {
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

      it('should not produce double blank line before noteGroups when footer has content', () => {
        Handlebars.registerPartial('footer', footerPartial)

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
