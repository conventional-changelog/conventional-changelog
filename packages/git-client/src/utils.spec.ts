import { describe, it, expect } from 'vitest'
import { Readable } from 'stream'
import {
  toArray,
  toString
} from '../../../tools/test-tools.js'
import {
  spawn,
  stdoutSpawn,
  splitStream,
  formatArgs
} from './utils.js'

describe('git-client', () => {
  describe('utils', () => {
    describe('spawn', () => {
      it('should spawn process', async () => {
        const result = await spawn('echo', ['hello'])

        expect(result.toString()).toBe('hello\n')
      })

      it('should throw error from stderr', async () => {
        await expect(spawn('git', ['spawn-unknown'])).rejects.toThrow()
      }, 1000 * 10)

      it('should throw error from process', async () => {
        await expect(spawn('unknown', ['unknown'])).rejects.toThrow()
      })
    })

    describe('stdoutSpawn', () => {
      it('should spawn process', async () => {
        const result = await toString(stdoutSpawn('echo', ['hello']))

        expect(result).toBe('hello\n')
      })

      it('should throw error from stderr', async () => {
        await expect(toString(stdoutSpawn('git', ['stdoutSpawn-unknown']))).rejects.toThrow()
      })

      it('should throw error from process', async () => {
        await expect(toString(stdoutSpawn('unknown', ['unknown']))).rejects.toThrow()
      })
    })

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
