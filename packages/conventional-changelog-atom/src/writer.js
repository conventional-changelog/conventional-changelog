const COMMIT_HASH_LENGTH = 7
const EMOJI_LENGTH = 72
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
const commitPartial = `* {{#if shortDesc}}{{shortDesc}}{{else}}{{header}}{{/if}}

{{~!-- commit hash --}} {{#if @root.linkReferences}}([{{shortHash}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/{{@root.commit}}/{{hash}})){{else}}{{shortHash~}}{{/if}}

{{~!-- commit references --}}{{#if references}}, closes{{~#each references}} {{#if @root.linkReferences}}[{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/{{@root.issue}}/{{this.issue}}){{else}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}#{{this.issue}}{{/if}}{{/each}}{{/if}}
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
      if (!commit.emoji || typeof commit.emoji !== 'string') {
        return undefined
      }

      const emoji = commit.emoji.substring(0, EMOJI_LENGTH)
      const emojiLength = emoji.length
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const shortDesc = typeof commit.shortDesc === 'string'
        ? commit.shortDesc.substring(0, EMOJI_LENGTH - emojiLength)
        : undefined

      return {
        emoji,
        shortHash,
        shortDesc
      }
    },
    groupBy: 'emoji',
    commitGroupsSort: 'title',
    commitsSort: ['emoji', 'shortDesc']
  }
}
