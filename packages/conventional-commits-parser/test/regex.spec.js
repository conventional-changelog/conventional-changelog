import { describe, afterEach, it, expect } from 'vitest'
import regex from '../lib/regex'

describe('conventional-commits-parser', () => {
  describe('regex', () => {
    describe('notes', () => {
      it('should match a simple note', () => {
        const reNotes = regex({
          noteKeywords: ['Breaking News', 'Breaking Change']
        }).notes
        const match = 'Breaking News: This is so important.'.match(reNotes)
        expect(match[0]).toEqual('Breaking News: This is so important.')
        expect(match[1]).toEqual('Breaking News')
        expect(match[2]).toEqual('This is so important.')
      })

      it('should match notes with customized pattern', () => {
        const reNotes = regex({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          notesPattern: (noteKeywords) => new RegExp('^[\\s|*]*(' + noteKeywords + ')[:\\s]+(?:\\[.*\\] )(.*)', 'i')
        }).notes
        const notes = 'BREAKING CHANGE: [Do not match this prefix.] This is so important.'
        const match = notes.match(reNotes)
        expect(match[0]).toEqual(notes)
        expect(match[1]).toEqual('BREAKING CHANGE')
        expect(match[2]).toEqual('This is so important.')
      })

      it('should be case insensitive', () => {
        const reNotes = regex({
          noteKeywords: ['Breaking News', 'Breaking Change']
        }).notes
        const match = 'BREAKING NEWS: This is so important.'.match(reNotes)
        expect(match[0]).toEqual('BREAKING NEWS: This is so important.')
        expect(match[1]).toEqual('BREAKING NEWS')
        expect(match[2]).toEqual('This is so important.')
      })

      it('should ignore whitespace', () => {
        const reNotes = regex({
          noteKeywords: [' Breaking News', 'Breaking Change ', '', ' Breaking SOLUTION ', '  '],
          issuePrefixes: ['#']
        }).notes
        const match = 'Breaking News: This is so important.'.match(reNotes)
        expect(match[0]).toEqual('Breaking News: This is so important.')
        expect(match[1]).toEqual('Breaking News')
        expect(match[2]).toEqual('This is so important.')
      })

      it('should not accidentally match in a sentence', () => {
        const reNotes = regex({
          noteKeywords: [' Breaking News'],
          issuePrefixes: ['#']
        }).notes
        const match = 'This is a breaking news: So important.'.match(reNotes)
        expect(match).toEqual(null)
      })

      it('should not match if there is text after `noteKeywords`', () => {
        const reNotes = regex({
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE'],
          issuePrefixes: ['#']
        }).notes
        const match = 'BREAKING CHANGES: Wow.'.match(reNotes)
        expect(match).toEqual(null)
      })
    })

    describe('references', () => {
      it('should match a simple reference', () => {
        const reReferences = regex({
          referenceActions: ['Closes']
        }).references
        const match = reReferences.exec('closes #1')
        expect(match[0]).toEqual('closes #1')
        expect(match[1]).toEqual('closes')
        expect(match[2]).toEqual('#1')
      })

      it('should be case insensitive', () => {
        const reReferences = regex({
          referenceActions: ['Closes']
        }).references
        const match = reReferences.exec('ClOsEs #1')
        expect(match[0]).toEqual('ClOsEs #1')
        expect(match[1]).toEqual('ClOsEs')
        expect(match[2]).toEqual('#1')
      })

      it('should not match if keywords does not present', () => {
        const reReferences = regex({
          referenceActions: ['Close']
        }).references
        const match = reReferences.exec('Closes #1')
        expect(match).toEqual(null)
      })

      it('should take multiple reference keywords', () => {
        const reReferences = regex({
          referenceActions: [' Closes', 'amends', 'fixes']
        }).references
        const match = reReferences.exec('amends #1')
        expect(match[0]).toEqual('amends #1')
        expect(match[1]).toEqual('amends')
        expect(match[2]).toEqual('#1')
      })

      it('should match multiple references', () => {
        const reReferences = regex({
          referenceActions: ['Closes', 'amends']
        }).references
        const string = 'Closes #1 amends #2; closes bug #4'
        let match = reReferences.exec(string)
        expect(match[0]).toEqual('Closes #1 ')
        expect(match[1]).toEqual('Closes')
        expect(match[2]).toEqual('#1 ')

        match = reReferences.exec(string)
        expect(match[0]).toEqual('amends #2; ')
        expect(match[1]).toEqual('amends')
        expect(match[2]).toEqual('#2; ')

        match = reReferences.exec(string)
        expect(match[0]).toEqual('closes bug #4')
        expect(match[1]).toEqual('closes')
        expect(match[2]).toEqual('bug #4')
      })

      it('should match references with mixed content, like JIRA tickets', () => {
        const reReferences = regex({
          referenceActions: ['Closes', 'amends']
        }).references
        const string = 'Closes #JIRA-123 amends #MY-OTHER-PROJECT-123; closes bug #4'
        let match = reReferences.exec(string)
        expect(match[0]).toEqual('Closes #JIRA-123 ')
        expect(match[1]).toEqual('Closes')
        expect(match[2]).toEqual('#JIRA-123 ')

        match = reReferences.exec(string)
        expect(match[0]).toEqual('amends #MY-OTHER-PROJECT-123; ')
        expect(match[1]).toEqual('amends')
        expect(match[2]).toEqual('#MY-OTHER-PROJECT-123; ')

        match = reReferences.exec(string)
        expect(match[0]).toEqual('closes bug #4')
        expect(match[1]).toEqual('closes')
        expect(match[2]).toEqual('bug #4')
      })

      it('should reference an issue without an action', () => {
        const string = 'gh-1, prefix-3, Closes gh-6'
        const reReferences = regex().references

        const match = reReferences.exec(string)
        expect(match[0]).toEqual('gh-1, prefix-3, Closes gh-6')
        expect(match[1]).toEqual('')
        expect(match[2]).toEqual('gh-1, prefix-3, Closes gh-6')
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
        expect(match[0]).toEqual('#1')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('#')
        expect(match[3]).toEqual('1')
      })

      it('should reference an issue in parenthesis', () => {
        const string = '#27), pinned shelljs to version that works with nyc (#30)'
        let match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('#27')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('#')
        expect(match[3]).toEqual('27')

        match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('), pinned shelljs to version that works with nyc (#30')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('#')
        expect(match[3]).toEqual('30')
      })

      it('should match reference parts with something else', () => {
        const match = reReferenceParts.exec('something else #1')
        expect(match[0]).toEqual('something else #1')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toEqual('1')
      })

      it('should match reference parts with a repository', () => {
        const match = reReferenceParts.exec('repo#1')
        expect(match[0]).toEqual('repo#1')
        expect(match[1]).toEqual('repo')
        expect(match[3]).toEqual('1')
      })

      it('should match JIRA-123 like reference parts', () => {
        const match = reReferenceParts.exec('#JIRA-123')
        expect(match[0]).toEqual('#JIRA-123')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('#')
        expect(match[3]).toEqual('JIRA-123')
      })

      it('should not match MY-€#%#&-123 mixed symbol reference parts', () => {
        const match = reReferenceParts.exec('#MY-€#%#&-123')
        expect(match).toEqual(null)
      })

      it('should match reference parts with multiple references', () => {
        const string = '#1 #2, something #3; repo#4'
        let match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('#1')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toEqual('1')

        match = reReferenceParts.exec(string)
        expect(match[0]).toEqual(' #2')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toEqual('2')

        match = reReferenceParts.exec(string)
        expect(match[0]).toEqual(', something #3')
        expect(match[1]).toEqual(undefined)
        expect(match[3]).toEqual('3')

        match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('; repo#4')
        expect(match[1]).toEqual('repo')
        expect(match[3]).toEqual('4')
      })

      it('should match issues with customized prefix', () => {
        const string = 'closes gh-1, amends #2, fixes prefix-3'
        reReferenceParts = regex({
          issuePrefixes: ['gh-', 'prefix-']
        }).referenceParts

        let match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('closes gh-1')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('gh-')
        expect(match[3]).toEqual('1')

        match = reReferenceParts.exec(string)
        expect(match[0]).toEqual(', amends #2, fixes prefix-3')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('prefix-')
        expect(match[3]).toEqual('3')
      })

      it('should be case sensitve if set in options', () => {
        const string = 'closes gh-1, amends GH-2, fixes #3'
        reReferenceParts = regex({
          issuePrefixes: ['GH-'],
          issuePrefixesCaseSensitive: true
        }).referenceParts

        const match = reReferenceParts.exec(string)
        expect(match[0]).toEqual('closes gh-1, amends GH-2')
        expect(match[1]).toEqual(undefined)
        expect(match[2]).toEqual('GH-')
        expect(match[3]).toEqual('2')
      })

      it('should match nothing if there is no customized prefix', () => {
        const string = 'closes gh-1, amends #2, fixes prefix-3'
        reReferenceParts = regex().referenceParts

        const match = reReferenceParts.exec(string)
        expect(match).toEqual(null)
      })
    })

    describe('mentions', () => {
      it('should match basically mention', () => {
        const string = 'Thanks!! @someone'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@someone')
        expect(match[1]).toEqual('someone')
      })

      it('should match mention with hyphen', () => {
        const string = 'Thanks!! @some-one'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@some-one')
        expect(match[1]).toEqual('some-one')
      })

      it('should match mention with underscore', () => {
        const string = 'Thanks!! @some_one'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@some_one')
        expect(match[1]).toEqual('some_one')
      })

      it('should match mention with parentheses', () => {
        const string = 'Fix feature1 (by @someone)'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@someone')
        expect(match[1]).toEqual('someone')
      })

      it('should match mention with brackets', () => {
        const string = 'Fix feature1 [by @someone]'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@someone')
        expect(match[1]).toEqual('someone')
      })

      it('should match mention with braces', () => {
        const string = 'Fix feature1 {by @someone}'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@someone')
        expect(match[1]).toEqual('someone')
      })

      it('should match mention with angle brackets', () => {
        const string = 'Fix feature1 by <@someone>'
        const mentions = regex().mentions

        const match = mentions.exec(string)
        expect(match[0]).toEqual('@someone')
        expect(match[1]).toEqual('someone')
      })
    })
  })
})
