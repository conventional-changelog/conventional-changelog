import dedent from 'dedent'
import { describe, it, expect } from 'vitest'
import dateformat from 'dateformat'
import {
  through,
  throughObj
} from '../../../tools/test-tools'
import conventionalChangelogWriter from '../'

const today = dateformat(new Date(), 'yyyy-mm-dd', true)
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
      await new Promise((resolve, reject) => {
        upstream
          .pipe(conventionalChangelogWriter())
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).toEqual('##  (' + today + ')\n\n\n\n\n')

            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
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
      const changelog = conventionalChangelogWriter.parseArray(commits, context)
      expect(changelog).toContain('https://github.com/a/b/commits/13f3160')
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter(context))
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).toContain('https://github.com/a/b/commits/13f3160')
            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
    })

    it('should auto link if `context.repoUrl`, `context.commit` and `context.issue` are truthy', async () => {
      let i = 0
      const context = {
        version: '0.5.0',
        title: 'this is a title',
        repoUrl: 'https://github.com/a/b'
      }
      const changelog = conventionalChangelogWriter.parseArray(commits, context)
      expect(changelog).toContain('https://github.com/a/b/commits/13f3160')
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter(context))
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).toContain('https://github.com/a/b/commits/13f3160')
            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
    })

    it('should not auto link', async () => {
      let i = 0
      const changelog = conventionalChangelogWriter.parseArray(commits, {})
      expect(changelog).not.toContain('https://github.com/a/b/commits/13f3160')
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter())
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).not.toContain('https://github.com/a/b/commits/13f3160')
            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
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
      const changelog = conventionalChangelogWriter.parseArray(commits, context)
      expect(changelog).not.toContain('https://github.com/a/b/commits/13f3160')
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter(context))
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).not.toContain('https://github.com/a/b/commits/13f3160')
            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
    })
  })

  describe('transform', () => {
    it('should transform the commit with context', async () => {
      let i = 0
      let called = false
      conventionalChangelogWriter.parseArray(commits, {}, {
        transform: (commit, context) => {
          expect(context).toEqual({
            commit: 'commits',
            issue: 'issues',
            date: today
          })
          called = true
          return commit
        }
      })
      expect(called).toEqual(true)
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter({}, {
            transform: (commit, context) => {
              expect(context).toEqual({
                commit: 'commits',
                issue: 'issues',
                date: today
              })

              return commit
            }
          }))
          .pipe(through((chunk, enc, cb) => {
            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
    })

    it('should leave the original commits objects unchanged', () => {
      expect(commits[1].notes[0].title).toEqual('BREAKING CHANGE')
      conventionalChangelogWriter.parseArray(commits, {}, {
        transform: {
          notes: (notes) => {
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
      expect(commits[1].notes[0].title).toEqual('BREAKING CHANGE')
    })

    it('should merge with the provided transform object', async () => {
      let i = 0
      const changelog = conventionalChangelogWriter.parseArray(commits, {}, {
        transform: {
          notes: (notes) => {
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
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter({}, {
            transform: {
              notes: (notes) => {
                notes.map((note) => {
                  if (note.title === 'BREAKING CHANGE') {
                    note.title = 'BREAKING CHANGES'
                  }

                  return note
                })

                return notes
              }
            }
          }))
          .pipe(through((chunk, enc, cb) => {
            chunk = chunk.toString()

            expect(chunk).toContain('13f3160')
            expect(chunk).toContain('BREAKING CHANGES')
            expect(chunk).not.toContain('13f31602f396bc269076ab4d389cfd8ca94b20ba')

            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
    })

    it('should ignore the commit if tranform returns `null`', async () => {
      let i = 0
      const changelog = conventionalChangelogWriter.parseArray(commits, {}, {
        transform: () => {
          return false
        }
      })
      expect(changelog).toEqual('##  (' + today + ')\n\n\n\n\n')
      await new Promise((resolve, reject) => {
        getStream()
          .pipe(conventionalChangelogWriter({}, {
            transform: () => {
              return false
            }
          }))
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).toEqual('##  (' + today + ')\n\n\n\n\n')

            i++
            cb(null)
          }, () => {
            expect(i).toEqual(1)
            resolve()
          }))
          .on('error', reject)
      })
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
      const changelog = conventionalChangelogWriter.parseArray(commits, {
        version: '1.0.0'
      }, {
        transform: (commit) => {
          commit.version = '1.0.0'
          return commit
        }
      })
      expect(changelog).toContain('# 1.0.0 ')
      await new Promise((resolve) => {
        getStream()
          .pipe(conventionalChangelogWriter({
            version: '1.0.0'
          }, {
            transform: (commit) => {
              commit.version = '1.0.0'
              return commit
            }
          }))
          .pipe(through((chunk, enc, cb) => {
            expect(chunk.toString()).toContain('# 1.0.0 ')

            i++
            cb(null)
          }, () => {
            expect(i).toEqual(5)
            resolve()
          }))
      })
    })

    describe('when commits are not reversed', () => {
      it('should generate on `\'version\'` if it\'s a valid semver', () => {
        return new Promise((resolve) => {
          let i = 0
          const changelog = conventionalChangelogWriter.parseArray(commits)
          expect(changelog).toContain('##  (' + today)
          expect(changelog).toContain('feat(scope): ')
          expect(changelog).toContain('## <small>1.0.1 (2015-04-07)</small>')
          expect(changelog).toContain('fix(ng-list): ')
          expect(changelog).toContain('perf(template): ')
          expect(changelog).toContain('refactor(name): ')
          getStream()
            .pipe(conventionalChangelogWriter())
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('##  (' + today)
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
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('`generateOn` could be a string', () => {
        return new Promise((resolve) => {
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

          const changelog = conventionalChangelogWriter.parseArray(commits, {}, {
            generateOn: 'version'
          })
          expect(changelog).toContain('##  (' + today)
          expect(changelog).toContain('feat(scope): broadcast $destroy event on scope destruction')
          expect(changelog).not.toContain('<a name=""></a>')
          expect(changelog).toContain('fix(ng-list): Allow custom separator')
          expect(changelog).toContain('perf(template): tweak')
          expect(changelog).toContain('refactor(name): rename this module to conventional-changelog-writer')
          expect(changelog).toContain('perf(template): tweak')

          upstream
            .pipe(conventionalChangelogWriter({}, {
              generateOn: 'version'
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('##  (' + today)

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
              cb(null)
            }, () => {
              expect(i).toEqual(4)
              resolve()
            }))
        })
      })

      it('`generateOn` could be a function', () => {
        return new Promise((resolve) => {
          let i = 0

          getStream()
            .pipe(conventionalChangelogWriter({}, {
              generateOn: (commit, commits, context, options) => {
                expect(commits.length).toBeTypeOf('number')
                expect(context.commit).toEqual('commits')
                expect(options.groupBy).toEqual('type')

                return commit.version
              }
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('##  (' + today)
                expect(chunk).not.toContain('## 1.0.1 (2015-04-07)')
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('`generateOn` could be a null', () => {
        return new Promise((resolve) => {
          let i = 0

          getStream()
            .pipe(conventionalChangelogWriter({}, {
              generateOn: null
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              expect(chunk).toContain('##  (' + today)

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(1)
              resolve()
            }))
        })
      })

      it('version should fall back on `context.version` and `context.date`', () => {
        return new Promise((resolve) => {
          let i = 0

          const changelog = conventionalChangelogWriter.parseArray(commits, {
            version: '0.0.1',
            date: '2015-01-01'
          })
          expect(changelog).toContain('## <small>0.0.1 (2015-01-01)</small>')
          expect(changelog).toContain('## <small>1.0.1 (2015-04-07)</small>')

          getStream()
            .pipe(conventionalChangelogWriter({
              version: '0.0.1',
              date: '2015-01-01'
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('## <small>0.0.1 (2015-01-01)</small>')
              } else {
                expect(chunk).toContain('## <small>1.0.1 (2015-04-07)</small>')
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should still generate a block even if the commit is ignored', () => {
        return new Promise((resolve) => {
          let i = 0

          getStream()
            .pipe(conventionalChangelogWriter({}, {
              transform: () => {
                return false
              }
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toEqual('##  (' + today + ')\n\n\n\n\n')
              } else {
                expect(chunk).toEqual('## <small>1.0.1 (2015-04-07 15:00:44 +1000)</small>\n\n\n\n\n')
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should include details', () => {
        return new Promise((resolve) => {
          let i = 0
          getStream()
            .pipe(conventionalChangelogWriter({}, {
              includeDetails: true
            }))
            .pipe(throughObj((chunk, enc, cb) => {
              if (i === 0) {
                expect(chunk.log).toContain('##  (' + today + ')\n\n')
                expect(chunk.log).toContain('feat(scope): broadcast $destroy event on scope destruction')
                expect(chunk.keyCommit).toEqual()
              } else {
                expect(chunk.log).toContain('## <small>1.0.1 (2015-04-07)</small>\n\n')
                expect(chunk.log).toContain('fix(ng-list): Allow custom separator')
                expect(chunk.log).toContain('perf(template): tweak')
                expect(chunk.log).toContain('refactor(name): rename this module to conventional-changelog-writer')
                expect(chunk.keyCommit.body).toEqual('bla bla bla')
                expect(chunk.keyCommit.committerDate).toEqual('2015-04-07')
                expect(chunk.keyCommit.version).toEqual('1.0.1')
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should not flush when previous release is generated', () => {
        return new Promise((resolve) => {
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

          upstream
            .pipe(conventionalChangelogWriter({
              version: 'v2.0.0'
            }, {
              doFlush: false
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('1.0.0')
                expect(chunk).not.toContain('2.0.0')
              } else {
                expect(chunk).toContain('0.1.4')
              }

              i++
              cb()
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should not flush when it is the only potential release', () => {
        return new Promise((resolve, reject) => {
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

          upstream
            .pipe(conventionalChangelogWriter({
              version: 'v2.0.0'
            }, {
              doFlush: false
            }))
            .pipe(through(() => {
              reject(new Error('should not flush when it is the only potential release'))
            }, () => {
              resolve()
            }))
        })
      })
    })

    describe('when commits are reversed', () => {
      it('should generate on `\'version\'` if it\'s a valid semver', () => {
        return new Promise((resolve) => {
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
          const changelog = conventionalChangelogWriter.parseArray(commits, {}, {
            reverse: true
          })
          expect(changelog.trim()).toEqual(dedent(`## <small>1.0.1 (2015-04-07)</small>

          * feat(scope): broadcast $destroy event on scope destruction



          ## <small>2.0.1 (2015-04-07)</small>

          * fix(ng-list): Allow custom separator



          ## <small>4.0.1 (2015-04-07)</small>

          * perf(template): tweak
          * refactor(name): rename this module to conventional-changelog-writer



          ##  (xxxx-xx-xx)`).replace('xxxx-xx-xx', today))
          upstream
            .pipe(conventionalChangelogWriter({}, {
              reverse: true
            }))
            .pipe(through((chunk, enc, cb) => {
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
                expect(chunk).toContain('##  (' + today)
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(4)
              resolve()
            }))
        })
      })

      it('should still generate a block even if the commit is ignored', () => {
        return new Promise((resolve) => {
          let i = 0

          getStream()
            .pipe(conventionalChangelogWriter({}, {
              transform: () => {
                return false
              },
              reverse: true
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toEqual('## <small>1.0.1 (2015-04-07 15:00:44 +1000)</small>\n\n\n\n\n')
              } else {
                expect(chunk).toEqual('##  (' + today + ')\n\n\n\n\n')
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should include details', () => {
        return new Promise((resolve) => {
          let i = 0

          getStream()
            .pipe(conventionalChangelogWriter({}, {
              reverse: true,
              includeDetails: true
            }))
            .pipe(throughObj((chunk, enc, cb) => {
              if (i === 0) {
                expect(chunk.log).toContain('## <small>1.0.1 (2015-04-07)</small>\n\n')
                expect(chunk.log).toContain('broadcast $destroy event on scope destruction')
                expect(chunk.log).toContain('fix(ng-list):')
                expect(chunk.keyCommit.version).toEqual('1.0.1')
                expect(chunk.keyCommit.committerDate).toEqual('2015-04-07')
              } else {
                expect(chunk.log).toContain('##  (' + today + ')\n\n')
                expect(chunk.log).toContain('perf(template): tweak')
                expect(chunk.log).toContain('refactor(name): rename this module to conventional-changelog-writer')
                expect(chunk.keyCommit).toEqual()
              }

              i++
              cb(null)
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })

      it('should not flush when previous release is generated', () => {
        return new Promise((resolve) => {
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

          upstream
            .pipe(conventionalChangelogWriter({
              version: 'v2.0.0'
            }, {
              reverse: true,
              doFlush: false
            }))
            .pipe(through((chunk, enc, cb) => {
              chunk = chunk.toString()

              if (i === 0) {
                expect(chunk).toContain('1.0.0')
                expect(chunk).not.toContain('2.0.0')
              } else {
                expect(chunk).toContain('2.0.290')
              }

              i++
              cb()
            }, () => {
              expect(i).toEqual(2)
              resolve()
            }))
        })
      })
    })

    it('should not flush when it is the only potential release', () => {
      return new Promise((resolve, reject) => {
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

        upstream
          .pipe(conventionalChangelogWriter({
            version: 'v2.0.0'
          }, {
            reverse: true,
            doFlush: false
          }))
          .pipe(through(() => {
            reject(new Error('should not flush when it is the only potential release'))
          }, () => {
            resolve()
          }))
      })
    })
  })

  it('should ignore the field if it doesn\'t exist', () => {
    return new Promise((resolve) => {
      let i = 0

      const upstream = throughObj()
      upstream.write({
        header: 'bla',
        body: null,
        footer: null,
        notes: []
      })
      upstream.end()
      upstream
        .pipe(conventionalChangelogWriter())
        .pipe(through((chunk, enc, cb) => {
          expect(chunk.toString()).toEqual('##  (' + today + ')\n\n* bla\n\n\n\n')

          i++
          cb(null)
        }, () => {
          expect(i).toEqual(1)
          resolve()
        }))
    })
  })

  it('should sort notes on `text` by default', () => {
    return new Promise((resolve) => {
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

      upstream
        .pipe(conventionalChangelogWriter())
        .pipe(through((chunk) => {
          expect(chunk.toString()).toMatch(/Another change.[\w\W]*No backward compatibility.[\w\W]*Some breaking change./)

          resolve()
        }))
    })
  })

  it('should not error if version is not semver', () => {
    return new Promise((resolve, reject) => {
      getStream()
        .pipe(conventionalChangelogWriter({
          version: 'a.b.c'
        }))
        .on('error', (err) => {
          reject(err)
        })
        .pipe(through((chunk) => {
          expect(chunk.toString()).toContain('a.b.c')

          resolve()
        }))
    })
  })

  it('should callback with error on transform', () => {
    return new Promise((resolve) => {
      getStream()
        .pipe(conventionalChangelogWriter({}, {
          transform: () => {
            return undefined.a
          }
        }))
        .on('error', (err) => {
          expect(err).toBeTruthy()
          resolve()
        })
    })
  })

  it('should callback with error on flush', () => {
    return new Promise((resolve) => {
      getStream()
        .pipe(conventionalChangelogWriter({}, {
          finalizeContext: () => {
            return undefined.a
          }
        }))
        .on('error', (err) => {
          expect(err).toBeTruthy()
          resolve()
        })
    })
  })

  it('should show your final context', () => {
    return new Promise((resolve) => {
      getStream()
        .pipe(conventionalChangelogWriter({}, {
          debug: (context) => {
            expect(context).toContain('Your final context is:\n')
            resolve()
          }
        }))
    })
  })
})
