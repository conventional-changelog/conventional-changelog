import {
  describe,
  it,
  expect
} from 'vitest'
import { parseHostedGitUrl } from './hostedGitInfo.js'
import { samples } from './hostedGitInfo.mock.js'

describe('conventional-changelog', () => {
  describe('hostedGitInfo', () => {
    describe('parseHostedGitUrl', () => {
      it('should parse all samples', () => {
        samples.forEach(([url, data]) => {
          expect(parseHostedGitUrl(url)).toEqual(data)
        })
      })
    })
  })
})
