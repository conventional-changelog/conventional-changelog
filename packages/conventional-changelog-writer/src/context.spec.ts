import { describe, it, expect } from 'vitest'
import {
  getCommitGroups,
  getNoteGroups,
  getExtraContext
} from './context.js'

describe('conventional-changelog-writer', () => {
  describe('context', () => {
    describe('getCommitGroups', () => {
      const commits = [
        {
          groupBy: 'A',
          content: 'this is A',
          notes: []
        },
        {
          groupBy: 'A',
          content: 'this is another A',
          notes: []
        },
        {
          groupBy: 'Big B',
          content: 'this is B and its a bit longer',
          notes: []
        }
      ]

      it('should group but not sort groups', () => {
        const commitGroups = getCommitGroups(commits, {
          groupBy: 'groupBy'
        })

        expect(commitGroups).toEqual([
          {
            title: 'A',
            commits: [
              {
                groupBy: 'A',
                content: 'this is A',
                notes: []
              },
              {
                groupBy: 'A',
                content: 'this is another A',
                notes: []
              }
            ]
          },
          {
            title: 'Big B',
            commits: [
              {
                groupBy: 'Big B',
                content: 'this is B and its a bit longer',
                notes: []
              }
            ]
          }
        ])
      })

      it('should group if `groupBy` is undefined', () => {
        const commits = [
          {
            content: 'this is A',
            notes: []
          },
          {
            content: 'this is another A',
            notes: []
          },
          {
            groupBy: 'Big B',
            content: 'this is B and its a bit longer',
            notes: []
          }
        ]
        const commitGroups = getCommitGroups(commits, {
          groupBy: 'groupBy'
        })

        expect(commitGroups).toEqual([
          {
            title: '',
            commits: [
              {
                content: 'this is A',
                notes: []
              },
              {
                content: 'this is another A',
                notes: []
              }
            ]
          },
          {
            title: 'Big B',
            commits: [
              {
                groupBy: 'Big B',
                content: 'this is B and its a bit longer',
                notes: []
              }
            ]
          }
        ])
      })

      it('should group and sort groups', () => {
        const commitGroups = getCommitGroups(commits, {
          groupBy: 'groupBy',
          commitGroupsSort(a, b) {
            return b.title.length - a.title.length
          }
        })

        expect(commitGroups).toEqual([
          {
            title: 'Big B',
            commits: [
              {
                groupBy: 'Big B',
                content: 'this is B and its a bit longer',
                notes: []
              }
            ]
          },
          {
            title: 'A',
            commits: [
              {
                groupBy: 'A',
                content: 'this is A',
                notes: []
              },
              {
                groupBy: 'A',
                content: 'this is another A',
                notes: []
              }
            ]
          }
        ])
      })

      it('should group and but not sort commits', () => {
        const commitGroups = getCommitGroups(commits, {
          groupBy: 'groupBy'
        })

        expect(commitGroups).toEqual([
          {
            title: 'A',
            commits: [
              {
                groupBy: 'A',
                content: 'this is A',
                notes: []
              },
              {
                groupBy: 'A',
                content: 'this is another A',
                notes: []
              }
            ]
          },
          {
            title: 'Big B',
            commits: [
              {
                groupBy: 'Big B',
                content: 'this is B and its a bit longer',
                notes: []
              }
            ]
          }
        ])
      })

      it('should group and sort commits', () => {
        const commitGroups = getCommitGroups(commits, {
          groupBy: 'groupBy',
          commitsSort(a, b) {
            return b.content.length - a.content.length
          }
        })

        expect(commitGroups).toEqual([
          {
            title: 'A',
            commits: [
              {
                groupBy: 'A',
                content: 'this is another A',
                notes: []
              },
              {
                groupBy: 'A',
                content: 'this is A',
                notes: []
              }
            ]
          },
          {
            title: 'Big B',
            commits: [
              {
                groupBy: 'Big B',
                content: 'this is B and its a bit longer',
                notes: []
              }
            ]
          }
        ])
      })
    })

    describe('getNoteGroups', () => {
      const notes = [
        {
          title: 'A title',
          text: 'this is A and its a bit longer'
        },
        {
          title: 'B+',
          text: 'this is B'
        },
        {
          title: 'C',
          text: 'this is C'
        },
        {
          title: 'A title',
          text: 'this is another A'
        },
        {
          title: 'B+',
          text: 'this is another B'
        }
      ]

      it('should group', () => {
        const noteGroups = getNoteGroups(notes, {})

        expect(noteGroups).toEqual([
          {
            title: 'A title',
            notes: [
              {
                title: 'A title',
                text: 'this is A and its a bit longer'
              },
              {
                title: 'A title',
                text: 'this is another A'
              }
            ]
          },
          {
            title: 'B+',
            notes: [
              {
                title: 'B+',
                text: 'this is B'
              },
              {
                title: 'B+',
                text: 'this is another B'
              }
            ]
          },
          {
            title: 'C',
            notes: [
              {
                title: 'C',
                text: 'this is C'
              }
            ]
          }
        ])
      })

      it('should group and sort groups', () => {
        const noteGroups = getNoteGroups(notes, {
          noteGroupsSort(a, b) {
            return a.title.length - b.title.length
          }
        })

        expect(noteGroups).toEqual([
          {
            title: 'C',
            notes: [
              {
                title: 'C',
                text: 'this is C'
              }
            ]
          },
          {
            title: 'B+',
            notes: [
              {
                title: 'B+',
                text: 'this is B'
              },
              {
                title: 'B+',
                text: 'this is another B'
              }
            ]
          },
          {
            title: 'A title',
            notes: [
              {
                title: 'A title',
                text: 'this is A and its a bit longer'
              },
              {
                title: 'A title',
                text: 'this is another A'
              }
            ]
          }
        ])
      })

      it('should group and sort notes', () => {
        const noteGroups = getNoteGroups(notes, {
          notesSort(a, b) {
            return b.text.length - a.text.length
          }
        })

        expect(noteGroups).toEqual([
          {
            title: 'A title',
            notes: [
              {
                title: 'A title',
                text: 'this is A and its a bit longer'
              },
              {
                title: 'A title',
                text: 'this is another A'
              }
            ]
          },
          {
            title: 'B+',
            notes: [
              {
                title: 'B+',
                text: 'this is another B'
              },
              {
                title: 'B+',
                text: 'this is B'
              }
            ]
          },
          {
            title: 'C',
            notes: [
              {
                title: 'C',
                text: 'this is C'
              }
            ]
          }
        ])
      })

      it('should work if title does not exist', () => {
        const notes = [
          {
            title: '',
            text: 'this is A and its a bit longer'
          },
          {
            title: 'B+',
            text: 'this is B'
          },
          {
            title: '',
            text: 'this is another A'
          },
          {
            title: 'B+',
            text: 'this is another B'
          }
        ]
        const noteGroups = getNoteGroups(notes, {})

        expect(noteGroups).toEqual([
          {
            title: '',
            notes: [
              {
                title: '',
                text: 'this is A and its a bit longer'
              },
              {
                title: '',
                text: 'this is another A'
              }
            ]
          },
          {
            title: 'B+',
            notes: [
              {
                title: 'B+',
                text: 'this is B'
              },
              {
                title: 'B+',
                text: 'this is another B'
              }
            ]
          }
        ])
      })
    })

    describe('getExtraContext', () => {
      const commits = [
        {
          content: 'this is A',
          notes: []
        },
        {
          content: 'this is another A',
          notes: []
        },
        {
          groupBy: 'Big B',
          content: 'this is B and its a bit longer',
          notes: []
        }
      ]
      const notes = [
        {
          title: 'A',
          text: 'this is A and its a bit longer'
        },
        {
          title: 'B',
          text: 'this is B'
        },
        {
          title: 'A',
          text: 'this is another A'
        },
        {
          title: 'B',
          text: 'this is another B'
        }
      ]

      it('should process context without `options.groupBy`', () => {
        const extra = getExtraContext(commits, notes, {} as any)

        expect(extra).toEqual({
          commitGroups: [
            {
              title: '',
              commits: [
                {
                  content: 'this is A',
                  notes: []
                },
                {
                  content: 'this is another A',
                  notes: []
                },
                {
                  content: 'this is B and its a bit longer',
                  groupBy: 'Big B',
                  notes: []
                }
              ]
            }
          ],
          noteGroups: [
            {
              title: 'A',
              notes: [
                {
                  title: 'A',
                  text: 'this is A and its a bit longer'
                },
                {
                  title: 'A',
                  text: 'this is another A'
                }
              ]
            },
            {
              title: 'B',
              notes: [
                {
                  title: 'B',
                  text: 'this is B'
                },
                {
                  title: 'B',
                  text: 'this is another B'
                }
              ]
            }
          ]
        })
      })

      it('should process context with `options.groupBy` found', () => {
        const extra = getExtraContext(commits, notes, {
          groupBy: 'groupBy'
        })

        expect(extra).toEqual({
          commitGroups: [
            {
              title: '',
              commits: [
                {
                  content: 'this is A',
                  notes: []
                },
                {
                  content: 'this is another A',
                  notes: []
                }
              ]
            },
            {
              title: 'Big B',
              commits: [
                {
                  content: 'this is B and its a bit longer',
                  groupBy: 'Big B',
                  notes: []
                }
              ]
            }
          ],
          noteGroups: [
            {
              title: 'A',
              notes: [
                {
                  title: 'A',
                  text: 'this is A and its a bit longer'
                },
                {
                  title: 'A',
                  text: 'this is another A'
                }
              ]
            },
            {
              title: 'B',
              notes: [
                {
                  title: 'B',
                  text: 'this is B'
                },
                {
                  title: 'B',
                  text: 'this is another B'
                }
              ]
            }
          ]
        })
      })

      it('should process context with `options.groupBy` not found', () => {
        const extra = getExtraContext(commits, notes, {
          groupBy: 'what?' as any
        })

        expect(extra).toEqual({
          commitGroups: [
            {
              title: '',
              commits: [
                {
                  content: 'this is A',
                  notes: []
                },
                {
                  content: 'this is another A',
                  notes: []
                },
                {
                  content: 'this is B and its a bit longer',
                  groupBy: 'Big B',
                  notes: []
                }
              ]
            }
          ],
          noteGroups: [
            {
              title: 'A',
              notes: [
                {
                  title: 'A',
                  text: 'this is A and its a bit longer'
                },
                {
                  title: 'A',
                  text: 'this is another A'
                }
              ]
            },
            {
              title: 'B',
              notes: [
                {
                  title: 'B',
                  text: 'this is B'
                },
                {
                  title: 'B',
                  text: 'this is another B'
                }
              ]
            }
          ]
        })
      })
    })
  })
})
