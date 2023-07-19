import { describe, beforeEach, it, expect } from 'vitest'
import parser from '../lib/parser'
import regex from '../lib/regex'

describe('conventional-commits-parser', () => {
  describe('parser', () => {
    let options
    let reg
    let msg
    let simpleMsg
    let longNoteMsg
    let headerOnlyMsg

    beforeEach(() => {
      options = {
        revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
        revertCorrespondence: ['header', 'hash'],
        fieldPattern: /^-(.*?)-$/,
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
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

      reg = regex(options)

      msg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'BREAKING AMEND: some breaking change\n' +
        'Kills #1, #123\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3 kills repo#77\n' +
        'kills stevemao/conventional-commits-parser#1',
        options,
        reg
      )

      longNoteMsg = parser(
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'BREAKING AMEND:\n' +
        'some breaking change\n' +
        'some other breaking change\n' +
        'Kills #1, #123\n' +
        'killed #25\n' +
        'handle #33, Closes #100, Handled #3',
        options,
        reg
      )

      simpleMsg = parser(
        'chore: some chore\n',
        options,
        reg
      )

      headerOnlyMsg = parser('header', options, reg)
    })

    it('should throw if nothing to parse', () => {
      expect(() => {
        parser()
      }).toThrow('Expected a raw commit')
      expect(() => {
        parser('\n')
      }).toThrow('Expected a raw commit')
      expect(() => {
        parser(' ')
      }).toThrow('Expected a raw commit')
    })

    it('should throw if `options` is empty', () => {
      expect(() => {
        parser('bla bla')
      }).toThrow('Expected options')
    })

    it('should throw if `regex` is empty', () => {
      expect(() => {
        parser('bla bla', {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/
        })
      }).toThrow('Expected regex')
    })

    it('should not be subject to ReDos', () => {
      // This test will timeout if the bug is present.
      expect(parser(
        'b' + '\r\n'.repeat(1000000) + 'b',
        options,
        reg
      ))
    })

    it('should trim extra newlines', () => {
      expect(parser(
        '\n\n\n\n\n\n\nfeat(scope): broadcast $destroy event on scope destruction\n\n\n' +
        '\n\n\nperf testing shows that in chrome this change adds 5-15% overhead\n' +
        '\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener\n\n' +
        '\n\n\n\nBREAKING AMEND: some breaking change\n' +
        '\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```' +
        '\n\nKills #1\n' +
        '\n\n\nkilled #25\n\n\n\n\n',
        options,
        reg
      )).toEqual({
        merge: null,
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        body: 'perf testing shows that in chrome this change adds 5-15% overhead\n\n\n\nwhen destroying 10k nested scopes where each scope has a $destroy listener',
        footer: 'BREAKING AMEND: some breaking change\n\n\n\n\nBREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\nKills #1\n\n\n\nkilled #25',
        notes: [{
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        }, {
          title: 'BREAKING AMEND',
          text: 'An awesome breaking change\n\n\n```\ncode here\n```'
        }],
        references: [{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }, {
          action: 'killed',
          owner: null,
          repository: null,
          issue: '25',
          raw: '#25',
          prefix: '#'
        }],
        mentions: [],
        revert: null,
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        type: 'feat'
      })
    })

    it('should keep spaces', () => {
      expect(parser(
        ' feat(scope): broadcast $destroy event on scope destruction \n' +
        ' perf testing shows that in chrome this change adds 5-15% overhead \n\n' +
        ' when destroying 10k nested scopes where each scope has a $destroy listener \n' +
        '         BREAKING AMEND: some breaking change         \n\n' +
        '   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```' +
        '\n\n    Kills   #1\n',
        options,
        reg
      )).toEqual({
        merge: null,
        header: ' feat(scope): broadcast $destroy event on scope destruction ',
        body: ' perf testing shows that in chrome this change adds 5-15% overhead \n\n when destroying 10k nested scopes where each scope has a $destroy listener ',
        footer: '         BREAKING AMEND: some breaking change         \n\n   BREAKING AMEND: An awesome breaking change\n\n\n```\ncode here\n```\n\n    Kills   #1',
        notes: [{
          title: 'BREAKING AMEND',
          text: 'some breaking change         '
        }, {
          title: 'BREAKING AMEND',
          text: 'An awesome breaking change\n\n\n```\ncode here\n```'
        }],
        references: [{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })
    })

    it('should ignore gpg signature lines', () => {
      expect(parser(
        'gpg: Signature made Thu Oct 22 12:19:30 2020 EDT\n' +
        'gpg:                using RSA key ABCDEF1234567890\n' +
        'gpg: Good signature from "Author <author@example.com>" [ultimate]\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
        'BREAKING AMEND: some breaking change\n' +
        'Kills #1\n',
        options,
        reg
      )).toEqual({
        merge: null,
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        body: 'perf testing shows that in chrome this change adds 5-15% overhead\nwhen destroying 10k nested scopes where each scope has a $destroy listener',
        footer: 'BREAKING AMEND: some breaking change\nKills #1',
        notes: [{
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        }],
        references: [{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }],
        mentions: ['example'],
        revert: null,
        scope: 'scope',
        subject: 'broadcast $destroy event on scope destruction',
        type: 'feat'
      })
    })

    it('should ignore comments according to commentChar', () => {
      const commentOptions = {
        ...options,
        commentChar: '#'
      }

      expect(parser('# comment', commentOptions, reg)).toEqual({
        merge: null,
        header: null,
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })

      expect(parser(' # non-comment', commentOptions, reg)).toEqual({
        merge: null,
        header: ' # non-comment',
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })

      expect(parser('header\n# comment\n\nbody', commentOptions, reg)).toEqual({
        merge: null,
        header: 'header',
        body: 'body',
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })
    })

    it('should respect commentChar config', () => {
      const commentOptions = {
        ...options,
        commentChar: '*'
      }

      expect(parser('* comment', commentOptions, reg)).toEqual({
        merge: null,
        header: null,
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })

      expect(parser('# non-comment', commentOptions, reg)).toEqual({
        merge: null,
        header: '# non-comment',
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })

      expect(parser(' * non-comment', commentOptions, reg)).toEqual({
        merge: null,
        header: ' * non-comment',
        body: null,
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })

      expect(parser('header\n* comment\n\nbody', commentOptions, reg)).toEqual({
        merge: null,
        header: 'header',
        body: 'body',
        footer: null,
        notes: [],
        references: [],
        mentions: [],
        revert: null,
        scope: null,
        subject: null,
        type: null
      })
    })

    it('should truncate from scissors line', () => {
      const msg = parser(
        'this is some header before a scissors-line\n' +
        '# ------------------------ >8 ------------------------\n' +
        'this is a line that should be truncated\n',
        options,
        reg
      )
      expect(msg.body).toEqual(null)
    })

    it('should keep header before scissor line', () => {
      const msg = parser(
        'this is some header before a scissors-line\n' +
        '# ------------------------ >8 ------------------------\n' +
        'this is a line that should be truncated\n',
        options,
        reg
      )
      expect(msg.header).toEqual('this is some header before a scissors-line')
    })

    it('should keep body before scissor line', () => {
      const msg = parser(
        'this is some subject before a scissors-line\n' +
        'this is some body before a scissors-line\n' +
        '# ------------------------ >8 ------------------------\n' +
        'this is a line that should be truncated\n',
        options,
        reg
      )
      expect(msg.body).toEqual('this is some body before a scissors-line')
    })

    describe('mentions', () => {
      it('should mention someone in the commit', () => {
        const options = {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ['issueId', 'source']
        }

        const reg = regex(options)

        const msg = parser(
          '@Steve\n' +
          '@conventional-changelog @someone' +
          '\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          '@this is',
          options,
          reg
        )

        expect(msg.mentions).toEqual([
          'Steve',
          'conventional-changelog',
          'someone',
          'this'
        ])
      })
    })

    describe('merge commits', () => {
      const mergeOptions = {
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        mergePattern: /^Merge branch '(\w+)'$/,
        mergeCorrespondence: ['source', 'issueId']
      }

      const mergeRegex = regex(mergeOptions)

      const mergeMsg = parser(
        'Merge branch \'feature\'\nHEADER',
        mergeOptions,
        mergeRegex
      )

      it('should parse merge header in merge commit', () => {
        expect(mergeMsg.source).toEqual('feature')
        expect(mergeMsg.issueId).toEqual(null)
      })

      const githubOptions = {
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        mergePattern: /^Merge pull request #(\d+) from (.*)$/,
        mergeCorrespondence: ['issueId', 'source']
      }

      const githubRegex = regex(githubOptions)

      const githubMsg = parser(
        'Merge pull request #1 from user/feature/feature-name\n' +
        '\n' +
        'feat(scope): broadcast $destroy event on scope destruction\n' +
        '\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener',
        githubOptions,
        githubRegex
      )

      it('should parse header in GitHub like pull request', () => {
        expect(githubMsg.header).toEqual('feat(scope): broadcast $destroy event on scope destruction')
      })

      it('should understand header parts in GitHub like pull request', () => {
        expect(githubMsg.type).toEqual('feat')
        expect(githubMsg.scope).toEqual('scope')
        expect(githubMsg.subject).toEqual('broadcast $destroy event on scope destruction')
      })

      it('should understand merge parts in GitHub like pull request', () => {
        expect(githubMsg.merge).toEqual('Merge pull request #1 from user/feature/feature-name')
        expect(githubMsg.issueId).toEqual('1')
        expect(githubMsg.source).toEqual('user/feature/feature-name')
      })

      const gitLabOptions = {
        headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        mergePattern: /^Merge branch '([^']+)' into '[^']+'$/,
        mergeCorrespondence: ['source']
      }

      const gitLabRegex = regex(gitLabOptions)

      const gitlabMsg = parser(
        'Merge branch \'feature/feature-name\' into \'master\'\r\n' +
        '\r\n' +
        'feat(scope): broadcast $destroy event on scope destruction\r\n' +
        '\r\n' +
        'perf testing shows that in chrome this change adds 5-15% overhead\r\n' +
        'when destroying 10k nested scopes where each scope has a $destroy listener\r\n' +
        '\r\n' +
        'See merge request !1',
        gitLabOptions,
        gitLabRegex
      )

      it('should parse header in GitLab like merge request', () => {
        expect(gitlabMsg.header).toEqual('feat(scope): broadcast $destroy event on scope destruction')
      })

      it('should understand header parts in GitLab like merge request', () => {
        expect(gitlabMsg.type).toEqual('feat')
        expect(gitlabMsg.scope).toEqual('scope')
        expect(gitlabMsg.subject).toEqual('broadcast $destroy event on scope destruction')
      })

      it('should understand merge parts in GitLab like merge request', () => {
        expect(gitlabMsg.merge).toEqual('Merge branch \'feature/feature-name\' into \'master\'')
        expect(gitlabMsg.source).toEqual('feature/feature-name')
      })

      it('Should parse header if merge header is missing', () => {
        const msgWithoutmergeHeader = parser(
          'feat(scope): broadcast $destroy event on scope destruction',
          githubOptions,
          githubRegex
        )

        expect(msgWithoutmergeHeader.merge).toEqual(null)
      })

      it('merge should be null if options.mergePattern is not defined', () => {
        expect(msg.merge).toEqual(null)
      })

      it('Should not parse conventional header if pull request header present and mergePattern is not set', () => {
        const msgWithmergeHeaderWithoutmergePattern = parser(
          'Merge pull request #1 from user/feature/feature-name\n' +
          'feat(scope): broadcast $destroy event on scope destruction',
          options,
          reg
        )
        expect(msgWithmergeHeaderWithoutmergePattern.type).toEqual(null)
        expect(msgWithmergeHeaderWithoutmergePattern.scope).toEqual(null)
        expect(msgWithmergeHeaderWithoutmergePattern.subject).toEqual(null)
      })

      it('does not throw if merge commit has no header', () => {
        parser(
          'Merge branch \'feature\'',
          mergeOptions,
          mergeRegex
        )
      })
    })

    describe('header', () => {
      it('should allow ":" in scope', () => {
        const msg = parser('feat(ng:list): Allow custom separator', {
          headerPattern: /^(\w*)(?:\(([:\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject']
        }, reg)
        expect(msg.scope).toEqual('ng:list')
      })

      it('header part should be null if not captured', () => {
        expect(headerOnlyMsg.type).toEqual(null)
        expect(headerOnlyMsg.scope).toEqual(null)
        expect(headerOnlyMsg.subject).toEqual(null)
      })

      it('should parse header', () => {
        expect(msg.header).toEqual('feat(scope): broadcast $destroy event on scope destruction')
      })

      it('should understand header parts', () => {
        expect(msg.type).toEqual('feat')
        expect(msg.scope).toEqual('scope')
        expect(msg.subject).toEqual('broadcast $destroy event on scope destruction')
      })

      it('should allow correspondence to be changed', () => {
        const msg = parser('scope(my subject): fix this', {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['scope', 'subject', 'type']
        }, reg)

        expect(msg.type).toEqual('fix this')
        expect(msg.scope).toEqual('scope')
        expect(msg.subject).toEqual('my subject')
      })

      it('should be `undefined` if it is missing in `options.headerCorrespondence`', () => {
        msg = parser('scope(my subject): fix this', {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['scop', 'subject']
        }, reg)

        expect(msg.scope).toEqual(undefined)
      })

      it('should reference an issue with an owner', () => {
        const msg = parser('handled angular/angular.js#1', options, reg)
        expect(msg.references).toEqual([{
          action: 'handled',
          owner: 'angular',
          repository: 'angular.js',
          issue: '1',
          raw: 'angular/angular.js#1',
          prefix: '#'
        }])
      })

      it('should reference an issue with a repository', () => {
        const msg = parser('handled angular.js#1', options, reg)
        expect(msg.references).toEqual([{
          action: 'handled',
          owner: null,
          repository: 'angular.js',
          issue: '1',
          raw: 'angular.js#1',
          prefix: '#'
        }])
      })

      it('should reference an issue without both', () => {
        const msg = parser('handled gh-1', options, reg)
        expect(msg.references).toEqual([{
          action: 'handled',
          owner: null,
          repository: null,
          issue: '1',
          raw: 'gh-1',
          prefix: 'gh-'
        }])
      })

      it('should reference an issue without an action', () => {
        const options = {
          revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
          revertCorrespondence: ['header', 'hash'],
          fieldPattern: /^-(.*?)-$/,
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
          noteKeywords: ['BREAKING AMEND'],
          issuePrefixes: ['#', 'gh-']
        }

        const reg = regex(options)

        const msg = parser('This is gh-1', options, reg)
        expect(msg.references).toEqual([{
          action: null,
          owner: null,
          repository: null,
          issue: '1',
          raw: 'This is gh-1',
          prefix: 'gh-'
        }])
      })
    })

    describe('body', () => {
      it('should parse body', () => {
        expect(msg.body).toEqual(
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener')
      })

      it('should be null if not found', () => {
        expect(headerOnlyMsg.body).toEqual(null)
      })
    })

    describe('footer', () => {
      it('should be null if not found', () => {
        expect(headerOnlyMsg.footer).toEqual(null)
      })

      it('should parse footer', () => {
        expect(msg.footer).toEqual(
          'BREAKING AMEND: some breaking change\n' +
          'Kills #1, #123\n' +
          'killed #25\n' +
          'handle #33, Closes #100, Handled #3 kills repo#77\n' +
          'kills stevemao/conventional-commits-parser#1'
        )
      })

      it('important notes should be an empty string if not found', () => {
        expect(simpleMsg.notes).toEqual([])
      })

      it('should parse important notes', () => {
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
      })

      it('should parse important notes with more than one paragraphs', () => {
        expect(longNoteMsg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change\nsome other breaking change'
        })
      })

      it('should parse important notes that start with asterisks (for squash commits)', () => {
        const expectedText = 'Previously multiple template bindings on one element\n' +
          '(ex. `<div *ngIf=\'..\' *ngFor=\'...\'>`) were allowed but most of the time\n' +
          'were leading to undesired result. It is possible that a small number\n' +
          'of applications will see template parse errors that shuld be fixed by\n' +
          'nesting elements or using `<template>` tags explicitly.'
        const text = expectedText +
            '\n' +
            'Closes #9462'
        options.noteKeywords = ['BREAKING CHANGE', 'BREAKING-CHANGE']
        reg = regex(options)
        const msg = parser(
          'fix(core): report duplicate template bindings in templates\n' +
            '\n' +
            'Fixes #7315\n' +
            '\n' +
            '* BREAKING CHANGE:\n' +
            '\n' +
            text,
          options,
          reg
        )
        const expected = {
          title: 'BREAKING CHANGE',
          text: expectedText
        }
        expect(msg.references.map((ref) => ref.issue)).toContain('9462')
        expect(msg.notes[0]).toEqual(expected)
      })

      it('should not treat it as important notes if there are texts after `noteKeywords`', () => {
        options.noteKeywords = ['BREAKING CHANGE', 'BREAKING-CHANGE']
        reg = regex(options)
        const msg = parser(
          'fix(core): report duplicate template bindings in templates\n' +
          '\n' +
          'Fixes #7315\n' +
          '\n' +
          'BREAKING CHANGES:\n' +
          '\n' +
          'Previously multiple template bindings on one element\n' +
          '(ex. `<div *ngIf=\'..\' *ngFor=\'...\'>`) were allowed but most of the time\n' +
          'were leading to undesired result. It is possible that a small number\n' +
          'of applications will see template parse errors that shuld be fixed by\n' +
          'nesting elements or using `<template>` tags explicitly.\n' +
          '\n' +
          'Closes #9462',
          options,
          reg
        )

        expect(msg.notes).toEqual([])
      })

      it('references should be empty if not found', () => {
        expect(simpleMsg.references).toEqual([])
      })

      it('should parse references', () => {
        expect(msg.references).toEqual([{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }, {
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '123',
          raw: ', #123',
          prefix: '#'
        }, {
          action: 'killed',
          owner: null,
          repository: null,
          issue: '25',
          raw: '#25',
          prefix: '#'
        }, {
          action: 'handle',
          owner: null,
          repository: null,
          issue: '33',
          raw: '#33',
          prefix: '#'
        }, {
          action: 'handle',
          owner: null,
          repository: null,
          issue: '100',
          raw: ', Closes #100',
          prefix: '#'
        }, {
          action: 'Handled',
          owner: null,
          repository: null,
          issue: '3',
          raw: '#3',
          prefix: '#'
        }, {
          action: 'kills',
          owner: null,
          repository: 'repo',
          issue: '77',
          raw: 'repo#77',
          prefix: '#'
        }, {
          action: 'kills',
          owner: 'stevemao',
          repository: 'conventional-commits-parser',
          issue: '1',
          raw: 'stevemao/conventional-commits-parser#1',
          prefix: '#'
        }])
      })

      it('should reference an issue without an action', () => {
        const options = {
          revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (.*)\.$/,
          revertCorrespondence: ['header', 'hash'],
          fieldPattern: /^-(.*?)-$/,
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
          noteKeywords: ['BREAKING AMEND'],
          issuePrefixes: ['#', 'gh-']
        }

        const reg = regex(options)

        const msg = parser(
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
          'Kills #1, gh-123\n' +
          'what\n' +
          '* #25\n' +
          '* #33, maybe gh-100, not sure about #3\n',
          options, reg
        )

        expect(msg.references).toEqual([{
          action: null,
          owner: null,
          repository: null,
          issue: '1',
          raw: 'Kills #1',
          prefix: '#'
        }, {
          action: null,
          owner: null,
          repository: null,
          issue: '123',
          raw: ', gh-123',
          prefix: 'gh-'
        }, {
          action: null,
          owner: null,
          repository: null,
          issue: '25',
          raw: '* #25',
          prefix: '#'
        }, {
          action: null,
          owner: null,
          repository: null,
          issue: '33',
          raw: '* #33',
          prefix: '#'
        }, {
          action: null,
          owner: null,
          repository: null,
          issue: '100',
          raw: ', maybe gh-100',
          prefix: 'gh-'
        }, {
          action: null,
          owner: null,
          repository: null,
          issue: '3',
          raw: ', not sure about #3',
          prefix: '#'
        }])
      })

      it('should put everything after references in footer', () => {
        const msg = parser(
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
          'Kills #1, #123\n' +
          'what\n' +
          'killed #25\n' +
          'handle #33, Closes #100, Handled #3\n' +
          'other',
          options,
          reg
        )

        expect(msg.footer).toEqual('Kills #1, #123\nwhat\nkilled #25\nhandle #33, Closes #100, Handled #3\nother')
      })

      it('should parse properly if important notes comes after references', () => {
        const msg = parser(
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
          'Kills #1, #123\n' +
          'BREAKING AMEND: some breaking change\n',
          options,
          reg
        )
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(msg.references).toEqual([{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }, {
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '123',
          raw: ', #123',
          prefix: '#'
        }])
        expect(msg.footer).toEqual('Kills #1, #123\nBREAKING AMEND: some breaking change')
      })

      it('should parse properly if important notes comes with more than one paragraphs after references', () => {
        const msg = parser(
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
          'Kills #1, #123\n' +
          'BREAKING AMEND: some breaking change\nsome other breaking change',
          options,
          reg
        )
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change\nsome other breaking change'
        })
        expect(msg.references).toEqual([{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: '#1',
          prefix: '#'
        }, {
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '123',
          raw: ', #123',
          prefix: '#'
        }])
        expect(msg.footer).toEqual('Kills #1, #123\nBREAKING AMEND: some breaking change\nsome other breaking change')
      })

      it('should parse properly if important notes comes after references', () => {
        const msg = parser(
          'feat(scope): broadcast $destroy event on scope destruction\n' +
          'perf testing shows that in chrome this change adds 5-15% overhead\n' +
          'when destroying 10k nested scopes where each scope has a $destroy listener\n' +
          'Kills gh-1, #123\n' +
          'other\n' +
          'BREAKING AMEND: some breaking change\n',
          options,
          reg
        )
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(msg.references).toEqual([{
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '1',
          raw: 'gh-1',
          prefix: 'gh-'
        }, {
          action: 'Kills',
          owner: null,
          repository: null,
          issue: '123',
          raw: ', #123',
          prefix: '#'
        }])
        expect(msg.footer).toEqual('Kills gh-1, #123\nother\nBREAKING AMEND: some breaking change')
      })

      it('should add the subject as note if it match breakingHeaderPattern', () => {
        const options = {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject']
        }
        const msg = parser(
          'feat!: breaking change feature',
          options,
          reg
        )
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING CHANGE',
          text: 'breaking change feature'
        })
      })

      it('should not duplicate notes if the subject match breakingHeaderPattern', () => {
        const options = {
          headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
          noteKeywords: ['BREAKING AMEND']
        }
        const msg = parser(
          'feat!: breaking change feature\nBREAKING AMEND: some breaking change',
          options,
          reg
        )
        expect(msg.notes[0]).toEqual({
          title: 'BREAKING AMEND',
          text: 'some breaking change'
        })
        expect(msg.notes.length).toEqual(1)
      })
    })

    describe('others', () => {
      it('should parse hash', () => {
        msg = parser(
          'My commit message\n' +
          '-hash-\n' +
          '9b1aff905b638aa274a5fc8f88662df446d374bd',
          options,
          reg
        )

        expect(msg.hash).toEqual('9b1aff905b638aa274a5fc8f88662df446d374bd')
      })

      it('should parse sideNotes', () => {
        msg = parser(
          'My commit message\n' +
          '-sideNotes-\n' +
          'It should warn the correct unfound file names.\n' +
          'Also it should continue if one file cannot be found.\n' +
          'Tests are added for these',
          options,
          reg
        )

        expect(msg.sideNotes).toEqual('It should warn the correct unfound file names.\n' +
          'Also it should continue if one file cannot be found.\n' +
          'Tests are added for these')
      })

      it('should parse committer name and email', () => {
        msg = parser(
          'My commit message\n' +
          '-committerName-\n' +
          'Steve Mao\n' +
          '- committerEmail-\n' +
          'test@github.com',
          options,
          reg
        )

        expect(msg.committerName).toEqual('Steve Mao')
        expect(msg[' committerEmail']).toEqual('test@github.com')
      })
    })

    describe('revert', () => {
      it('should parse revert', () => {
        msg = parser(
          'Revert "throw an error if a callback is passed to animate methods"\n\n' +
          'This reverts commit 9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca.',
          options,
          reg
        )

        expect(msg.revert).toEqual({
          header: 'throw an error if a callback is passed to animate methods',
          hash: '9bb4d6ccbe80b7704c6b7f53317ca8146bc103ca'
        })
      })

      it('should parse revert even if a field is missing', () => {
        msg = parser(
          'Revert ""\n\n' +
          'This reverts commit .',
          options,
          reg
        )

        expect(msg.revert).toEqual({
          header: null,
          hash: null
        })
      })
    })
  })
})
