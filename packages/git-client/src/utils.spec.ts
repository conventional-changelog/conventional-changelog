import { describe, it, expect } from 'vitest'
import { formatArgs } from './utils.js'

describe('git-client', () => {
  describe('utils', () => {
    describe('formatArgs', () => {
      it('should format arguments', () => {
        expect(formatArgs('git', 'add', 'file.txt')).toEqual([
          'git',
          'add',
          'file.txt'
        ])
      })

      it('should skip empty arguments', () => {
        expect(formatArgs('git', 'log', '')).toEqual(['git', 'log'])
        expect(formatArgs('git', 'log', null)).toEqual(['git', 'log'])
      })
    })
  })
})
