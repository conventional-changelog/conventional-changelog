import { describe, beforeEach, it, expect } from 'vitest'
import Handlebars from 'handlebars'
import { headerPartial as template } from '../src/templates.js'

let templateContext: any

describe('conventional-changelog-writer', () => {
  describe('templates', () => {
    describe('header', () => {
      beforeEach(() => {
        templateContext = {
          version: 'my version'
        }
      })

      it('should generate header if `isPatch` is truthy', () => {
        templateContext.isPatch = true

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## <small>my version</small>\n')
      })

      it('should generate header if `isPatch` is falsy', () => {
        templateContext.isPatch = false

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version\n')
      })

      it('should generate header if `title` is truthy', () => {
        templateContext.title = 'my title'

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version "my title"\n')
      })

      it('should generate header if `date` is truthy', () => {
        templateContext.date = 'my date'

        const log = Handlebars.compile(template)(templateContext)

        expect(log).toBe('## my version (my date)\n')
      })
    })
  })
})
