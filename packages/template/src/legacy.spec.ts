import {
  describe,
  it,
  expect
} from 'vitest'
import { createLegacyWriterGuard } from './legacy.js'

describe('@conventional-changelog/template', () => {
  describe('legacy', () => {
    describe('createLegacyWriterGuard', () => {
      it('should plant a mainTemplate which triggers the handlebars helperMissing hook', () => {
        const { mainTemplate } = createLegacyWriterGuard('test-preset')

        expect(mainTemplate).toMatch(/^\{\{\[[^\]]+\] true\}\}$/)
      })

      it('should mention the preset name in the error message', () => {
        const { mainTemplate } = createLegacyWriterGuard('test-preset')

        expect(mainTemplate).toContain(
          'test-preset requires conventional-changelog-writer@9 or newer'
        )
      })
    })
  })
})
