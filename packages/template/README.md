# @conventional-changelog/template

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@conventional-changelog/template.svg
[npm-url]: https://npmjs.com/package/@conventional-changelog/template

[node]: https://img.shields.io/node/v/@conventional-changelog/template.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@conventional-changelog/template
[deps-url]: https://libraries.io/npm/@conventional-changelog%2Ftemplate

[size]: https://packagephobia.com/badge?p=@conventional-changelog/template
[size-url]: https://packagephobia.com/result?p=@conventional-changelog/template

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Template utilities for conventional changelog generation.

<hr />
<a href="#install">Install</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#usage">Usage</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="#api">API</a>
<br />
<hr />

## Install

```bash
# pnpm
pnpm add @conventional-changelog/template
# yarn
yarn add @conventional-changelog/template
# npm
npm i @conventional-changelog/template
```

## Usage

```js
import {
  bold,
  compareUrl,
  heading,
  link,
  list,
  repositoryUrl,
  template,
  url
} from '@conventional-changelog/template'

console.log(heading(2, 'Features')) // ## Features
console.log(link('commit', url('https://github.com/example/repo', 'commit', 'abc123')))

const context = {
  version: '1.0.0',
  commit: 'commit',
  issue: 'issues',
  host: 'https://github.com',
  owner: 'example',
  repository: 'repo',
  linkReferences: true,
  previousTag: 'v1.0.0',
  currentTag: 'v2.0.0',
  headerPartial: context => heading(1, context.version),
  commitPartial: (_context, commit) => `${bold(`${commit.scope}:`)} ${commit.subject}`,
  footerPartial: () => '',
  commitGroups: [
    {
      title: 'Features',
      commits: [
        {
          scope: 'api',
          subject: 'new options',
          references: []
        }
      ]
    }
  ]
}

console.log(repositoryUrl(context)) // https://github.com/example/repo
console.log(compareUrl(context)) // https://github.com/example/repo/compare/v1.0.0...v2.0.0
console.log(template(context))
console.log(list(['a', 'b'], item => item))
```

## API

### `each<T>(array, callback, separator): string`

Render an array into newline-separated non-empty strings.

### `list<T>(array, callback): string`

Render an array into a Markdown unordered list.

### `heading(level: number, text: string): string`

Render a Markdown heading.

### `link(text: string, url: string): string`

Render a Markdown link.

### `bold(text: string): string`

Render bold Markdown text.

### `italic(text: string): string`

Render italic Markdown text.

### `small(text: string): string`

Render text inside an HTML small element.

### `newline(times): string`

Create one or more newline characters.

### `strings(...values): string`

Render values without separators.

### `segments(...values): string`

Render values as Markdown blocks separated by blank lines.

### `words(...values): string`

Render values as space-separated words.

### `url(...parts): string`

Join URL path segments and trim extra slashes around each segment.

### `repositoryUrl(context): string`

Build a repository URL from template context fields.

### `compareUrl(context): string`

Build a release comparison URL and encode tag names as URL path segments.

### `referenceRepositoryUrl(context, reference): string`

Build a repository URL for a commit reference.

### `reference(reference): string`

Render a commit reference label.

### `headerPartial(context): string`

Render the default changelog header.

### `commitPartial(context, commit): string`

Render the default changelog commit line.

### `footerPartial(context): string`

Render the default changelog footer.

### `template(context): string`

Render the default changelog template.

## License

MIT © [Dan Onoshko](https://github.com/dangreen)
