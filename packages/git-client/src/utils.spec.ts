import { describe, it, expect } from 'vitest'
import { Readable } from 'stream'
import { toArray } from '../../../tools/test-tools.js'
import {
  splitStream,
  formatArgs
} from './utils.js'

describe('git-client', () => {
  describe('utils', () => {
    describe('splitStream', () => {
      it('should split strings stream by separator', async () => {
        const stream = Readable.from([
          '1 2',
          ' 3',
          ' 4 5 6'
        ])
        const result = await toArray(splitStream(stream, ' '))

        expect(result).toEqual([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6'
        ])
      })
    })

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

      it('should format arrays', () => {
        expect(formatArgs('git', ['log', ['']])).toEqual(['git', 'log'])
        expect(formatArgs('git', ['log', [null]])).toEqual(['git', 'log'])
      })
    })
  })
})
