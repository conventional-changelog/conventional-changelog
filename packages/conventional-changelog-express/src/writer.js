const mainTemplate = `{{> header}}

{{#each commitGroups}}

{{#if title}}
### {{title}}

{{/if}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}

{{/each}}



`
const headerPartial = `{{#if version}}{{#if @root.linkCompare}}[{{version}}]({{@root.host}}/{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/compare/{{previousTag}}...{{currentTag}}){{else}}{{version}}{{/if}} / {{/if}}{{date}}
===================
`
const commitPartial = `* {{#if shortDesc}}{{shortDesc}}{{else}}{{header}}{{/if}}
{{#if body}}

{{body}}

{{/if}}
{{!-- commit references --}}{{#if references}}
  Closes{{~#each references}} {{#if @root.linkReferences}}[{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/{{@root.issue}}/{{this.issue}}){{else}}{{this.repository}}#{{this.issue}}{{/if}}{{/each}}
{{/if}}
`

export function createWriterOpts() {
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = mainTemplate
  writerOpts.headerPartial = headerPartial
  writerOpts.commitPartial = commitPartial

  return writerOpts
}

function getWriterOpts() {
  return {
    transform: (commit) => {
      let { component } = commit

      if (commit.component === 'perf') {
        component = 'Performance'
      } else if (commit.component === 'deps') {
        component = 'Dependencies'
      } else {
        return undefined
      }

      return {
        component
      }
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc']
  }
}
