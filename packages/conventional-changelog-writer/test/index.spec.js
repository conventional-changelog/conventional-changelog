import dedent from 'dedent'
import { describe, it, expect } from 'vitest'
import { delay, throughObj } from '../../../tools/test-tools.ts'
import conventionalChangelogWriter, { parseArray } from '../index.js'

function formatDate (date, timeZone = 'UTC') {
  // sv-SE is used for yyyy-mm-dd format
  return Intl.DateTimeFormat('sv-SE', {
    timeZone
  }).format(date)
}

function getTodayDate (timeZone) {
  return formatDate(new Date(), timeZone)
}

const todayUtc = getTodayDate()

const commits = [
  {
    hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
    header: 'feat(scope): broadcast $destroy event on scope destruction',
    body: null,
    footer: 'Closes #1',
    notes: [{
      title: 'BREAKING NEWS',
      text: 'breaking news'
    }],
    references: [{
      action: 'Closes',
      repository: null,
      issue: '1',
      raw: '#1'
    }, {
      action: 'Closes',
      repository: null,
      issue: '2',
      raw: '#2'
    }, {
      action: 'Closes',
      repository: null,
      issue: '3',
      raw: '#3'
    }]
  },
  {
    hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
    header: 'fix(ng-list): Allow custom separator',
    body: 'bla bla bla',
    footer: 'BREAKING CHANGE: some breaking change',
    notes: [{
      title: 'BREAKING CHANGE',
      text: 'some breaking change'
    }],
    references: []
  },
  {
    hash: '2064a9346c550c9b5dbd17eee7f0b7dd2cde9cf7',
    header: 'perf(template): tweak',
    body: 'My body.',
    footer: '',
    notes: [],
    references: []
  },
  {
    hash: '5f241416b79994096527d319395f654a8972591a',
    header: 'refactor(name): rename this module to conventional-changelog-writer',
    body: '',
    footer: '',
    notes: [],
    references: []
  }
]

describe('conventional-changelog-writer', () => {
  function getStream () {
    const upstream = throughObj()
    for (const commit of commits) {
      upstream.write(commit)
    }
    upstream.end()
    return upstream
  }

  describe('no commits', () => {
    it('should still work if there is no commits', async () => {
      let i = 0
      const upstream = throughObj()
      upstream.end()

      for await (let chunk of upstream.pipe(conventionalChangelogWriter())) {
        chunk = chunk.toString()
        expect(chunk).toBe('##  (' + todayUtc + ')\n\n\n\n\n')
        i++
      }

      expect(i).toBe(1)
    })
  })

  describe('link', () => {
    it('should auto link if `context.repository`, `context.commit` and `context.issue` are truthy', async () => {
      let i = 0
      const context = {
        version: '0.5.0',
        title: 'this is a title',
        host: 'https://github.com',
        repository: 'a/b'
      }
      const changelog = await parseArray(commits, context)

      expect(changelog).toContain('https://github.com/a/b/commits/13f3160')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter(context))) {
        chunk = chunk.toString()
        expect(chunk).toContain('https://github.com/a/b/commits/13f3160')
        i++
      }

      expect(i).toBe(1)
    })

    it('should auto link if `context.repoUrl`, `context.commit` and `context.issue` are truthy', async () => {
      let i = 0
      const context = {
        version: '0.5.0',
        title: 'this is a title',
        repoUrl: 'https://github.com/a/b'
      }
      const changelog = await parseArray(commits, context)

      expect(changelog).toContain('https://github.com/a/b/commits/13f3160')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter(context))) {
        chunk = chunk.toString()
        expect(chunk.toString()).toContain('https://github.com/a/b/commits/13f3160')
        i++
      }

      expect(i).toBe(1)
    })

    it('should not auto link', async () => {
      let i = 0
      const changelog = await parseArray(commits, {})

      expect(changelog).not.toContain('https://github.com/a/b/commits/13f3160')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter())) {
        chunk = chunk.toString()
        expect(chunk.toString()).not.toContain('https://github.com/a/b/commits/13f3160')
        i++
      }

      expect(i).toBe(1)
    })

    it('should not link references', async () => {
      let i = 0
      const context = {
        version: '0.5.0',
        title: 'this is a title',
        host: 'https://github.com',
        repository: 'a/b',
        linkReferences: false
      }
      const changelog = await parseArray(commits, context)

      expect(changelog).not.toContain('https://github.com/a/b/commits/13f3160')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter(context))) {
        chunk = chunk.toString()
        expect(chunk).not.toContain('https://github.com/a/b/commits/13f3160')
        i++
      }

      expect(i).toBe(1)
    })
  })

  describe('transform', () => {
    it('should transform the commit with context', async () => {
      let i = 0
      let called = false

      await parseArray(commits, {}, {
        transform (commit, context) {
          expect(context).toEqual({
            commit: 'commits',
            issue: 'issues',
            date: todayUtc
          })
          called = true
          return commit
        }
      })
      expect(called).toBe(true)

      for await (const commit of getStream().pipe(conventionalChangelogWriter({}, {
        transform (commit, context) {
          expect(context).toEqual({
            commit: 'commits',
            issue: 'issues',
            date: todayUtc
          })

          return commit
        }
      }))) {
        commit.toString()
        i++
      }

      expect(i).toBe(1)
    })

    it('should leave the original commits objects unchanged', async () => {
      expect(commits[1].notes[0].title).toBe('BREAKING CHANGE')
      await parseArray(commits, {}, {
        transform: {
          notes (notes) {
            notes.map((note) => {
              if (note.title === 'BREAKING CHANGE') {
                note.title = 'BREAKING CHANGES'
              }

              return note
            })

            return notes
          }
        }
      })
      // the original commit should not be changed
      expect(commits[1].notes[0].title).toBe('BREAKING CHANGE')
    })

    it('should merge with the provided transform object', async () => {
      let i = 0
      const changelog = await parseArray(commits, {}, {
        transform: {
          notes (notes) {
            notes.map((note) => {
              if (note.title === 'BREAKING CHANGE') {
                note.title = 'BREAKING CHANGES'
              }

              return note
            })

            return notes
          }
        }
      })
      expect(changelog).toContain('13f3160')
      expect(changelog).toContain('BREAKING CHANGES')
      expect(changelog).not.toContain('13f31602f396bc269076ab4d389cfd8ca94b20ba')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
        transform: {
          notes (notes) {
            notes.map((note) => {
              if (note.title === 'BREAKING CHANGE') {
                note.title = 'BREAKING CHANGES'
              }

              return note
            })

            return notes
          }
        }
      }))) {
        chunk = chunk.toString()

        expect(chunk).toContain('13f3160')
        expect(chunk).toContain('BREAKING CHANGES')
        expect(chunk).not.toContain('13f31602f396bc269076ab4d389cfd8ca94b20ba')

        i++
      }

      expect(i).toBe(1)
    })

    it('should ignore the commit if tranform returns `null`', async () => {
      let i = 0
      const changelog = await parseArray(commits, {}, {
        transform () {
          return false
        }
      })

      expect(changelog).toBe('##  (' + todayUtc + ')\n\n\n\n\n')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
        transform () {
          return false
        }
      }))) {
        chunk = chunk.toString()
        expect(chunk).toBe('##  (' + todayUtc + ')\n\n\n\n\n')

        i++
      }

      expect(i).toBe(1)
    })

    it('should support tranform commits async', async () => {
      const changelog = await parseArray(commits, {}, {
        async transform () {
          await delay(100)
          return {
            hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
            header: 'feat(scope): broadcast $destroy event on scope destruction',
            body: null,
            notes: [{
              title: 'BREAKING CHANGE',
              text: 'some breaking change'
            }]
          }
        }
      })

      expect(changelog).toContain('broadcast $destroy event on scope destruction')
    })
  })

  describe('generate', () => {
    const commits = [
      {
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [],
        references: [],
        committerDate: '2015-04-07 14:17:05 +1000'
      },
      {
        header: 'fix(ng-list): Allow custom separator',
        body: 'bla bla bla',
        footer: null,
        notes: [],
        references: [],
        version: '1.0.1',
        committerDate: '2015-04-07 15:00:44 +1000'
      },
      {
        header: 'perf(template): tweak',
        body: 'My body.',
        footer: null,
        notes: [],
        references: [],
        committerDate: '2015-04-07 15:01:30 +1000'
      },
      {
        header: 'refactor(name): rename this module to conventional-changelog-writer',
        body: null,
        footer: null,
        notes: [],
        references: [],
        committerDate: '2015-04-08 09:43:59 +1000'
      }
    ]

    function getStream () {
      const upstream = throughObj()
      for (const commit of commits) {
        upstream.write(commit)
      }
      upstream.end()

      return upstream
    }

    it('should generate on the transformed commit', async () => {
      let i = 0
      const changelog = await parseArray(commits, {
        version: '1.0.0'
      }, {
        transform (commit) {
          commit.version = '1.0.0'
          return commit
        }
      })

      expect(changelog).toContain('# 1.0.0 ')

      for await (let chunk of getStream().pipe(conventionalChangelogWriter({
        version: '1.0.0'
      }, {
        transform (commit) {
          commit.version = '1.0.0'
          return commit
        }
      }))) {
        chunk = chunk.toString()
        expect(chunk).toContain('# 1.0.0 ')
        i++
      }

      expect(i).toBe(5)
    })

    describe('when commits are not reversed', () => {
      it('should generate on `\'version\'` if it\'s a valid semver', async () => {
        let i = 0
        const changelog = await parseArray(commits)

        expect(changelog).toContain('##  (' + todayUtc)
        expect(changelog).toContain('feat(scope): ')
        expect(changelog).toContain('## <small>1.0.1 (2015-04-07)</small>')
        expect(changelog).toContain('fix(ng-list): ')
        expect(changelog).toContain('perf(template): ')
        expect(changelog).toContain('refactor(name): ')

        for await (let chunk of getStream().pipe(conventionalChangelogWriter())) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('##  (' + todayUtc)
            expect(chunk).toContain('feat(scope): ')

            expect(chunk).not.toContain('fix(ng-list): ')
            expect(chunk).not.toContain('perf(template): ')
            expect(chunk).not.toContain('refactor(name): ')
          } else {
            expect(chunk).toContain('## <small>1.0.1 (2015-04-07)</small>')
            expect(chunk).toContain('fix(ng-list): ')
            expect(chunk).toContain('perf(template): ')
            expect(chunk).toContain('refactor(name): ')

            expect(chunk).not.toContain('feat(scope): ')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('`generateOn` could be a string', async () => {
        let i = 0
        const commits = [
          {
            header: 'feat(scope): broadcast $destroy event on scope destruction',
            body: null,
            footer: null,
            notes: [],
            references: [],
            version: '1.0.1',
            committerDate: '2015-04-07 14:17:05 +1000'
          },
          {
            header: 'fix(ng-list): Allow custom separator',
            body: 'bla bla bla',
            footer: null,
            notes: [],
            references: [],
            version: '2.0.1',
            committerDate: '2015-04-07 15:00:44 +1000'
          },
          {
            header: 'perf(template): tweak',
            body: 'My body.',
            footer: null,
            notes: [],
            references: [],
            committerDate: '2015-04-07 15:01:30 +1000'
          },
          {
            header: 'refactor(name): rename this module to conventional-changelog-writer',
            body: null,
            footer: null,
            notes: [],
            references: [],
            version: '4.0.1',
            committerDate: '2015-04-08 09:43:59 +1000'
          }
        ]
        const upstream = throughObj()

        for (const commit of commits) {
          upstream.write(commit)
        }

        upstream.end()

        const changelog = await parseArray(commits, {}, {
          generateOn: 'version'
        })

        expect(changelog).toContain('##  (' + todayUtc)
        expect(changelog).toContain('feat(scope): broadcast $destroy event on scope destruction')
        expect(changelog).not.toContain('<a name=""></a>')
        expect(changelog).toContain('fix(ng-list): Allow custom separator')
        expect(changelog).toContain('perf(template): tweak')
        expect(changelog).toContain('refactor(name): rename this module to conventional-changelog-writer')
        expect(changelog).toContain('perf(template): tweak')

        for await (let chunk of upstream.pipe(conventionalChangelogWriter({}, {
          generateOn: 'version'
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('##  (' + todayUtc)

            expect(chunk).not.toContain('## 1.0.1 (2015-04-07)')
          } else if (i === 1) {
            expect(chunk).toContain('feat(scope): broadcast $destroy event on scope destruction')
            expect(chunk).not.toContain('<a name=""></a>')
          } else if (i === 2) {
            expect(chunk).toContain('fix(ng-list): Allow custom separator')
            expect(chunk).toContain('perf(template): tweak')
          } else if (i === 3) {
            expect(chunk).toContain('refactor(name): rename this module to conventional-changelog-writer')
            expect(chunk).not.toContain('perf(template): tweak')
          }

          i++
        }

        expect(i).toBe(4)
      })

      it('`generateOn` could be a function', async () => {
        let i = 0

        for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
          generateOn (commit, commits, context, options) {
            expect(commits.length).toBeTypeOf('number')
            expect(context.commit).toBe('commits')
            expect(options.groupBy).toBe('type')

            return commit.version
          }
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('##  (' + todayUtc)
            expect(chunk).not.toContain('## 1.0.1 (2015-04-07)')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('`generateOn` could be a null', async () => {
        let i = 0

        for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
          generateOn: null
        }))) {
          chunk = chunk.toString()

          expect(chunk).toContain('##  (' + todayUtc)

          i++
        }

        expect(i).toBe(1)
      })

      it('version should fall back on `context.version` and `context.date`', async () => {
        let i = 0

        const changelog = await parseArray(commits, {
          version: '0.0.1',
          date: '2015-01-01'
        })

        expect(changelog).toContain('## <small>0.0.1 (2015-01-01)</small>')
        expect(changelog).toContain('## <small>1.0.1 (2015-04-07)</small>')

        for await (let chunk of getStream().pipe(conventionalChangelogWriter({
          version: '0.0.1',
          date: '2015-01-01'
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('## <small>0.0.1 (2015-01-01)</small>')
          } else {
            expect(chunk).toContain('## <small>1.0.1 (2015-04-07)</small>')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should still generate a block even if the commit is ignored', async () => {
        let i = 0

        for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
          transform () {
            return false
          }
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toBe('##  (' + todayUtc + ')\n\n\n\n\n')
          } else {
            expect(chunk).toBe('## <small>1.0.1 (2015-04-07 15:00:44 +1000)</small>\n\n\n\n\n')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should include details', async () => {
        let i = 0

        for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
          includeDetails: true
        }))) {
          if (i === 0) {
            expect(chunk.log).toContain('##  (' + todayUtc + ')\n\n')
            expect(chunk.log).toContain('feat(scope): broadcast $destroy event on scope destruction')
            expect(chunk.keyCommit).toBe()
          } else {
            expect(chunk.log).toContain('## <small>1.0.1 (2015-04-07)</small>\n\n')
            expect(chunk.log).toContain('fix(ng-list): Allow custom separator')
            expect(chunk.log).toContain('perf(template): tweak')
            expect(chunk.log).toContain('refactor(name): rename this module to conventional-changelog-writer')
            expect(chunk.keyCommit.body).toBe('bla bla bla')
            expect(chunk.keyCommit.committerDate).toBe('2015-04-07')
            expect(chunk.keyCommit.version).toBe('1.0.1')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should not flush when previous release is generated', async () => {
        let i = 0
        const upstream = throughObj()

        upstream.write({
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'No backward compatibility.'
          }],
          references: [],
          committerDate: '2015-04-07 14:17:05 +1000',
          version: 'v1.0.0'
        })
        upstream.write({
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'No backward compatibility.'
          }],
          references: [],
          committerDate: '2015-04-07 14:17:05 +1000',
          version: 'v0.1.4'
        })
        upstream.end()

        for await (let chunk of upstream.pipe(conventionalChangelogWriter({
          version: 'v2.0.0'
        }, {
          doFlush: false
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('1.0.0')
            expect(chunk).not.toContain('2.0.0')
          } else {
            expect(chunk).toContain('0.1.4')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should not flush when it is the only potential release', async () => {
        const upstream = throughObj()

        upstream.write({
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'No backward compatibility.'
          }],
          references: [],
          committerDate: '2015-04-07 14:17:05 +1000'
        })
        upstream.end()

        // eslint-disable-next-line no-unreachable-loop
        for await (const chunk of upstream.pipe(conventionalChangelogWriter({
          version: 'v2.0.0'
        }, {
          doFlush: false
        }))) {
          chunk.toString()
          throw new Error('should not flush when it is the only potential release')
        }
      })
    })

    describe('when commits are reversed', () => {
      it('should generate on `\'version\'` if it\'s a valid semver', async () => {
        let i = 0
        const commits = [
          {
            header: 'feat(scope): broadcast $destroy event on scope destruction',
            body: null,
            footer: null,
            notes: [],
            references: [],
            version: '1.0.1',
            committerDate: '2015-04-07 14:17:05 +1000'
          },
          {
            header: 'fix(ng-list): Allow custom separator',
            body: 'bla bla bla',
            footer: null,
            notes: [],
            references: [],
            version: '2.0.1',
            committerDate: '2015-04-07 15:00:44 +1000'
          },
          {
            header: 'perf(template): tweak',
            body: 'My body.',
            footer: null,
            notes: [],
            references: [],
            committerDate: '2015-04-07 15:01:30 +1000'
          },
          {
            header: 'refactor(name): rename this module to conventional-changelog-writer',
            body: null,
            footer: null,
            notes: [],
            references: [],
            version: '4.0.1',
            committerDate: '2015-04-08 09:43:59 +1000'
          }
        ]
        const upstream = throughObj()

        for (const commit of commits) {
          upstream.push(commit)
        }

        upstream.end()

        const changelog = await parseArray(commits, {}, {
          reverse: true
        })

        expect(changelog.trim()).toBe(dedent(`## <small>1.0.1 (2015-04-07)</small>

        * feat(scope): broadcast $destroy event on scope destruction



        ## <small>2.0.1 (2015-04-07)</small>

        * fix(ng-list): Allow custom separator



        ## <small>4.0.1 (2015-04-07)</small>

        * perf(template): tweak
        * refactor(name): rename this module to conventional-changelog-writer



        ##  (xxxx-xx-xx)`).replace('xxxx-xx-xx', todayUtc))

        for await (let chunk of upstream.pipe(conventionalChangelogWriter({}, {
          reverse: true
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('## <small>1.0.1 (2015-04-07)</small>')
            expect(chunk).toContain('feat(scope): ')

            expect(chunk).not.toContain('perf(template): ')
            expect(chunk).not.toContain('refactor(name): ')
          } else if (i === 1) {
            expect(chunk).toContain('## <small>2.0.1 (2015-04-07)</small>')
            expect(chunk).toContain('fix(ng-list): ')

            expect(chunk).not.toContain('feat(scope): ')
          } else if (i === 2) {
            expect(chunk).toContain('#')
            expect(chunk).toContain('perf(template): ')
            expect(chunk).toContain('refactor(name): ')
          } else if (i === 3) {
            expect(chunk).toContain('##  (' + todayUtc)
          }

          i++
        }

        expect(i).toBe(4)
      })

      it('should still generate a block even if the commit is ignored', async () => {
        let i = 0

        for await (let chunk of getStream().pipe(conventionalChangelogWriter({}, {
          transform () {
            return false
          },
          reverse: true
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toBe('## <small>1.0.1 (2015-04-07 15:00:44 +1000)</small>\n\n\n\n\n')
          } else {
            expect(chunk).toBe('##  (' + todayUtc + ')\n\n\n\n\n')
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should generated date from timeZone of the option', async () => {
        let i = 0

        for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
          timeZone: 'America/New_York',
          transform () {
            return false
          }
        }))) {
          if (i === 0) {
            expect(chunk).toBe('##  (' + getTodayDate('America/New_York') + ')\n\n\n\n\n')
          }
          i++
        }

        expect(i).toBe(2)
      })

      it('should include details', async () => {
        let i = 0

        for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
          reverse: true,
          includeDetails: true
        }))) {
          if (i === 0) {
            expect(chunk.log).toContain('## <small>1.0.1 (2015-04-07)</small>\n\n')
            expect(chunk.log).toContain('broadcast $destroy event on scope destruction')
            expect(chunk.log).toContain('fix(ng-list):')
            expect(chunk.keyCommit.version).toBe('1.0.1')
            expect(chunk.keyCommit.committerDate).toBe('2015-04-07')
          } else {
            expect(chunk.log).toContain('##  (' + todayUtc + ')\n\n')
            expect(chunk.log).toContain('perf(template): tweak')
            expect(chunk.log).toContain('refactor(name): rename this module to conventional-changelog-writer')
            expect(chunk.keyCommit).toBe()
          }

          i++
        }

        expect(i).toBe(2)
      })

      it('should not flush when previous release is generated', async () => {
        let i = 0

        const upstream = throughObj()

        upstream.write({
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'No backward compatibility.'
          }],
          references: [],
          committerDate: '2015-04-07 14:17:05 +1000',
          version: 'v1.0.0'
        })
        upstream.write({
          header: 'feat(scope): broadcast $destroy event on scope destruction',
          body: null,
          footer: null,
          notes: [{
            title: 'BREAKING CHANGE',
            text: 'No backward compatibility.'
          }],
          references: [],
          committerDate: '2015-04-07 14:17:05 +1000',
          version: 'v2.0.290'
        })
        upstream.end()

        for await (let chunk of upstream.pipe(conventionalChangelogWriter({
          version: 'v2.0.0'
        }, {
          reverse: true,
          doFlush: false
        }))) {
          chunk = chunk.toString()

          if (i === 0) {
            expect(chunk).toContain('1.0.0')
            expect(chunk).not.toContain('2.0.0')
          } else {
            expect(chunk).toContain('2.0.290')
          }

          i++
        }

        expect(i).toBe(2)
      })
    })

    it('should not flush when it is the only potential release', async () => {
      const upstream = throughObj()

      upstream.write({
        header: 'feat(scope): broadcast $destroy event on scope destruction',
        body: null,
        footer: null,
        notes: [{
          title: 'BREAKING CHANGE',
          text: 'No backward compatibility.'
        }],
        references: [],
        committerDate: '2015-04-07 14:17:05 +1000'
      })
      upstream.end()

      // eslint-disable-next-line no-unreachable-loop
      for await (const chunk of upstream.pipe(conventionalChangelogWriter({
        version: 'v2.0.0'
      }, {
        reverse: true,
        doFlush: false
      }))) {
        chunk.toString()
        throw new Error('should not flush when it is the only potential release')
      }
    })
  })

  it('should ignore the field if it doesn\'t exist', async () => {
    let i = 0
    const upstream = throughObj()

    upstream.write({
      header: 'bla',
      body: null,
      footer: null,
      notes: []
    })
    upstream.end()

    for await (const chunk of upstream.pipe(conventionalChangelogWriter())) {
      expect(chunk.toString()).toBe('##  (' + todayUtc + ')\n\n* bla\n\n\n\n')
      i++
    }

    expect(i).toBe(1)
  })

  it('should sort notes on `text` by default', async () => {
    const upstream = throughObj()

    upstream.write({
      header: 'feat(scope): broadcast $destroy event on scope destruction',
      body: null,
      footer: null,
      notes: [{
        title: 'BREAKING CHANGE',
        text: 'No backward compatibility.'
      }],
      references: [],
      committerDate: '2015-04-07 14:17:05 +1000'
    })
    upstream.write({
      header: 'fix(ng-list): Allow custom separator',
      body: 'bla bla bla',
      footer: null,
      notes: [{
        title: 'BREAKING CHANGE',
        text: 'Another change.'
      }, {
        title: 'BREAKING CHANGE',
        text: 'Some breaking change.'
      }],
      references: [],
      committerDate: '2015-04-07 15:00:44 +1000'
    })
    upstream.end()

    for await (const chunk of upstream.pipe(conventionalChangelogWriter())) {
      expect(chunk.toString()).toMatch(/Another change.[\w\W]*No backward compatibility.[\w\W]*Some breaking change./)
    }
  })

  it('should not error if version is not semver', async () => {
    for await (const chunk of getStream().pipe(conventionalChangelogWriter({
      version: 'a.b.c'
    }))) {
      expect(chunk.toString()).toContain('a.b.c')
    }
  })

  it('should callback with error on transform', async () => {
    await expect(async () => {
      for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
        transform () {
          return undefined.a
        }
      }))) {
        chunk.toString()
      }
    }).rejects.toThrow()
  })

  it('should callback with error on flush', async () => {
    await expect(async () => {
      for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
        finalizeContext () {
          return undefined.a
        }
      }))) {
        chunk.toString()
      }
    }).rejects.toThrow()
  })

  it('should show your final context', async () => {
    let context = null

    for await (const chunk of getStream().pipe(conventionalChangelogWriter({}, {
      debug (message) {
        context = message
      }
    }))) {
      chunk.toString()
    }

    expect(context).toContain('Your final context is:\n')
  })
})
