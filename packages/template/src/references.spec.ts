import {
  describe,
  it,
  expect
} from 'vitest'
import { createReferencesFormatter } from './references.js'

const context = {} as any

function createFormatter(options = {}) {
  return createReferencesFormatter({
    issuePrefixes: ['#'],
    formatIssueUrl: (_context, reference) => `https://tracker/${reference.prefix}${reference.issue}`,
    formatUserUrl: (_context, user) => `https://host/${user}`,
    ...options
  })
}

describe('@conventional-changelog/template', () => {
  describe('references', () => {
    describe('createReferencesFormatter', () => {
      it('should format issue and user references', () => {
        const format = createFormatter()

        expect(format('see #1 by @dlmr', context)).toBe(
          'see [#1](https://tracker/#1) by [@dlmr](https://host/dlmr)'
        )
      })

      it('should collect formatted issue references', () => {
        const format = createFormatter()
        const references: string[] = []

        format('see #1 and #2', context, references)

        expect(references).toEqual(['#1', '#2'])
      })

      it('should keep formatted Markdown segments as is', () => {
        const format = createFormatter()

        expect(format('[#1](https://tracker/1)', context)).toBe('[#1](https://tracker/1)')
        expect(format('[#1][ticket]', context)).toBe('[#1][ticket]')
        expect(format('`#1`', context)).toBe('`#1`')
        expect(format('````#1````', context)).toBe('````#1````')
        expect(format('```js\n// #1\n```', context)).toBe('```js\n// #1\n```')
        expect(format('~~~js\n// #1\n~~~', context)).toBe('~~~js\n// #1\n~~~')
        expect(format('https://tracker/issues/#1', context)).toBe('https://tracker/issues/#1')
      })

      it('should keep parentheses and brackets in links as is', () => {
        const format = createFormatter()

        expect(format('[x](https://tracker/a_(b)/issues/#1)', context)).toBe(
          '[x](https://tracker/a_(b)/issues/#1)'
        )
        expect(format('[see #1 [details]](https://tracker/1)', context)).toBe(
          '[see #1 [details]](https://tracker/1)'
        )
        expect(format('https://tracker/a_(b)/issues/#1', context)).toBe(
          'https://tracker/a_(b)/issues/#1'
        )
      })

      it('should keep a code block with CRLF line endings as is', () => {
        const format = createFormatter()

        expect(format('```js\r\n// #1\r\n```\r\n', context)).toBe('```js\r\n// #1\r\n```\r\n')
      })

      it('should keep an indented code block as is', () => {
        const format = createFormatter()

        expect(format('- item\n  ```js\n  // #1\n  ```', context)).toBe(
          '- item\n  ```js\n  // #1\n  ```'
        )
      })

      it('should not close a code block by a fence with a trailing text', () => {
        const format = createFormatter()

        expect(format('```js\n// #1\n```not a closing fence\n// #2\n```', context)).toBe(
          '```js\n// #1\n```not a closing fence\n// #2\n```'
        )
      })

      it('should format a long text with backticks in a reasonable time', () => {
        const format = createFormatter()
        const text = '`'.repeat(8000) + 'a'.repeat(8000)
        const startedAt = performance.now()

        format(text, context)

        expect(performance.now() - startedAt).toBeLessThan(1000)
      })

      it('should keep an unbalanced backtick effect within its line', () => {
        const format = createFormatter()

        expect(format('unbalanced ` and #1\n#2 on the next line', context)).toBe(
          'unbalanced ` and [#1](https://tracker/#1)\n[#2](https://tracker/#2) on the next line'
        )
      })

      it('should keep a reference as is without an url', () => {
        const format = createFormatter({
          formatIssueUrl: () => '',
          formatUserUrl: () => ''
        })

        expect(format('see #1 by @dlmr', context)).toBe('see #1 by @dlmr')
      })

      it('should keep a scoped package name as is', () => {
        const format = createFormatter()

        expect(format('drop @scope/package', context)).toBe('drop @scope/package')
      })

      it('should escape issue prefixes and support regex prefixes', () => {
        const format = createFormatter({
          issuePrefixes: ['(gh)', /jira-/]
        })

        expect(format('see (gh)1 and jira-2', context)).toBe(
          'see [(gh)1](https://tracker/(gh)1) and [jira-2](https://tracker/jira-2)'
        )
      })

      it('should not format issue references without prefixes', () => {
        const format = createFormatter({
          issuePrefixes: []
        })

        expect(format('word 1 by @dlmr', context)).toBe('word 1 by [@dlmr](https://host/dlmr)')
      })

      it('should support a custom issue pattern', () => {
        const format = createFormatter({
          issuePattern: /[0-9]+/
        })

        expect(format('see #1a2b', context)).toBe('see [#1](https://tracker/#1)a2b')
      })
    })
  })
})
