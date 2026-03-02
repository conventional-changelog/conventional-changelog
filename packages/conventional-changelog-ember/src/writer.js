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



`
const headerPartial = `{{#if isPatch}}##{{else}}#{{/if}} {{#if @root.linkCompare}}[{{version}}]({{@root.host}}/{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/compare/{{previousTag}}...{{currentTag}}){{else}}{{version}}{{/if}}{{#if title}} "{{title}}"{{/if}}{{#if date}} ({{date}}){{/if}}
`
const commitPartial = `{{!-- pr reference --}}- {{#if pr}}[{{pr}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/pull/{{pr}}){{/if}}

{{~!-- message --}} **{{taggedAs}}** {{message}}
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
      if (!commit.pr) {
        return undefined
      }

      let { tag } = commit

      if (commit.tag === 'BUGFIX') {
        tag = 'Bug Fixes'
      } else if (commit.tag === 'CLEANUP') {
        tag = 'Cleanup'
      } else if (commit.tag === 'FEATURE') {
        tag = 'Features'
      } else if (commit.tag === 'DOC') {
        tag = 'Documentation'
      } else if (commit.tag === 'SECURITY') {
        tag = 'Security'
      } else {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash

      return {
        tag,
        shortHash
      }
    },
    groupBy: 'tag',
    commitGroupsSort: 'title',
    commitsSort: [
      'tag',
      'taggedAs',
      'message'
    ]
  }
}
