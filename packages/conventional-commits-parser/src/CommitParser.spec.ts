import { describe, it, expect } from 'vitest'
import { CommitParser } from './CommitParser.js'

const customOptions = {
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
  revertCorrespondence: ['header', 'hash'],
  fieldPattern: /^-(.*?)-$/,
  headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'subject'
  ],
  noteKeywords: ['BREAKING AMEND'],
  issuePrefixes: ['#', 'gh-'],
  referenceActions: [
    'kill',
    'kills',
    'killed',
    'handle',
    'handles',
    'handled'
  ]
}

describe('conventional-commits-parser', () => {
  describe('CommitParser', () => {
    const customParser = new CommitParser(customOptions)

    describe('default options', () => {
      const parser = new CommitParser()

      it('should work', () => {
        const commit = 'feat(ng-list): Allow custom separator\n'
          + 'bla bla bla\n\n'
          + 'Closes #123\nCloses #25\nFixes #33\n'
        const result = parser.parse(commit)

        expect(result.header).toBe('feat(ng-list): Allow custom separator')
        expect(result.footer).toBe('Closes #123\nCloses #25\nFixes #33')
        expect(result.references).toEqual([
          {
            action: 'Closes',
            issue: '123',
            owner: null,
            prefix: '#',
            raw: '#123',
            repository: null
          },
          {
            action: 'Closes',
            issue: '25',
            owner: null,
            prefix: '#',
            raw: '#25',
            repository: null
          },
          {
            action: 'Fixes',
            issue: '33',
            owner: null,
            prefix: '#',
            raw: '#33',
            repository: null
          }
        ])
      })

      it('should parse references from header', () => {
        const commit = 'Subject #1'
        const result = parser.parse(commit)

        expect(result.references).toEqual([
          {
            action: null,
            issue: '1',
            owner: null,
            prefix: '#',
            raw: 'Subject #1',
            repository: null
          }
        ])
      })

      it('should parse slash in the header with default headerPattern option', () => {
        const commit = 'feat(hello/world): message'
        const result = parser.parse(commit)

        expect(result.type).toBe('feat')
        expect(result.scope).toBe('hello/world')
        expect(result.subject).toBe('message')
      })
    })

    describe('custom options', () => {
      it('should not be subject to ReDos', () => {
        // This test will timeout if the bug is present.
        customParser.parse(`b${'\r\n'.repeat(1000000)}b`)
      })

      it('should trim extra newlines', () => {
        const commit = customParser.parse(
          '\n\n\n\n\n\n\nfeat(scope): broadcast $destroy event on scope destruction\n\n\n'
          + '\n\n\nperf testing shows that in chrome this change adds 5-15% overhead\n'
          + '\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener\n\n'
          + '\n\n\n\nBREAKING AMEND: some breaking change\n'
          + '\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```'
          + '\n\nKills #1\n'
          + '\n\n\nkilled #25\n\n\n\n\n'
        )

        expect(commit).toEqual({
          merge: null,
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          scope: 'scope',
          subject: 'broadcast $destroy event on scope destruction',
          type: 'feat',
          body: 'perf testing shows that in chrome this change adds 5-15% overhead\n\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener',
          footer: 'BREAKING AMEND: some breaking change\n\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\nKills #1\n\n\n\nkilled #25',
          notes: [
            {
              title: 'BREAKING AMEND',
              text: 'some breaking change'
            },
            {
              title: 'BREAKING AMEND',
              text: 'An awesome breaking change\n\n\n```\ncode here\n```'
            }
          ],
          references: [
            {
              action: 'Kills',
              owner: null,
              repository: null,
              issue: '1',
              raw: '#1',
              prefix: '#'
            },
            {
              action: 'killed',
              owner: null,
              repository: null,
              issue: '25',
              raw: '#25',
              prefix: '#'
            }
          ],
          mentions: [],
          revert: null
        })
      })

      it('should keep spaces', () => {
        expect(customParser.parse(
          ' feat(scope): broadcast $destroy event on scope destruction \n'
          + ' perf testing shows that in chrome this change adds 5-15% overhead \n\n'
          + ' when destroying 10k nested scopes where each scope has a $destroy listener \n'
          + '         BREAKING AMEND: some breaking change         \n\n'
          + '   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```'
          + '\n\n    Kills   #1\n'
        )).toEqual({
          merge: null,
          header: ' feat(scope): broadcast $destroy event on scope destruction ',
          body: ' perf testing shows that in chrome this change adds 5-15% overhead \n\n when destroying 10k nested scopes where each scope has a $destroy listener ',
          footer: '         BREAKING AMEND: some breaking change         \n\n   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\n    Kills   #1',
          notes: [
            {
              title: 'BREAKING AMEND',
              text: 'some breaking change         '
            },
            {
              title: 'BREAKING AMEND',
              text: 'An awesome breaking change\n\n\n```\ncode here\n```'
            }
          ],
          references: [
            {
              action: 'Kills',
              owner: null,
              repository: null,
              issue: '1',
              raw: '#1',
              prefix: '#'
            }
          ],
          mentions: [],
          revert: null
        })
      })

      it('should ignore gpg signature lines', () => {
        expect(customParser.parse(
          'gpg: Signature made Thu Oct 22 12:19:30 2020 EDT\n'
          + 'gpg:                using RSA key ABCDEF1234567890\n'
          + 'gpg: Good signature from "Author <author@example.com>" [ultimate]\n'
          + 'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1\n'
        )).toEqual({
          merge: null,
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          scope: 'scope',
          subject: 'broadcast $destroy event on scope destruction',
          type: 'feat',
          body: 'perf testing shows that in chrome this change adds 5-15% overhead\nwhen destroying 10k nested scopes where each scope has a $destroy listener',
          footer: 'BREAKING AMEND: some breaking change\nKills #1',
          notes: [
            {
              title: 'BREAKING AMEND',
              text: 'some breaking change'
            }
          ],
          references: [
            {
              action: 'Kills',
              owner: null,
              repository: null,
              issue: '1',
              raw: '#1',
              prefix: '#'
            }
          ],
          mentions: ['example'],
          revert: null
        })
      })

      it('should truncate from scissors line', () => {
        const commit = customParser.parse(
          'this is some header before a scissors-line\n'
          + '# ------------------------ >8 ------------------------\n'
          + 'this is a line that should be truncated\n'
        )

        expect(commit.body).toBe(null)
      })

      it('should keep header before scissor line', () => {
        const commit = customParser.parse(
          'this is some header before a scissors-line\n'
          + '# ------------------------ >8 ------------------------\n'
          + 'this is a line that should be truncated\n'
        )

        expect(commit.header).toBe('this is some header before a scissors-line')
      })

      it('should keep body before scissor line', () => {
        const commit = customParser.parse(
          'this is some subject before a scissors-line\n'
          + 'this is some body before a scissors-line\n'
          + '# ------------------------ >8 ------------------------\n'
          + 'this is a line that should be truncated\n'
        )

        expect(commit.body).toBe('this is some body before a scissors-line')
      })
    })

    describe('comments', () => {
      it('should ignore comments according to commentChar', () => {
        const parser = new CommitParser({
          ...customOptions,
          commentChar: '#'
        })

        expect(parser.parse('# comment')).toEqual({
          merge: null,
          header: null,
          body: null,
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })

        expect(parser.parse(' # non-comment')).toEqual({
          merge: null,
          header: ' # non-comment',
          body: null,
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })

        expect(parser.parse('header\n# comment\n\nbody')).toEqual({
          merge: null,
          header: 'header',
          body: 'body',
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })
      })

      it('should respect commentChar config', () => {
        const parser = new CommitParser({
          ...customOptions,
          commentChar: '*'
        })

        expect(parser.parse('* comment')).toEqual({
          merge: null,
          header: null,
          body: null,
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })

        expect(parser.parse('# non-comment')).toEqual({
          merge: null,
          header: '# non-comment',
          body: null,
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })

        expect(parser.parse(' * non-comment')).toEqual({
          merge: null,
          header: ' * non-comment',
          body: null,
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })

        expect(parser.parse('header\n* comment\n\nbody')).toEqual({
          merge: null,
          header: 'header',
          body: 'body',
          footer: null,
          notes: [],
          references: [],
          mentions: [],
          revert: null
        })
      })
    })

    describe('mentions', () => {
      it('should mention someone in the commit', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ['issueId', 'source']
        })
        const commit = parser.parse(
          '@Steve\n'
          + '@conventional-changelog @someone'
          + '\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + '@this is'
        )

        expect(commit.mentions).toEqual([
          'Steve',
          'conventional-changelog',
          'someone',
          'this'
        ])
      })
    })

    describe('merge commits', () => {
      describe('generic style', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          mergePattern: /^Merge branch '(\w+)'$/,
          mergeCorrespondence: ['source', 'issueId']
        })
        const commit = parser.parse('Merge branch \'feature\'\nHEADER')

        it('should parse merge header in merge commit', () => {
          expect(commit.source).toBe('feature')
          expect(commit.issueId).toBe(null)
        })

        it('should not throw if merge commit has no header', () => {
          parser.parse('Merge branch \'feature\'')
        })

        it('should parse merge as null if options.mergePattern is not defined', () => {
          const commit = new CommitParser(customOptions).parse('Merge branch \'feature\'\nHEADER')

          expect(commit.merge).toBe(null)
        })

        it('should not parse conventional header if pull request header present and mergePattern is not set', () => {
          const commit = parser.parse(
            'Merge pull request #1 from user/feature/feature-name\n'
            + 'feat(scope): broadcast $destroy event on scope destruction'
          )

          expect(commit.type).not.toBeDefined()
          expect(commit.scope).not.toBeDefined()
          expect(commit.subject).not.toBeDefined()
        })
      })

      describe('github style', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ['issueId', 'source']
        })
        const commit = parser.parse(
          'Merge pull request #1 from user/feature/feature-name\n'
          + '\n'
          + 'feat(scope): broadcast $destroy event on scope destruction\n'
          + '\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener'
        )

        it('should parse header in GitHub like pull request', () => {
          expect(commit.header).toBe('feat(scope): broadcast $destroy event on scope destruction')
        })

        it('should understand header parts in GitHub like pull request', () => {
          expect(commit.type).toBe('feat')
          expect(commit.scope).toBe('scope')
          expect(commit.subject).toBe('broadcast $destroy event on scope destruction')
        })

        it('should understand merge parts in GitHub like pull request', () => {
          expect(commit.merge).toBe('Merge pull request #1 from user/feature/feature-name')
          expect(commit.issueId).toBe('1')
          expect(commit.source).toBe('user/feature/feature-name')
        })

        it('should parse header if merge header is missing', () => {
          const commit = parser.parse('feat(scope): broadcast $destroy event on scope destruction')

          expect(commit.merge).toBe(null)
        })
      })

      describe('gitlab style', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          mergePattern: /^Merge branch '([^']+)' into '[^']+'$/,
          mergeCorrespondence: ['source']
        })
        const commit = parser.parse(
          'Merge branch \'feature/feature-name\' into \'master\'\r\n'
          + '\r\n'
          + 'feat(scope): broadcast $destroy event on scope destruction\r\n'
          + '\r\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\r\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\r\n'
          + '\r\n'
          + 'See merge request !1'
        )

        it('should parse header in GitLab like merge request', () => {
          expect(commit.header).toBe('feat(scope): broadcast $destroy event on scope destruction')
        })

        it('should understand header parts in GitLab like merge request', () => {
          expect(commit.type).toBe('feat')
          expect(commit.scope).toBe('scope')
          expect(commit.subject).toBe('broadcast $destroy event on scope destruction')
        })

        it('should understand merge parts in GitLab like merge request', () => {
          expect(commit.merge).toBe('Merge branch \'feature/feature-name\' into \'master\'')
          expect(commit.source).toBe('feature/feature-name')
        })
      })
    })

    describe('header', () => {
      it('should allow ":" in scope', () => {
        const commit = new CommitParser({
          headerPattern: /^(\w*)(?:\(([:\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ]
        }).parse('feat(ng:list): Allow custom separator')

        expect(commit.scope).toBe('ng:list')
      })

      it('should parse header part as null if not captured', () => {
        const commit = customParser.parse('header')

        expect(commit.type).not.toBeDefined()
        expect(commit.scope).not.toBeDefined()
        expect(commit.subject).not.toBeDefined()
      })

      it('should parse header', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.header).toBe('feat(scope): broadcast $destroy event on scope destruction')
      })

      it('should understand header parts', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.type).toBe('feat')
        expect(commit.scope).toBe('scope')
        expect(commit.subject).toBe('broadcast $destroy event on scope destruction')
      })

      it('should allow correspondence to be changed', () => {
        const commit = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'scope',
            'subject',
            'type'
          ]
        }).parse('scope(my subject): fix this')

        expect(commit.type).toBe('fix this')
        expect(commit.scope).toBe('scope')
        expect(commit.subject).toBe('my subject')
      })

      it('should be `undefined` if it is missing in `options.headerCorrespondence`', () => {
        const commit = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['scop', 'subject']
        }).parse('scope(my subject): fix this')

        expect(commit.scope).toBe(undefined)
      })

      it('should reference an issue with an owner', () => {
        const commit = customParser.parse('handled angular/angular.js#1')

        expect(commit.references).toEqual([
          {
            action: 'handled',
            owner: 'angular',
            repository: 'angular.js',
            issue: '1',
            raw: 'angular/angular.js#1',
            prefix: '#'
          }
        ])
      })

      it('should reference an issue with a repository', () => {
        const commit = customParser.parse('handled angular.js#1')

        expect(commit.references).toEqual([
          {
            action: 'handled',
            owner: null,
            repository: 'angular.js',
            issue: '1',
            raw: 'angular.js#1',
            prefix: '#'
          }
        ])
      })

      it('should reference an issue without both', () => {
        const commit = customParser.parse('handled gh-1')

        expect(commit.references).toEqual([
          {
            action: 'handled',
            owner: null,
            repository: null,
            issue: '1',
            raw: 'gh-1',
            prefix: 'gh-'
          }
        ])
      })

      it('should reference an issue without an action', () => {
        const parser = new CommitParser({
          revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
          revertCorrespondence: ['header', 'hash'],
          fieldPattern: /^-(.*?)-$/,
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          noteKeywords: ['BREAKING AMEND'],
          issuePrefixes: ['#', 'gh-']
        })
        const commit = parser.parse('This is gh-1')

        expect(commit.references).toEqual([
          {
            action: null,
            owner: null,
            repository: null,
            issue: '1',
            raw: 'This is gh-1',
            prefix: 'gh-'
          }
        ])
      })
    })

    describe('body', () => {
      it('should parse body', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.body).toBe(
          'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener'
        )
      })

      it('should be null if not found', () => {
        const commit = customParser.parse('header')

        expect(commit.body).toBe(null)
      })
    })

    describe('footer', () => {
      it('should be null if not found', () => {
        const commit = customParser.parse('header')

        expect(commit.footer).toBe(null)
      })

      it('should parse footer', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.footer).toBe(
          'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )
      })

      it('should return empty notes', () => {
        const commit = customParser.parse(
          'chore: some chore\n'
        )

        expect(commit.notes).toEqual([])
      })

      it('should parse important notes', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
      })

      it('should parse important notes with more than one paragraphs', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND:\n'
          + 'some breaking change\n'
          + 'some other breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change\nsome other breaking change'
        })
      })

      it('should parse important notes that start with asterisks (for squash commits)', () => {
        const expectedText = 'Previously multiple template bindings on one element\n'
          + '(ex. `<div *ngIf=\'..\' *ngFor=\'...\'>`) were allowed but most of the time\n'
          + 'were leading to undesired result. It is possible that a small number\n'
          + 'of applications will see template parse errors that shuld be fixed by\n'
          + 'nesting elements or using `<template>` tags explicitly.'
        const text = `${expectedText
        }\n`
            + `Closes #9462`
        const parser = new CommitParser({
          ...customOptions,
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE']
        })
        const commit = parser.parse(
          `fix(core): report duplicate template bindings in templates\n`
            + `\n`
            + `Fixes #7315\n`
            + `\n`
            + `* BREAKING CHANGE:\n`
            + `\n${
              text}`
        )
        const expected = {
          title: 'BREAKING CHANGE',
          text: expectedText
        }

        expect(commit.references.map(ref => ref.issue)).toContain('9462')
        expect(commit.notes[0]).toEqual(expected)
      })

      it('should not treat it as important notes if there are texts after `noteKeywords`', () => {
        const parser = new CommitParser({
          ...customOptions,
          noteKeywords: ['BREAKING CHANGE', 'BREAKING-CHANGE']
        })
        const commit = parser.parse(
          'fix(core): report duplicate template bindings in templates\n'
          + '\n'
          + 'Fixes #7315\n'
          + '\n'
          + 'BREAKING CHANGES:\n'
          + '\n'
          + 'Previously multiple template bindings on one element\n'
          + '(ex. `<div *ngIf=\'..\' *ngFor=\'...\'>`) were allowed but most of the time\n'
          + 'were leading to undesired result. It is possible that a small number\n'
          + 'of applications will see template parse errors that shuld be fixed by\n'
          + 'nesting elements or using `<template>` tags explicitly.\n'
          + '\n'
          + 'Closes #9462'
        )

        expect(commit.notes).toEqual([])
      })

      it('should parse references as empty if not found', () => {
        const commit = customParser.parse(
          'chore: some chore\n'
        )

        expect(commit.references).toEqual([])
      })

      it('should parse references', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'BREAKING AMEND: some breaking change\n'
          + 'Kills #1, #123\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3 kills repo#77\n'
          + 'kills stevemao/conventional-commits-parser#1'
        )

        expect(commit.references).toEqual([
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '1',
            raw: '#1',
            prefix: '#'
          },
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '123',
            raw: ', #123',
            prefix: '#'
          },
          {
            action: 'killed',
            owner: null,
            repository: null,
            issue: '25',
            raw: '#25',
            prefix: '#'
          },
          {
            action: 'handle',
            owner: null,
            repository: null,
            issue: '33',
            raw: '#33',
            prefix: '#'
          },
          {
            action: 'handle',
            owner: null,
            repository: null,
            issue: '100',
            raw: ', Closes #100',
            prefix: '#'
          },
          {
            action: 'Handled',
            owner: null,
            repository: null,
            issue: '3',
            raw: '#3',
            prefix: '#'
          },
          {
            action: 'kills',
            owner: null,
            repository: 'repo',
            issue: '77',
            raw: 'repo#77',
            prefix: '#'
          },
          {
            action: 'kills',
            owner: 'stevemao',
            repository: 'conventional-commits-parser',
            issue: '1',
            raw: 'stevemao/conventional-commits-parser#1',
            prefix: '#'
          }
        ])
      })

      it('should reference an issue without an action', () => {
        const parser = new CommitParser({
          revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
          revertCorrespondence: ['header', 'hash'],
          fieldPattern: /^-(.*?)-$/,
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          noteKeywords: ['BREAKING AMEND'],
          issuePrefixes: ['#', 'gh-']
        })
        const commit = parser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'Kills #1, gh-123\n'
          + 'what\n'
          + '* #25\n'
          + '* #33, maybe gh-100, not sure about #3\n'
        )

        expect(commit.references).toEqual([
          {
            action: null,
            owner: null,
            repository: null,
            issue: '1',
            raw: 'Kills #1',
            prefix: '#'
          },
          {
            action: null,
            owner: null,
            repository: null,
            issue: '123',
            raw: ', gh-123',
            prefix: 'gh-'
          },
          {
            action: null,
            owner: null,
            repository: null,
            issue: '25',
            raw: '* #25',
            prefix: '#'
          },
          {
            action: null,
            owner: null,
            repository: null,
            issue: '33',
            raw: '* #33',
            prefix: '#'
          },
          {
            action: null,
            owner: null,
            repository: null,
            issue: '100',
            raw: ', maybe gh-100',
            prefix: 'gh-'
          },
          {
            action: null,
            owner: null,
            repository: null,
            issue: '3',
            raw: ', not sure about #3',
            prefix: '#'
          }
        ])
      })

      it('should put everything after references in footer', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'Kills #1, #123\n'
          + 'what\n'
          + 'killed #25\n'
          + 'handle #33, Closes #100, Handled #3\n'
          + 'other'
        )

        expect(commit.footer).toBe('Kills #1, #123\nwhat\nkilled #25\nhandle #33, Closes #100, Handled #3\nother')
      })

      it('should parse properly if important notes comes after references', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'Kills #1, #123\n'
          + 'BREAKING AMEND: some breaking change\n'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(commit.references).toEqual([
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '1',
            raw: '#1',
            prefix: '#'
          },
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '123',
            raw: ', #123',
            prefix: '#'
          }
        ])
        expect(commit.footer).toBe('Kills #1, #123\nBREAKING AMEND: some breaking change')
      })

      it('should parse properly if important notes comes with more than one paragraphs after references', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'Kills #1, #123\n'
          + 'BREAKING AMEND: some breaking change\nsome other breaking change'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change\nsome other breaking change'
        })
        expect(commit.references).toEqual([
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '1',
            raw: '#1',
            prefix: '#'
          },
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '123',
            raw: ', #123',
            prefix: '#'
          }
        ])
        expect(commit.footer).toBe('Kills #1, #123\nBREAKING AMEND: some breaking change\nsome other breaking change')
      })

      it('should parse properly if important notes comes after references', () => {
        const commit = customParser.parse(
          'feat(scope): broadcast $destroy event on scope destruction\n'
          + 'perf testing shows that in chrome this change adds 5-15% overhead\n'
          + 'when destroying 10k nested scopes where each scope has a $destroy listener\n'
          + 'Kills gh-1, #123\n'
          + 'other\n'
          + 'BREAKING AMEND: some breaking change\n'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(commit.references).toEqual([
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '1',
            raw: 'gh-1',
            prefix: 'gh-'
          },
          {
            action: 'Kills',
            owner: null,
            repository: null,
            issue: '123',
            raw: ', #123',
            prefix: '#'
          }
        ])
        expect(commit.footer).toBe('Kills gh-1, #123\nother\nBREAKING AMEND: some breaking change')
      })

      it('should add the subject as note if it match breakingHeaderPattern', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ]
        })
        const commit = parser.parse(
          'feat!: breaking change feature'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING CHANGE',
          text: 'breaking change feature'
        })
      })

      it('should not duplicate notes if the subject match breakingHeaderPattern', () => {
        const parser = new CommitParser({
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
          headerCorrespondence: [
            'type',
            'scope',
            'subject'
          ],
          noteKeywords: ['BREAKING AMEND']
        })
        const commit = parser.parse(
          'feat!: breaking change feature\nBREAKING AMEND: some breaking change'
        )

        expect(commit.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(commit.notes.length).toBe(1)
      })
    })

    describe('others', () => {
      it('should parse hash', () => {
        const commit = customParser.parse(
          'My commit message\n'
          + '-hash-\n'
          + '9b1aff905b638aa274a5fc8f88662df446d374bd'
        )

        expect(commit.hash).toBe('9b1aff905b638aa274a5fc8f88662df446d374bd')
      })

      it('should parse meta after notes', () => {
        const commit = customParser.parse(
          'build!: first build setup\n'
          + '\n'
          + 'BREAKING AMEND: New build system.\n'
          + '\n'
          + '-hash-\n'
          + '4937825901dacca88609da354f0e8a8c84ae04ea\n'
          + '-gitTags-\n'
          + '\n'
          + '-committerDate-\n'
          + '2023-09-16 21:13:23 +0400\n'
        )

        expect(commit).toMatchObject({
          body: '',
          notes: [
            {
              title: 'BREAKING AMEND',
              text: 'New build system.'
            }
          ],
          footer: 'BREAKING AMEND: New build system.',
          hash: '4937825901dacca88609da354f0e8a8c84ae04ea',
          gitTags: '',
          committerDate: '2023-09-16 21:13:23 +0400'
        })
      })

      it('should parse sideNotes', () => {
        const commit = customParser.parse(
          'My commit message\n'
          + '-sideNotes-\n'
          + 'It should warn the correct unfound file names.\n'
          + 'Also it should continue if one file cannot be found.\n'
          + 'Tests are added for these'
        )

        expect(commit.sideNotes).toBe('It should warn the correct unfound file names.\n'
          + 'Also it should continue if one file cannot be found.\n'
          + 'Tests are added for these')
      })

      it('should parse committer name and email', () => {
        const commit = customParser.parse(
          'My commit message\n'
          + '-committerName-\n'
          + 'Steve Mao\n'
          + '- committerEmail-\n'
          + 'test@github.com'
        )

        expect(commit.committerName).toBe('Steve Mao')
        expect(commit[' committerEmail']).toBe('test@github.com')
      })
    })

    describe('revert', () => {
      it('should parse revert', () => {
        const commit = customParser.parse(
          'Revert "throw an error if a callback is passed to animate methods"\n\n'
          + 'This reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.'
        )

        expect(commit.revert).toEqual({
          header: 'throw an error if a callback is passed to animate methods',
          hash: '9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca'
        })
      })

      it('should parse revert even if a field is missing', () => {
        const commit = customParser.parse(
          'Revert ""\n\n'
          + 'This reverts commit .'
        )

        expect(commit.revert).toEqual({
          header: null,
          hash: null
        })
      })
    })
  })
})
