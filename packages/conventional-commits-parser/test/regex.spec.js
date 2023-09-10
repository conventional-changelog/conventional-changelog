import { describe, afterEach, it, expect } from 'vitest'
import regex from '../lib/regex.js'

describe('conventional-commits-parser', () => {
  describe('regex', () => {
    describe('notes', () => {
      it('should match a simple note', () => {
        const reNotes = regex({
          noteKeywords: ['Breaking News', 'Breaking Change']
        }).notes
        const match = 'Breaking News: This is so important.'.match(reNotes)
        expect(match[0]).toBe('Breaking News: This is so important.')
        expect(match[1]).toBe('Breaking News')
        expect(match[2]).toBe('This is so important.')
      })

      it('should match notes with customized pattern', () => {
        const reNotes = regex({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          notesPattern: (noteKeywords) => new RegExp('^[\\s|*]*(' + noteKeywords + ')[:\\s]+(?:\\[.*\\] )(.*)', 'i')
        }).notes
        const notes = 'BREAKING CHANGE: [Do not match this prefix.] This is so important.'
        const match = notes.match(reNotes)
        expect(match[0]).toEqual(notes)
        expect(match[1]).toBe('BREAKING CHANGE')
        expect(match[2]).toBe('This is so important.')
      })

      it('should be case insensitive', () => {
        const reNotes = regex({
          noteKeywords: ['Breaking News', 'Breaking Change']
        }).notes
        const match = 'BREAKING NEWS: This is so important.'.match(reNotes)
        expect(match[0]).toBe('BREAKING NEWS: This is so important.')
        expect(match[1]).toBe('BREAKING NEWS')
        expect(match[2]).toBe('This is so important.')
      })

      it('should ignore whitespace', () => {
        const reNotes = regex({
          noteKeywords: [' Breaking News', 'Breaking Change ', '', ' Breaking SOLUTION ', '  '],
          issuePrefixes: ['#']
        }).notes
        const match = 'Breaking News: This is so important.'.match(reNotes)
        expect(match[0]).toBe('Breaking News: This is so important.')
        expect(match[1]).toBe('Breaking News')
        expect(match[2]).toBe('This is so important.')
      })

      it('should not accidentally match in a sentence', () => {
        const reNotes = regex({
          noteKeywords: [' Breaking News'],
          issuePrefixes: ['#']
        }).notes
        const match = 'This is a breaking news: So important.'.match(reNotes)
        expect(match).toBe(null)
      })

      it('should not match if there is text after `noteKeywords`', () => {
        const reNotes = regex({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          issuePrefixes: ['#']
        }).notes
        const match = 'BREAKING CHANGES: Wow.'.match(reNotes)
        expect(match).toBe(null)
      })
    })

    describe('references', () => {
      it('should match a simple reference', () => {
        const reReferences = regex({
          referenceActions: ['Closes']
        }).references
        const match = reReferences.exec('closes #1')
        expect(match[0]).toBe('closes #1')
        expect(match[1]).toBe('closes')
        expect(match[2]).toBe('#1')
      })

      it('should be case insensitive', () => {
        const reReferences = regex({
          referenceActions: ['Closes']
        }).references
        const match = reReferences.exec('ClOsEs #1')
        expect(match[0]).toBe('ClOsEs #1')
        expect(match[1]).toBe('ClOsEs')
        expect(match[2]).toBe('#1')
      })

      it('should not match if keywords does not present', () => {
        const reReferences = regex({
          referenceActions: ['Close']
        }).references
        const match = reReferences.exec('Closes #1')
        expect(match).toBe(null)
      })

      it('should take multiple reference keywords', () => {
        const reReferences = regex({
          referenceActions: [' Closes', 'amends', 'fixes']
        }).references
        const match = reReferences.exec('amends #1')
        expect(match[0]).toBe('amends #1')
        expect(match[1]).toBe('amends')
        expect(match[2]).toBe('#1')
      })

      it('should match multiple references', () => {
        const reReferences = regex({
          referenceActions: ['Closes', 'amends']
        }).references
        const string = 'Closes #1 amends #2; closes bug #4'
        let match = reReferences.exec(string)
        expect(match[0]).toBe('Closes #1 ')
        expect(match[1]).toBe('Closes')
        expect(match[2]).toBe('#1 ')

        match = reReferences.exec(string)
        expect(match[0]).toBe('amends #2; ')
        expect(match[1]).toBe('amends')
        expect(match[2]).toBe('#2; ')

        match = reReferences.exec(string)
        expect(match[0]).toBe('closes bug #4')
        expect(match[1]).toBe('closes')
        expect(match[2]).toBe('bug #4')
      })

      it('should match references with mixed content, like JIRA tickets', () => {
        const reReferences = regex({
          referenceActions: ['Closes', 'amends']
        }).references
        const string = 'Closes #JIRA-123 amends #MY-OTHER-PROJECT-123; closes bug #4'
        let match = reReferences.exec(string)
        expect(match[0]).toBe('Closes #JIRA-123 ')
        expect(match[1]).toBe('Closes')
        expect(match[2]).toBe('#JIRA-123 ')

        match = reReferences.exec(string)
        expect(match[0]).toBe('amends #MY-OTHER-PROJECT-123; ')
        expect(match[1]).toBe('amends')
        expect(match[2]).toBe('#MY-OTHER-PROJECT-123; ')

        match = reReferences.exec(string)
        expect(match[0]).toBe('closes bug #4')
        expect(match[1]).toBe('closes')
        expect(match[2]).toBe('bug #4')
      })

      it('should reference an issue without an action', () => {
        const string = 'gh-1, prefix-3, Closes gh-6'
        const reReferences = regex().references

        const match = reReferences.exec(string)
        expect(match[0]).toBe('gh-1, prefix-3, Closes gh-6')
        expect(match[1]).toBe('')
        expect(match[2]).toBe('gh-1, prefix-3, Closes gh-6')
      })

      it('should ignore whitespace', () => {
        const reReferences = regex({
          referenceActions: [' Closes', 'amends ', '', ' fixes ', '   ']
        }).references
        const match = 'closes #1, amends #2, fixes #3'.match(reReferences)
        expect(match).toEqual(['closes #1, ', 'amends #2, ', 'fixes #3'])
      })
    })

    describe('referenceParts', () => {
      let reReferenceParts = regex({
        issuePrefixes: ['#']
      }).referenceParts

      afterEach(() => {
        reReferenceParts.lastIndex = 0
      })

      it('should match simple reference parts', () => {
        const match = reReferenceParts.exec('#1')
        expect(match[0]).toBe('#1')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('#')
        expect(match[3]).toBe('1')
      })

      it('should reference an issue in parenthesis', () => {
        const string = '#27), pinned shelljs to version that works with nyc (#30)'
        let match = reReferenceParts.exec(string)
        expect(match[0]).toBe('#27')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('#')
        expect(match[3]).toBe('27')

        match = reReferenceParts.exec(string)
        expect(match[0]).toBe('), pinned shelljs to version that works with nyc (#30')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('#')
        expect(match[3]).toBe('30')
      })

      it('should match reference parts with something else', () => {
        const match = reReferenceParts.exec('something else #1')
        expect(match[0]).toBe('something else #1')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toBe('1')
      })

      it('should match reference parts with a repository', () => {
        const match = reReferenceParts.exec('repo#1')
        expect(match[0]).toBe('repo#1')
        expect(match[1]).toBe('repo')
        expect(match[3]).toBe('1')
      })

      it('should match JIRA-123 like reference parts', () => {
        const match = reReferenceParts.exec('#JIRA-123')
        expect(match[0]).toBe('#JIRA-123')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('#')
        expect(match[3]).toBe('JIRA-123')
      })

      it('should not match MY-€#%#&-123 mixed symbol reference parts', () => {
        const match = reReferenceParts.exec('#MY-€#%#&-123')
        expect(match).toBe(null)
      })

      it('should match reference parts with multiple references', () => {
        const string = '#1 #2, something #3; repo#4'
        let match = reReferenceParts.exec(string)
        expect(match[0]).toBe('#1')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toBe('1')

        match = reReferenceParts.exec(string)
        expect(match[0]).toBe(' #2')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toBe('2')

        match = reReferenceParts.exec(string)
        expect(match[0]).toBe(', something #3')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toBe('3')

        match = reReferenceParts.exec(string)
        expect(match[0]).toBe('; repo#4')
        expect(match[1]).toBe('repo')
        expect(match[3]).toBe('4')
      })

      it('should match issues with customized prefix', () => {
        const string = 'closes gh-1, amends #2, fixes prefix-3'
        reReferenceParts = regex({
          issuePrefixes: ['gh-', 'prefix-']
        }).referenceParts

        let match = reReferenceParts.exec(string)
        expect(match[0]).toBe('closes gh-1')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('gh-')
        expect(match[3]).toBe('1')

        match = reReferenceParts.exec(string)
        expect(match[0]).toBe(', amends #2, fixes prefix-3')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('prefix-')
        expect(match[3]).toBe('3')
      })

      it('should be case sensitve if set in options', () => {
        const string = 'closes gh-1, amends GH-2, fixes #3'
        reReferenceParts = regex({
          issuePrefixes: ['GH-'],
          issuePrefixesCaseSensitive: true
        }).referenceParts

        const match = reReferenceParts.exec(string)
        expect(match[0]).toBe('closes gh-1, amends GH-2')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toBe('GH-')
        expect(match[3]).toBe('2')
      })

      it('should match nothing if there is no customized prefix', () => {
        const string = 'closes gh-1, amends #2, fixes prefix-3'
        reReferenceParts = regex().referenceParts

        const match = reReferenceParts.exec(string)
        expect(match).toBe(null)
      })
    })

    describe('mentions', () => {
      it('should match basically mention', () => {
        const string = 'Thanks!! @someone'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@someone')
        expect(match[1]).toBe('someone')
      })

      it('should match mention with hyphen', () => {
        const string = 'Thanks!! @some-one'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@some-one')
        expect(match[1]).toBe('some-one')
      })

      it('should match mention with underscore', () => {
        const string = 'Thanks!! @some_one'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@some_one')
        expect(match[1]).toBe('some_one')
      })

      it('should match mention with parentheses', () => {
        const string = 'Fix feature1 (by @someone)'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@someone')
        expect(match[1]).toBe('someone')
      })

      it('should match mention with brackets', () => {
        const string = 'Fix feature1 [by @someone]'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@someone')
        expect(match[1]).toBe('someone')
      })

      it('should match mention with braces', () => {
        const string = 'Fix feature1 {by @someone}'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@someone')
        expect(match[1]).toBe('someone')
      })

      it('should match mention with angle brackets', () => {
        const string = 'Fix feature1 by <@someone>'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toBe('@someone')
        expect(match[1]).toBe('someone')
      })
    })
  })
})
