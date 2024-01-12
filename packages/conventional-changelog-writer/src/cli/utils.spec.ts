import { describe, it, expect } from 'vitest'
import { Readable } from 'stream'
import { toArray } from '../../../../tools/index.js'
import { parseJsonStream } from './utils.js'

describe('conventional-changelog-writer', () => {
  describe('cli', () => {
    describe('splitStream', () => {
      it('should split strings stream by separator', async () => {
        const stream = Readable.from([
          '[1]\n[2]\n',
          '[3]\n',
          '[4]\n[5]\n[6]'
        ])
        const result = await toArray(parseJsonStream(stream))

        expect(result).toEqual([
          [1],
          [2],
          [3],
          [4],
          [5],
          [6]
        ])
      })
    })
  })
})
