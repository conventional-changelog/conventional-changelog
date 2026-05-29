export const mainTemplate = `{{> header}}
{{#if noteGroups}}
{{#each noteGroups}}

### ⚠ {{title}}

{{#each notes}}
* {{#if commit.scope}}**{{commit.scope}}:** {{/if}}{{text}}
{{/each}}
{{/each}}
{{/if}}
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

export const headerPartial = `## {{#if @root.linkCompare~}}
  [{{version}}]({{compareUrlFormat}})
{{~else}}
  {{~version}}
{{~/if}}
{{~#if title}} "{{title}}"
{{~/if}}
{{~#if date}} ({{date}})
{{/if}}
`

export const commitPartial = `*{{#if scope}} **{{scope}}:**
{{~/if}} {{#if subject}}
  {{~subject}}
{{~else}}
  {{~header}}
{{~/if}}

{{~!-- commit link --}}{{~#if hash}} {{#if @root.linkReferences~}}
  ([{{shortHash}}]({{commitUrlFormat}}))
{{~else}}
  {{~shortHash}}
{{~/if}}{{~/if}}

{{~!-- commit references --}}
{{~#if closingReferences~}}
  , closes
  {{~#each closingReferences}} {{> reference}}{{/each}}
{{~/if}}
{{~#if otherReferences~}}
  , refs
  {{~#each otherReferences}} {{> reference}}{{/each}}
{{~/if}}

`

export const referencePartial = `{{#if @root.linkReferences~}}
  [
  {{~#if this.owner}}
    {{~this.owner}}/
  {{~/if}}
  {{~this.repository}}{{this.prefix}}{{this.issue}}]({{issueUrlFormat}})
{{~else}}
  {{~#if this.owner}}
    {{~this.owner}}/
  {{~/if}}
  {{~this.repository}}{{this.prefix}}{{this.issue}}
{{~/if}}`

export const footerPartial = ``
