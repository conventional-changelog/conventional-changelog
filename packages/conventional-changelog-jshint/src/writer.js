import compareFunc from 'compare-func'

const COMMIT_HASH_LENGTH = 7
const mainTemplate = `{{> header}}

{{#each commitGroups}}

{{#if title}}
### {{title}}

{{/if}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}
{{/each}}
{{> footer}}
`
const headerPartial = `{{#if isPatch}}##{{else}}#{{/if}} {{#if @root.linkCompare}}[{{version}}]({{@root.host}}/{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/compare/{{previousTag}}...{{currentTag}}){{else}}{{version}}{{/if}}{{#if title}} "{{title}}"{{/if}}{{#if date}} ({{date}}){{/if}}
`
const commitPartial = `* {{#if shortDesc}}{{shortDesc}}{{else}}{{header}}{{/if}}

{{~!-- commit hash --}} {{#if @root.linkReferences}}([{{shortHash}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/{{@root.commit}}/{{hash}})){{else}}{{shortHash~}}{{/if}}

{{~!-- commit references --}}{{#if references}}, closes{{~#each references}} {{#if @root.linkReferences}}[{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/{{@root.issue}}/{{this.issue}}){{else}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}{{/if}}{{/each}}{{/if}}
`
const footerPartial = `{{#if noteGroups}}
{{#each noteGroups}}

### {{title}}

{{#each notes}}
* {{#if commit.scope}}{{commit.scope}}: {{/if}}{{text}}
{{/each}}
{{/each}}

{{/if}}
`

export function createWriterOpts() {
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = mainTemplate
  writerOpts.headerPartial = headerPartial
  writerOpts.commitPartial = commitPartial
  writerOpts.footerPartial = footerPartial

  return writerOpts
}

function getWriterOpts() {
  return {
    transform: (commit) => {
      let type = commit.type ? commit.type.toUpperCase() : ''

      if (type === 'FEAT') {
        type = 'Features'
      } else if (type === 'FIX') {
        type = 'Bug Fixes'
      } else {
        return undefined
      }

      const hash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.hash
      const notes = commit.notes.map(note => ({
        ...note,
        title: note.title === 'BREAKING CHANGE'
          ? 'BREAKING CHANGES'
          : note.title
      }))

      return {
        type,
        hash,
        notes
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['type', 'shortDesc'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
