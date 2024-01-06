import { describe, it, expect } from 'vitest'
import { Readable } from 'stream'
import { toArray } from '../../../../tools/test-tools.js'
import { splitStream } from './utils.js'

describe('conventional-commits-parser', () => {
  describe('cli', () => {
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
  })
})
