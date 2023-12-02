import { describe, beforeAll, beforeEach, it, expect } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import Handlebars from 'handlebars'

let template
let templateContext

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

        expect(log).toBe('my header\n\nmy commit\nmy commit\n\nmy footer\n\n\n')
      })
    })
  })
})
