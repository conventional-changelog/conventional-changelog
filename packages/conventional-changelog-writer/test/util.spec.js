import { describe, it, expect } from 'vitest'
import { delay } from '../../../tools/test-tools.js'
import {
  compileTemplates,
  functionify,
  getCommitGroups,
  getNoteGroups,
  processCommit,
  getExtraContext,
  generate
} from '../lib/util.js'

describe('conventional-changelog-writer', () => {
  describe('util', () => {
    describe('compileTemplates', () => {
      it('should compile templates with default partials', () => {
        const templates = {
          mainTemplate: '{{> header}}{{> commit}}{{> footer}}',
          headerPartial: 'header\n',
          commitPartial: 'commit\n',
          footerPartial: 'footer\n'
        }
        const compiled = compileTemplates(templates)

        expect(compiled()).toBe('header\ncommit\nfooter\n')
      })

      it('should compile templates with default partials if one is an empty string', () => {
        const templates = {
          mainTemplate: '{{> header}}{{> commit}}{{> footer}}',
          headerPartial: '',
          commitPartial: 'commit\n',
          footerPartial: 'footer\n'
        }
        const compiled = compileTemplates(templates)

        expect(compiled()).toBe('commit\nfooter\n')
      })

      it('should compile templates with customized partials', () => {
        const templates = {
          mainTemplate: '{{> partial1}}{{> partial2}}{{> partial3}}',
          partials: {
            partial1: 'partial1\n',
            partial2: 'partial2\n',
            partial3: 'partial3\n',
            partial4: null
          }
        }
        const compiled = compileTemplates(templates)

        expect(compiled()).toBe('partial1\npartial2\npartial3\n')
      })
    })

    describe('functionify', () => {
      it('should turn any truthy value into a function', () => {
        const func = functionify('a')

        expect(func).toBeTypeOf('function')
      })

      it('should not change falsy value', () => {
        const func = functionify(null)

        expect(func).toBe(null)
      })
    })

    describe('getCommitGroups', () => {
      const commits = [{
        groupBy: 'A',
        content: 'this is A'
      }, {
        groupBy: 'A',
        content: 'this is another A'
      }, {
        groupBy: 'Big B',
        content: 'this is B and its a bit longer'
      }]

      it('should group but not sort groups', () => {
        const commitGroups = getCommitGroups('groupBy', commits)

        expect(commitGroups).toEqual([{
          title: 'A',
          commits: [{
            groupBy: 'A',
            content: 'this is A'
          }, {
            groupBy: 'A',
            content: 'this is another A'
          }]
        }, {
          title: 'Big B',
          commits: [{
            groupBy: 'Big B',
            content: 'this is B and its a bit longer'
          }]
        }])
      })

      it('should group if `groupBy` is undefined', () => {
        const commits = [{
          content: 'this is A'
        }, {
          content: 'this is another A'
        }, {
          groupBy: 'Big B',
          content: 'this is B and its a bit longer'
        }]
        const commitGroups = getCommitGroups('groupBy', commits)

        expect(commitGroups).toEqual([{
          title: false,
          commits: [{
            content: 'this is A'
          }, {
            content: 'this is another A'
          }]
        }, {
          title: 'Big B',
          commits: [{
            groupBy: 'Big B',
            content: 'this is B and its a bit longer'
          }]
        }])
      })

      it('should group and sort groups', () => {
        const commitGroups = getCommitGroups('groupBy', commits, (a, b) => {
          if (a.title.length < b.title.length) {
            return 1
          }
          if (a.title.length > b.title.length) {
            return -1
          }
          return 0
        })

        expect(commitGroups).toEqual([{
          title: 'Big B',
          commits: [{
            groupBy: 'Big B',
            content: 'this is B and its a bit longer'
          }]
        }, {
          title: 'A',
          commits: [{
            groupBy: 'A',
            content: 'this is A'
          }, {
            groupBy: 'A',
            content: 'this is another A'
          }]
        }])
      })

      it('should group and but not sort commits', () => {
        const commitGroups = getCommitGroups('groupBy', commits)

        expect(commitGroups).toEqual([{
          title: 'A',
          commits: [{
            groupBy: 'A',
            content: 'this is A'
          }, {
            groupBy: 'A',
            content: 'this is another A'
          }]
        }, {
          title: 'Big B',
          commits: [{
            groupBy: 'Big B',
            content: 'this is B and its a bit longer'
          }]
        }])
      })

      it('should group and sort commits', () => {
        const commitGroups = getCommitGroups('groupBy', commits, false, (a, b) => {
          if (a.content.length < b.content.length) {
            return 1
          }
          if (a.content.length > b.content.length) {
            return -1
          }
          return 0
        })

        expect(commitGroups).toEqual([{
          title: 'A',
          commits: [{
            groupBy: 'A',
            content: 'this is another A'
          }, {
            groupBy: 'A',
            content: 'this is A'
          }]
        }, {
          title: 'Big B',
          commits: [{
            groupBy: 'Big B',
            content: 'this is B and its a bit longer'
          }]
        }])
      })
    })

    describe('getNoteGroups', () => {
      const notes = [{
        title: 'A title',
        text: 'this is A and its a bit longer'
      }, {
        title: 'B+',
        text: 'this is B'
      }, {
        title: 'C',
        text: 'this is C'
      }, {
        title: 'A title',
        text: 'this is another A'
      }, {
        title: 'B+',
        text: 'this is another B'
      }]

      it('should group', () => {
        const noteGroups = getNoteGroups(notes)

        expect(noteGroups).toEqual([{
          title: 'A title',
          notes: [{
            title: 'A title',
            text: 'this is A and its a bit longer'
          }, {
            title: 'A title',
            text: 'this is another A'
          }]
        }, {
          title: 'B+',
          notes: [{
            title: 'B+',
            text: 'this is B'
          }, {
            title: 'B+',
            text: 'this is another B'
          }]
        }, {
          title: 'C',
          notes: [{
            title: 'C',
            text: 'this is C'
          }]
        }])
      })

      it('should group and sort groups', () => {
        const noteGroups = getNoteGroups(notes, (a, b) => {
          if (a.title.length > b.title.length) {
            return 1
          }
          if (a.title.length < b.title.length) {
            return -1
          }
          return 0
        })

        expect(noteGroups).toEqual([{
          title: 'C',
          notes: [{
            title: 'C',
            text: 'this is C'
          }]
        }, {
          title: 'B+',
          notes: [{
            title: 'B+',
            text: 'this is B'
          }, {
            title: 'B+',
            text: 'this is another B'
          }]
        }, {
          title: 'A title',
          notes: [{
            title: 'A title',
            text: 'this is A and its a bit longer'
          }, {
            title: 'A title',
            text: 'this is another A'
          }]
        }])
      })

      it('should group and sort notes', () => {
        const noteGroups = getNoteGroups(notes, false, (a, b) => {
          if (a.text.length < b.text.length) {
            return 1
          }
          if (a.text.length > b.text.length) {
            return -1
          }
          return 0
        })

        expect(noteGroups).toEqual([{
          title: 'A title',
          notes: [{
            title: 'A title',
            text: 'this is A and its a bit longer'
          }, {
            title: 'A title',
            text: 'this is another A'
          }]
        }, {
          title: 'B+',
          notes: [{
            title: 'B+',
            text: 'this is another B'
          }, {
            title: 'B+',
            text: 'this is B'
          }]
        }, {
          title: 'C',
          notes: [{
            title: 'C',
            text: 'this is C'
          }]
        }])
      })

      it('should work if title does not exist', () => {
        const notes = [{
          title: '',
          text: 'this is A and its a bit longer'
        }, {
          title: 'B+',
          text: 'this is B'
        }, {
          title: '',
          text: 'this is another A'
        }, {
          title: 'B+',
          text: 'this is another B'
        }]

        const noteGroups = getNoteGroups(notes)

        expect(noteGroups).toEqual([{
          title: '',
          notes: [{
            title: '',
            text: 'this is A and its a bit longer'
          }, {
            title: '',
            text: 'this is another A'
          }]
        }, {
          title: 'B+',
          notes: [{
            title: 'B+',
            text: 'this is B'
          }, {
            title: 'B+',
            text: 'this is another B'
          }]
        }])
      })
    })

    describe('processCommit', () => {
      const commit = {
        hash: '456789uhghi',
        subject: 'my subject!!!',
        replaceThis: 'bad',
        doNothing: 'nothing'
      }

      it('should process object commit', async () => {
        const processed = await processCommit(commit)

        expect(processed).toEqual({
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing'
          }
        })
      })

      it('should process json commit', async () => {
        const processed = await processCommit(JSON.stringify(commit))

        expect(processed).toEqual({
          hash: '456789uhghi',
          subject: 'my subject!!!',
          replaceThis: 'bad',
          doNothing: 'nothing',
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing'
          }
        })
      })

      it('should transform by a function', async () => {
        const processed = await processCommit(commit, (commit) => {
          commit.hash = commit.hash.substring(0, 4)
          commit.subject = commit.subject.substring(0, 5)
          commit.replaceThis = 'replaced'
          return commit
        })

        expect(processed).toEqual({
          hash: '4567',
          subject: 'my su',
          replaceThis: 'replaced',
          doNothing: 'nothing',
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing'
          }
        })
      })

      it('should transform by an object', async () => {
        const processed = await processCommit(commit, {
          hash: (hash) => {
            return hash.substring(0, 4)
          },
          subject: (subject) => {
            return subject.substring(0, 5)
          },
          replaceThis: 'replaced'
        })

        expect(processed).toEqual({
          hash: '4567',
          subject: 'my su',
          replaceThis: 'replaced',
          doNothing: 'nothing',
          raw: {
            hash: '456789uhghi',
            subject: 'my subject!!!',
            replaceThis: 'bad',
            doNothing: 'nothing'
          }
        })
      })

      it('should transform by an object using dot path', async () => {
        const processed = await processCommit({
          header: {
            subject: 'my subject'
          }
        }, {
          'header.subject': (subject) => {
            return subject.substring(0, 5)
          }
        })

        expect(processed).toEqual({
          header: {
            subject: 'my su'
          },
          raw: {
            header: {
              subject: 'my subject'
            }
          }
        })
      })
    })

    describe('processContext', () => {
      const commits = [{
        content: 'this is A'
      }, {
        content: 'this is another A'
      }, {
        groupBy: 'Big B',
        content: 'this is B and its a bit longer'
      }]

      const notes = [{
        title: 'A',
        text: 'this is A and its a bit longer'
      }, {
        title: 'B',
        text: 'this is B'
      }, {
        title: 'A',
        text: 'this is another A'
      }, {
        title: 'B',
        text: 'this is another B'
      }]

      it('should process context without `options.groupBy`', () => {
        const extra = getExtraContext(commits, notes, {})

        expect(extra).toEqual({
          commitGroups: [{
            title: false,
            commits: [{
              content: 'this is A'
            }, {
              content: 'this is another A'
            }, {
              content: 'this is B and its a bit longer',
              groupBy: 'Big B'
            }]
          }],
          noteGroups: [{
            title: 'A',
            notes: [{
              title: 'A',
              text: 'this is A and its a bit longer'
            }, {
              title: 'A',
              text: 'this is another A'
            }]
          }, {
            title: 'B',
            notes: [{
              title: 'B',
              text: 'this is B'
            }, {
              title: 'B',
              text: 'this is another B'
            }]
          }]
        })
      })

      it('should process context with `options.groupBy` found', () => {
        const extra = getExtraContext(commits, notes, {
          groupBy: 'groupBy'
        })

        expect(extra).toEqual({
          commitGroups: [{
            title: false,
            commits: [{
              content: 'this is A'
            }, {
              content: 'this is another A'
            }]
          }, {
            title: 'Big B',
            commits: [{
              content: 'this is B and its a bit longer',
              groupBy: 'Big B'
            }]
          }],
          noteGroups: [{
            title: 'A',
            notes: [{
              title: 'A',
              text: 'this is A and its a bit longer'
            }, {
              title: 'A',
              text: 'this is another A'
            }]
          }, {
            title: 'B',
            notes: [{
              title: 'B',
              text: 'this is B'
            }, {
              title: 'B',
              text: 'this is another B'
            }]
          }]
        })
      })

      it('should process context with `options.groupBy` not found', () => {
        const extra = getExtraContext(commits, notes, {
          groupBy: 'what?'
        })

        expect(extra).toEqual({
          commitGroups: [{
            title: false,
            commits: [{
              content: 'this is A'
            }, {
              content: 'this is another A'
            }, {
              content: 'this is B and its a bit longer',
              groupBy: 'Big B'
            }]
          }],
          noteGroups: [{
            title: 'A',
            notes: [{
              title: 'A',
              text: 'this is A and its a bit longer'
            }, {
              title: 'A',
              text: 'this is another A'
            }]
          }, {
            title: 'B',
            notes: [{
              title: 'B',
              text: 'this is B'
            }, {
              title: 'B',
              text: 'this is another B'
            }]
          }]
        })
      })
    })

    describe('generate', () => {
      it('should merge with the key commit', async () => {
        const log = await generate({
          mainTemplate: '{{whatever}}',
          finalizeContext: (context) => {
            return context
          },
          debug: () => {}
        }, [], {
          whatever: 'a'
        }, {
          whatever: 'b'
        })

        expect(log).toBe('b')
      })

      it('should attach a copy of the commit to note', async () => {
        const log = await generate({
          mainTemplate: '{{#each noteGroups}}{{#each notes}}{{commit.header}}{{/each}}{{/each}}',
          ignoreReverted: true,
          finalizeContext: (context) => {
            return context
          },
          debug: () => {}
        }, [{
          header: 'feat(): new feature',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'WOW SO MANY CHANGES'
          }],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3'
        }, {
          header: 'chore: first commit',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'Not backward compatible.'
          }, {
            title: 'IMPORTANT CHANGE',
            text: 'This is very important!'
          }],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a'
        }])

        expect(log).toContain('feat(): new feature')
        expect(log).toContain('chore: first commit')
      })

      it('should not html escape any content', async () => {
        const log = await generate({
          mainTemplate: '{{whatever}}',
          finalizeContext: (context) => {
            return context
          },
          debug: () => {}
        }, [], [], {
          whatever: '`a`'
        })

        expect(log).toBe('`a`')
      })

      it('should ignore a reverted commit', async () => {
        const log = await generate({
          mainTemplate: '{{#each commitGroups}}{{commits.length}}{{#each commits}}{{header}}{{/each}}{{/each}}{{#each noteGroups}}{{title}}{{#each notes}}{{text}}{{/each}}{{/each}}',
          ignoreReverted: true,
          finalizeContext: (context) => {
            return context
          },
          debug: () => {}
        }, [{
          header: 'revert: feat(): amazing new module\n',
          body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
          footer: null,
          notes: [],
          references: [],
          revert: {
            header: 'feat(): amazing new module',
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
          },
          hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
        }, {
          header: 'feat(): amazing nee\n',
          body: null,
          footer: 'BREAKI]ompatible.\n',
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'some breaking change'
          }],
          references: [],
          revert: null,
          hash: '56185b',
          raw: {
            header: 'feat(): amazing new module\n',
            body: null,
            footer: 'BREAKING CHANGE: Not backward compatible.\n',
            notes: [{
              title: 'BREAKING CHANGE',
              text: 'some breaking change'
            }],
            references: [],
            revert: null,
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
          }
        }, {
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'WOW SO MANY CHANGES'
          }],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }, {
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }])

        expect(log).toContain('feat(): new feature\n')
        expect(log).toContain('chore: first commit\n')
        expect(log).toContain('WOW SO MANY CHANGES')
        expect(log).not.toContain('amazing new module')
        expect(log).not.toContain('revert')
        expect(log).not.toContain('breaking change')
      })

      it('should finalize context', async () => {
        const log = await generate({
          mainTemplate: '{{whatever}} {{somethingExtra}}',
          finalizeContext: (context) => {
            context.somethingExtra = 'oh'
            return context
          },
          debug: () => {}
        }, [], [], {
          whatever: '`a`'
        })

        expect(log).toBe('`a` oh')
      })

      it('should support finalize the context async', async () => {
        const log = await generate({
          mainTemplate: '{{whatever}} {{somethingExtra}}',
          async finalizeContext (context) {
            await delay(100)
            context.somethingExtra = 'oh'
            return context
          },
          debug: () => {}
        }, [], [], {
          whatever: '`a`'
        })

        expect(log).toBe('`a` oh')
      })

      it('should finalize context', async () => {
        const log = await generate({
          mainTemplate: '{{whatever}} {{somethingExtra}} {{opt}} {{commitsLen}} {{whatever}}',
          finalizeContext: (context, options, commits, keyCommit) => {
            context.somethingExtra = 'oh'
            context.opt = options.opt
            context.commitsLen = commits.length
            context.whatever = keyCommit.whatever

            return context
          },
          debug: () => {},
          opt: 'opt'
        }, [], [], {
          whatever: '`a`'
        })

        expect(log).toBe('`a` oh opt 0 `a`')
      })

      it('should pass the correct arguments', async () => {
        await generate({
          mainTemplate: '{{#each noteGroups}}{{#each notes}}{{commit.header}}{{/each}}{{/each}}',
          ignoreReverted: true,
          finalizeContext: (context, options, filteredCommits, keyCommit, originalCommits) => {
            expect(filteredCommits.length).toBe(2)
            expect(originalCommits.length).toBe(4)
          },
          debug: () => {}
        }, [{
          header: 'revert: feat(): amazing new module\n',
          body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
          footer: null,
          notes: [],
          references: [],
          revert: {
            header: 'feat(): amazing new module',
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
          },
          hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
        }, {
          header: 'feat(): amazing nee\n',
          body: null,
          footer: 'BREAKI]ompatible.\n',
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'some breaking change'
          }],
          references: [],
          revert: null,
          hash: '56185b',
          raw: {
            header: 'feat(): amazing new module\n',
            body: null,
            footer: 'BREAKING CHANGE: Not backward compatible.\n',
            notes: [{
              title: 'BREAKING CHANGE',
              text: 'some breaking change'
            }],
            references: [],
            revert: null,
            hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
          }
        }, {
          header: 'feat(): new feature\n',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'WOW SO MANY CHANGES'
          }],
          references: [],
          revert: null,
          hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
        }, {
          header: 'chore: first commit\n',
          body: null,
          footer: null,
          notes: [],
          references: [],
          revert: null,
          hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
        }])
      })
    })
  })
})
