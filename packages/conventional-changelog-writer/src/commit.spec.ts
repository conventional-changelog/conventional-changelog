import { describe, it, expect } from 'vitest'
import { transformCommit } from './commit.js'

describe('conventional-changelog-writer', () => {
  describe('commit', () => {
    describe('transformCommit', () => {
      const commit = {
        hash: '456789uhghi',
        subject: 'my subject!!!',
        replaceThis: 'bad',
        doNothing: 'nothing',
        notes: []
      }
      const options = {} as any
      const context = {} as any

      it('should process object commit', async () => {
        const processed = await transformCommit(commit, null, options, context)

        expect(processed).toEqual({
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
          notes: [],
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing',
            notes: []
          }
        })
      })

      it('should transform by a function', async () => {
        const processed = await transformCommit(commit, commit => ({
          hash: commit.hash.substring(0, 4),
          subject: commit.subject.substring(0, 5),
          replaceThis: 'replaced'
        }), options, context)

        expect(processed).toEqual({
          hash: '4567',
          subject: 'my su',
          replaceThis: 'replaced',
          doNothing: 'nothing',
          notes: [],
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing',
            notes: []
          }
        })
      })

      it('should prevent source commit modification by a transform function', async () => {
        await expect(() => transformCommit(commit, (commit) => {
          commit.hash = commit.hash.substring(0, 4)
          return commit
        }, options, context)).rejects.toThrow('Cannot modify immutable object.')
      })
    })
  })
})
