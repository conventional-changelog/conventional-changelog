import {
  describe,
  it,
  expect
} from 'vitest'
import { delay } from '../../../tools/index.js'
import type {
  CommitKnownProps,
  FinalTemplateContext
} from '@conventional-changelog/template'
import { getFinalContext } from './context.js'
import { getFinalOptions } from './options.js'
import { createTemplateRenderer } from './template.js'

function renderNotesCommitHeaders({ noteGroups }: FinalTemplateContext) {
  return noteGroups
    ?.flatMap(group => group.notes)
    .map(note => (note as typeof note & { commit: CommitKnownProps }).commit.header)
    .join('') || ''
}

function renderContextDetails({ commitGroups, noteGroups }: FinalTemplateContext) {
  return `${commitGroups?.map(group => `${group.commits.length}${
    group.commits.map(commit => commit.header).join('')
  }`).join('') || ''}${
    noteGroups?.map(group => `${group.title}${
      group.notes.map(note => note.text).join('')
    }`).join('') || ''
  }`
}

describe('conventional-changelog-writer', () => {
  describe('template', () => {
    describe('createTemplateRenderer', () => {
      it('should merge with the key commit', async () => {
        const finalOptions = getFinalOptions({
          template: context => context.version || ''
        })
        const finalContext = getFinalContext({
          version: 'a'
        }, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([], {
          version: 'b',
          notes: []
        })

        expect(log).toBe('b\n')
      })

      it('should attach a copy of the commit to note', async () => {
        const finalOptions = getFinalOptions({
          ignoreReverted: true,
          template: renderNotesCommitHeaders
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([
          {
            header: 'feat(): new feature',
            body: null,
            footer: null,
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'WOW SO MANY CHANGES'
              }
            ],
            revert: null,
            hash: '815a3f0717bf1dfce007bd076420c609504edcf3',
            get raw() {
              return this
            }
          },
          {
            header: 'chore: first commit',
            body: null,
            footer: null,
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'Not backward compatible.'
              },
              {
                title: 'IMPORTANT CHANGE',
                text: 'This is very important!'
              }
            ],
            revert: null,
            hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a',
            get raw() {
              return this
            }
          }
        ], {
          notes: []
        })

        expect(log).toContain('feat(): new feature')
        expect(log).toContain('chore: first commit')
      })

      it('should not html escape any content', async () => {
        const finalOptions = getFinalOptions({
          template: context => context.version || ''
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([], {
          version: '`a`',
          notes: []
        })

        expect(log).toBe('`a`\n')
      })

      it('should ignore a reverted commit', async () => {
        const finalOptions = getFinalOptions({
          ignoreReverted: true,
          template: renderContextDetails
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([
          {
            header: 'revert: feat(): amazing new module\n',
            body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
            footer: null,
            notes: [],
            revert: {
              header: 'feat(): amazing new module',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
            },
            hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
            get raw() {
              return this
            }
          },
          {
            header: 'feat(): amazing nee\n',
            body: null,
            footer: 'BREAKI]ompatible.\n',
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'some breaking change'
              }
            ],
            revert: null,
            hash: '56185b',
            raw: {
              header: 'feat(): amazing new module\n',
              body: null,
              footer: 'BREAKING CHANGE: Not backward compatible.\n',
              notes: [
                {
                  title: 'BREAKING CHANGE',
                  text: 'some breaking change'
                }
              ],
              revert: null,
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
            }
          },
          {
            header: 'feat(): new feature\n',
            body: null,
            footer: null,
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'WOW SO MANY CHANGES'
              }
            ],
            revert: null,
            hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n',
            get raw() {
              return this
            }
          },
          {
            header: 'chore: first commit\n',
            body: null,
            footer: null,
            notes: [],
            revert: null,
            hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n',
            get raw() {
              return this
            }
          }
        ], {
          notes: []
        })

        expect(log).toContain('feat(): new feature\n')
        expect(log).toContain('chore: first commit\n')
        expect(log).toContain('WOW SO MANY CHANGES')
        expect(log).not.toContain('amazing new module')
        expect(log).not.toContain('revert')
        expect(log).not.toContain('breaking change')
      })

      it('should finalize context', async () => {
        const finalOptions = getFinalOptions({
          finalizeContext: (context) => {
            context.title = 'oh'
            return context
          },
          template: context => `${context.version} ${context.title}`
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([], {
          version: '`a`',
          notes: []
        })

        expect(log).toBe('`a` oh\n')
      })

      it('should support finalize the context async', async () => {
        const finalOptions = getFinalOptions({
          finalizeContext: async (context) => {
            await delay(100)
            context.title = 'oh'
            return context
          },
          template: context => `${context.version} ${context.title}`
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([], {
          version: '`a`',
          notes: []
        })

        expect(log).toBe('`a` oh\n')
      })

      it('should finalize context with commits and key commit', async () => {
        const finalOptions = getFinalOptions({
          finalizeContext: (context, _options, commits, keyCommit) => {
            context.title = 'oh'
            context.date = String(commits.length)
            context.version = keyCommit?.version || ''

            return context
          },
          template: context => `${context.version} ${context.title} ${context.date} ${context.version}`
        })
        const finalContext = getFinalContext({}, finalOptions)
        const log = await createTemplateRenderer(finalContext, finalOptions)([], {
          version: '`a`',
          notes: []
        })

        expect(log).toBe('`a` oh 0 `a`\n')
      })

      it('should pass the correct arguments', async () => {
        const finalOptions = getFinalOptions({
          ignoreReverted: true,
          finalizeContext: (context, _options, filteredCommits, _keyCommit, originalCommits) => {
            expect(filteredCommits.length).toBe(2)
            expect(originalCommits.length).toBe(4)

            return context
          },
          template: renderNotesCommitHeaders
        })
        const finalContext = getFinalContext({}, finalOptions)

        await createTemplateRenderer(finalContext, finalOptions)([
          {
            header: 'revert: feat(): amazing new module\n',
            body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
            footer: null,
            notes: [],
            revert: {
              header: 'feat(): amazing new module',
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a'
            },
            hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
            get raw() {
              return this
            }
          },
          {
            header: 'feat(): amazing nee\n',
            body: null,
            footer: 'BREAKI]ompatible.\n',
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'some breaking change'
              }
            ],
            revert: null,
            hash: '56185b',
            raw: {
              header: 'feat(): amazing new module\n',
              body: null,
              footer: 'BREAKING CHANGE: Not backward compatible.\n',
              notes: [
                {
                  title: 'BREAKING CHANGE',
                  text: 'some breaking change'
                }
              ],
              revert: null,
              hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
            }
          },
          {
            header: 'feat(): new feature\n',
            body: null,
            footer: null,
            notes: [
              {
                title: 'BREAKING CHANGE',
                text: 'WOW SO MANY CHANGES'
              }
            ],
            revert: null,
            hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n',
            get raw() {
              return this
            }
          },
          {
            header: 'chore: first commit\n',
            body: null,
            footer: null,
            notes: [],
            revert: null,
            hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n',
            get raw() {
              return this
            }
          }
        ], {
          notes: []
        })
      })
    })
  })
})
