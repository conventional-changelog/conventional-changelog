import { describe, it, expect } from 'vitest'
import { createComparator } from './utils.js'

describe('conventional-changelog-writer', () => {
  describe('utils', () => {
    describe('createComparator', () => {
      it('should turn any truthy value into a function', () => {
        const func = createComparator('a')

        expect(func).toBeTypeOf('function')
      })

      it('should not change falsy value', () => {
        const func = createComparator(undefined)

        expect(func).toBe(undefined)
      })
    })
  })
})
