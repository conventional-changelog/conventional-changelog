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
const headerPartial = `{{#if isPatch~}}
  ##
{{~else~}}
  #
{{~/if}} {{#if @root.linkCompare~}}
  [{{version}}](
  {{~#if @root.repository~}}
    {{~#if @root.host}}
      {{~@root.host}}/
    {{~/if}}
    {{~#if @root.owner}}
      {{~@root.owner}}/
    {{~/if}}
    {{~@root.repository}}
  {{~else}}
    {{~@root.repoUrl}}
  {{~/if~}}
  /compare/{{previousTag}}...{{currentTag}})
{{~else}}
  {{~version}}
{{~/if}}
{{~#if title}} "{{title}}"
{{~/if}}
{{~#if date}} ({{date}})
{{/if}}
`
const commitPartial = `*{{#if scope}} **{{scope}}:**
{{~/if}} {{#if subject}}
  {{~subject}}
{{~else}}
  {{~header}}
{{~/if}}

{{~!-- commit link --}} {{#if @root.linkReferences~}}
  ([{{shortHash}}](
  {{~#if @root.repository}}
    {{~#if @root.host}}
      {{~@root.host}}/
    {{~/if}}
    {{~#if @root.owner}}
      {{~@root.owner}}/
    {{~/if}}
    {{~@root.repository}}
  {{~else}}
    {{~@root.repoUrl}}
  {{~/if}}/
  {{~@root.commit}}/{{hash}}))
{{~else}}
  {{~shortHash}}
{{~/if}}

{{~!-- commit references --}}
{{~#if references~}}
  , closes
  {{~#each references}} {{#if @root.linkReferences~}}
    [
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}#{{this.issue}}](
    {{~#if @root.repository}}
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
        {{~/if}}
    {{~else}}
      {{~@root.repoUrl}}
    {{~/if}}/
    {{~@root.issue}}/{{this.issue}})
  {{~else}}
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}#{{this.issue}}
  {{~/if}}{{/each}}
{{~/if}}

`
const footerPartial = `{{#if noteGroups}}
{{#each noteGroups}}

### {{title}}

{{#each notes}}
* {{#if commit.scope}}**{{commit.scope}}:** {{/if}}{{text}}
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
    transform: (commit, context) => {
      let discard = true
      const notes = commit.notes.map((note) => {
        discard = false

        return {
          ...note,
          title: 'BREAKING CHANGES'
        }
      })
      let { type } = commit

      if (commit.type === 'feat') {
        type = 'Features'
      } else if (commit.type === 'fix') {
        type = 'Bug Fixes'
      } else if (commit.type === 'perf') {
        type = 'Performance Improvements'
      } else if (commit.type === 'revert' || commit.revert) {
        type = 'Reverts'
      } else if (discard) {
        return undefined
      } else if (commit.type === 'docs') {
        type = 'Documentation'
      } else if (commit.type === 'style') {
        type = 'Styles'
      } else if (commit.type === 'refactor') {
        type = 'Code Refactoring'
      } else if (commit.type === 'test') {
        type = 'Tests'
      } else if (commit.type === 'build') {
        type = 'Build System'
      } else if (commit.type === 'ci') {
        type = 'Continuous Integration'
      }

      const scope = commit.scope === '*' ? '' : commit.scope
      const shortHash = typeof commit.hash === 'string'
        ? commit.hash.substring(0, COMMIT_HASH_LENGTH)
        : commit.shortHash
      const issues = []
      let { subject } = commit

      if (typeof subject === 'string') {
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl

        if (url) {
          url = `${url}/issues/`
          // Issue URLs.
          subject = subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            return `[#${issue}](${url}${issue})`
          })
        }

        if (context.host) {
          // User URLs.
          subject = subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`
            }

            return `[@${username}](${context.host}/${username})`
          })
        }
      }

      // remove references that already appear in the subject
      const references = commit.references.filter(reference => !issues.includes(reference.issue))

      return {
        notes,
        type,
        scope,
        shortHash,
        subject,
        references
      }
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}
