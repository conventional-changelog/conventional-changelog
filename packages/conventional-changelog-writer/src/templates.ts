export const mainTemplate = `{{> header}}

{{#each commitGroups}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}
{{/each}}
{{> footer}}
`
export const headerPartial = `## {{#if isPatch~}} <small>
  {{~/if~}} {{version}}
  {{~#if title}} "{{title}}"
  {{~/if~}}
  {{~#if date}} ({{date}})
  {{~/if~}}
  {{~#if isPatch~}} </small>
  {{~/if}}

`
export const commitPartial = `* {{header}}

{{~!-- commit link --}}
{{~#if @root.linkReferences}} ([{{hash}}](
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
{{~else if hash}} {{hash}}{{~/if}}

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
export const footerPartial = `{{#if noteGroups}}
{{#each noteGroups}}

### {{title}}

{{#each notes}}
* {{text}}
{{/each}}
{{/each}}
{{/if}}
`
