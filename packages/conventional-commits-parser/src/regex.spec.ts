import { describe, afterEach, it, expect } from 'vitest'
import { getParserRegexes } from './regex.js'

describe('conventional-commits-parser', () => {
  describe('getParserRegexes', () => {
    describe('notes', () => {
      it('should match a simple note', () => {
        const { notes } = getParserRegexes({
          noteKeywords: ['Breaking News', 'Breaking Change']
        })
        const match = 'Breaking News: This is so important.'.match(notes)

        expect(match?.[0]).toBe('Breaking News: This is so important.')
        expect(match?.[1]).toBe('Breaking News')
        expect(match?.[2]).toBe('This is so important.')
      })

      it('should match notes with customized pattern', () => {
        const { notes } = getParserRegexes({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          notesPattern: noteKeywords => new RegExp(`^[\\s|*]*(${noteKeywords})[:\\s]+(?:\\[.*\\] )(.*)`, 'i')
        })
        const message = 'BREAKING CHANGE: [Do not match this prefix.] This is so important.'
        const match = message.match(notes)

        expect(match?.[0]).toBe(message)
        expect(match?.[1]).toBe('BREAKING CHANGE')
        expect(match?.[2]).toBe('This is so important.')
      })

      it('should be case insensitive', () => {
        const { notes } = getParserRegexes({
          noteKeywords: ['Breaking News', 'Breaking Change']
        })
        const match = 'BREAKING NEWS: This is so important.'.match(notes)

        expect(match?.[0]).toBe('BREAKING NEWS: This is so important.')
        expect(match?.[1]).toBe('BREAKING NEWS')
        expect(match?.[2]).toBe('This is so important.')
      })

      it('should ignore whitespace', () => {
        const { notes } = getParserRegexes({
          noteKeywords: [
            ' Breaking News',
            'Breaking Change ',
            '',
            ' Breaking SOLUTION ',
            '  '
          ],
          issuePrefixes: ['#']
        })
        const match = 'Breaking News: This is so important.'.match(notes)

        expect(match?.[0]).toBe('Breaking News: This is so important.')
        expect(match?.[1]).toBe('Breaking News')
        expect(match?.[2]).toBe('This is so important.')
      })

      it('should not accidentally match in a sentence', () => {
        const { notes } = getParserRegexes({
          noteKeywords: [' Breaking News'],
          issuePrefixes: ['#']
        })
        const match = 'This is a breaking news: So important.'.match(notes)

        expect(match).toBe(null)
      })

      it('should not match if there is text after `noteKeywords`', () => {
        const { notes } = getParserRegexes({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          issuePrefixes: ['#']
        })
        const match = 'BREAKING CHANGES: Wow.'.match(notes)

        expect(match).toBe(null)
      })
    })

    describe('references', () => {
      it('should match a simple reference', () => {
        const { references } = getParserRegexes({
          referenceActions: ['Closes']
        })
        const match = references.exec('closes #1')

        expect(match?.[0]).toBe('closes #1')
        expect(match?.[1]).toBe('closes')
        expect(match?.[2]).toBe('#1')
      })

      it('should be case insensitive', () => {
        const { references } = getParserRegexes({
          referenceActions: ['Closes']
        })
        const match = references.exec('ClOsEs #1')

        expect(match?.[0]).toBe('ClOsEs #1')
        expect(match?.[1]).toBe('ClOsEs')
        expect(match?.[2]).toBe('#1')
      })

      it('should not match if keywords does not present', () => {
        const { references } = getParserRegexes({
          referenceActions: ['Close']
        })
        const match = references.exec('Closes #1')

        expect(match).toBe(null)
      })

      it('should take multiple reference keywords', () => {
        const { references } = getParserRegexes({
          referenceActions: [
            ' Closes',
            'amends',
            'fixes'
          ]
        })
        const match = references.exec('amends #1')

        expect(match?.[0]).to.eql('amends #1')
        expect(match?.[1]).to.eql('amends')
        expect(match?.[2]).toBe('#1')
      })

      it('should match multiple references', () => {
        const { references } = getParserRegexes({
          referenceActions: ['Closes', 'amends']
        })
        const message = 'Closes #1 amends #2; closes bug #4'
        let match = references.exec(message)

        expect(match?.[0]).toBe('Closes #1 ')
        expect(match?.[1]).toBe('Closes')
        expect(match?.[2]).toBe('#1 ')

        match = references.exec(message)
        expect(match?.[0]).toBe('amends #2; ')
        expect(match?.[1]).toBe('amends')
        expect(match?.[2]).toBe('#2; ')

        match = references.exec(message)
        expect(match?.[0]).toBe('closes bug #4')
        expect(match?.[1]).toBe('closes')
        expect(match?.[2]).toBe('bug #4')
      })

      it('should match references with mixed content, like JIRA tickets', () => {
        const { references } = getParserRegexes({
          referenceActions: ['Closes', 'amends']
        })
        const message = 'Closes #JIRA-123 amends #MY-OTHER-PROJECT-123; closes bug #4'
        let match = references.exec(message)

        expect(match?.[0]).toBe('Closes #JIRA-123 ')
        expect(match?.[1]).toBe('Closes')
        expect(match?.[2]).toBe('#JIRA-123 ')

        match = references.exec(message)
        expect(match?.[0]).toBe('amends #MY-OTHER-PROJECT-123; ')
        expect(match?.[1]).toBe('amends')
        expect(match?.[2]).toBe('#MY-OTHER-PROJECT-123; ')

        match = references.exec(message)
        expect(match?.[0]).toBe('closes bug #4')
        expect(match?.[1]).toBe('closes')
        expect(match?.[2]).toBe('bug #4')
      })

      it('should reference an issue without an action', () => {
        const { references } = getParserRegexes()
        const body = 'gh-1, prefix-3, Closes gh-6'
        const match = references.exec(body)

        expect(match?.[0]).toBe(body)
        expect(match?.[1]).toBe('')
        expect(match?.[2]).toBe(body)
      })

      it('should ignore whitespace', () => {
        const { references } = getParserRegexes({
          referenceActions: [
            ' Closes',
            'amends ',
            '',
            ' fixes ',
            '   '
          ]
        })
        const match = 'closes #1, amends #2, fixes #3'.match(references)

        expect(match).toEqual([
          'closes #1, ',
          'amends #2, ',
          'fixes #3'
        ])
      })
    })

    describe('referenceParts', () => {
      let { referenceParts } = getParserRegexes({
        issuePrefixes: ['#']
      })

      afterEach(() => {
        referenceParts.lastIndex = 0
      })

      it('should match simple reference parts', () => {
        const match = referenceParts.exec('#1')

        expect(match?.[0]).toBe('#1')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('#')
        expect(match?.[3]).toBe('1')
      })

      it('should reference an issue in parenthesis', () => {
        const body = '#27), pinned shelljs to version that works with nyc (#30)'
        let match = referenceParts.exec(body)

        expect(match?.[0]).toBe('#27')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('#')
        expect(match?.[3]).toBe('27')

        match = referenceParts.exec(body)
        expect(match?.[0]).toBe('), pinned shelljs to version that works with nyc (#30')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('#')
        expect(match?.[3]).toBe('30')
      })

      it('should match reference parts with something else', () => {
        const match = referenceParts.exec('something else #1')

        expect(match?.[0]).toBe('something else #1')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[3]).toBe('1')
      })

      it('should match reference parts with a repository', () => {
        const match = referenceParts.exec('repo#1')

        expect(match?.[0]).toBe('repo#1')
        expect(match?.[1]).toBe('repo')
        expect(match?.[3]).toBe('1')
      })

      it('should match JIRA-123 like reference parts', () => {
        const match = referenceParts.exec('#JIRA-123')

        expect(match?.[0]).toBe('#JIRA-123')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('#')
        expect(match?.[3]).toBe('JIRA-123')
      })

      it('should not match MY-€#%#&-123 mixed symbol reference parts', () => {
        const match = referenceParts.exec('#MY-€#%#&-123')

        expect(match).toBe(null)
      })

      it('should match reference parts with multiple references', () => {
        const body = '#1 #2, something #3; repo#4'
        let match = referenceParts.exec(body)

        expect(match?.[0]).toBe('#1')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[3]).toBe('1')

        match = referenceParts.exec(body)
        expect(match?.[0]).toBe(' #2')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[3]).toBe('2')

        match = referenceParts.exec(body)
        expect(match?.[0]).toBe(', something #3')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[3]).toBe('3')

        match = referenceParts.exec(body)
        expect(match?.[0]).toBe('; repo#4')
        expect(match?.[1]).toBe('repo')
        expect(match?.[3]).toBe('4')
      })

      it('should match issues with customized prefix', () => {
        const body = 'closes gh-1, amends #2, fixes prefix-3'

        referenceParts = getParserRegexes({
          issuePrefixes: ['gh-', 'prefix-']
        }).referenceParts

        let match = referenceParts.exec(body)

        expect(match?.[0]).toBe('closes gh-1')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('gh-')
        expect(match?.[3]).toBe('1')

        match = referenceParts.exec(body)
        expect(match?.[0]).toBe(', amends #2, fixes prefix-3')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('prefix-')
        expect(match?.[3]).toBe('3')
      })

      it('should be case sensitve if set in options', () => {
        const body = 'closes gh-1, amends GH-2, fixes #3'

        referenceParts = getParserRegexes({
          issuePrefixes: ['GH-'],
          issuePrefixesCaseSensitive: true
        }).referenceParts

        const match = referenceParts.exec(body)

        expect(match?.[0]).toBe('closes gh-1, amends GH-2')
        expect(match?.[1]).toBe(undefined)
        expect(match?.[2]).toBe('GH-')
        expect(match?.[3]).toBe('2')
      })

      it('should match nothing if there is no customized prefix', () => {
        const body = 'closes gh-1, amends #2, fixes prefix-3'

        referenceParts = getParserRegexes().referenceParts

        const match = referenceParts.exec(body)

        expect(match).toBe(null)
      })
    })

    describe('mentions', () => {
      it('should match basically mention', () => {
        const body = 'Thanks!! @someone'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@someone')
        expect(match?.[1]).toBe('someone')
      })

      it('should match mention with hyphen', () => {
        const body = 'Thanks!! @some-one'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@some-one')
        expect(match?.[1]).toBe('some-one')
      })

      it('should match mention with underscore', () => {
        const body = 'Thanks!! @some_one'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@some_one')
        expect(match?.[1]).toBe('some_one')
      })

      it('should match mention with parentheses', () => {
        const body = 'Fix feature1 (by @someone)'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@someone')
        expect(match?.[1]).toBe('someone')
      })

      it('should match mention with brackets', () => {
        const body = 'Fix feature1 [by @someone]'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@someone')
        expect(match?.[1]).toBe('someone')
      })

      it('should match mention with braces', () => {
        const body = 'Fix feature1 {by @someone}'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@someone')
        expect(match?.[1]).toBe('someone')
      })

      it('should match mention with angle brackets', () => {
        const body = 'Fix feature1 by <@someone>'
        const { mentions } = getParserRegexes()
        const match = mentions.exec(body)

        expect(match?.[0]).toBe('@someone')
        expect(match?.[1]).toBe('someone')
      })
    })
  })
})
