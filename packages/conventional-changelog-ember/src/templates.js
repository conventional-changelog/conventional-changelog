export const mainTemplate = `{{> header}}

{{#each commitGroups}}

{{#if title}}
### {{title}}

{{/if}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}
{{/each}}
`

export const headerPartial = `{{#if isPatch}}##{{else}}#{{/if}} {{#if @root.linkCompare}}[{{version}}]({{@root.host}}/{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}/compare/{{previousTag}}...{{currentTag}}){{else}}{{version}}{{/if}}{{#if title}} "{{title}}"{{/if}}{{#if date}} ({{date}}){{/if}}
`

export const commitPartial = `{{!-- pr reference --}}- {{#if pr}}[{{pr}}]({{#if @root.host}}{{@root.host}}/{{/if}}{{#if this.repository}}{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{else}}{{#if @root.owner}}{{@root.owner}}/{{/if}}{{@root.repository}}{{/if}}/pull/{{pr}}){{/if}}

{{~!-- message --}} **{{taggedAs}}** {{message}}
`
