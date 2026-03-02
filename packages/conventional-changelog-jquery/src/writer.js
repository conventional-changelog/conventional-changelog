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
const headerPartial = `{{#if isPatch~}}
  ##
{{~else~}}
  #
{{~/if}} {{#if @root.linkCompare~}}
  [{{version}}]({{@root.host}}/
  {{~#if @root.owner}}
    {{~@root.owner}}/
  {{~/if}}
  {{~@root.repository}}/compare/{{previousTag}}...{{currentTag}})
{{~else}}
  {{~version}}
{{~/if}}
{{~#if title}} "{{title}}"
{{~/if}}
{{~#if date}} ({{date}})
{{/if}}
`
const commitPartial = `* {{#if shortDesc}}
  {{~shortDesc}}
{{~else}}
  {{~header}}
{{~/if}}

{{~!-- commit link --}}
{{~#if @root.linkReferences~}}
  ([{{shortHash}}](
  {{~#if @root.host}}
    {{~@root.host}}/
  {{~/if}}
  {{~#if @root.owner}}
    {{~@root.owner}}/
  {{~/if}}
  {{~@root.repository}}/{{@root.commit}}/{{hash}}))
{{~else}}
  {{~shortHash}}
{{~/if}}

{{~!-- commit references --}}
{{~#if references~}}
  , closes
  {{~#each references}} {{#if @root.linkReferences}}[
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}](
    {{~#if this.originalIssueTracker}}
      {{~this.originalIssueTracker}}
    {{~else}}
      {{~#if @root.host}}
        {{~@root.host}}/
      {{~/if}}
      {{~#if this.repository}}
        {{~#if this.owner}}
          {{~this.owner}}/
        {{~/if}}
        {{~this.repository}}
      {{~else}}
        {{~#if @root.owner}}
          {{~@root.owner}}/
        {{~/if}}
        {{~@root.repository}}
      {{~/if~}}
      /{{@root.issue}}/
    {{~/if}}
    {{~this.issue}})
  {{~else}}
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}
  {{~/if}}{{/each}}
{{~/if}}

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
      if (!commit.component || typeof commit.component !== 'string') {
        return undefined
      }

      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const references = commit.references.map(reference => ({
        ...reference,
        originalIssueTracker: reference.prefix === '#'
          ? 'https://bugs.jquery.com/ticket/'
          : reference.originalIssueTracker
      }))

      return {
        shortHash,
        references
      }
    },
    groupBy: 'component',
    commitGroupsSort: 'title',
    commitsSort: ['component', 'shortDesc']
  }
}
