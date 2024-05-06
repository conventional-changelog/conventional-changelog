# @conventional-changelog/git-client

[![ESM-only package][package]][package-url]
[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependencies status][deps]][deps-url]
[![Install size][size]][size-url]
[![Build status][build]][build-url]
[![Coverage status][coverage]][coverage-url]

[package]: https://img.shields.io/badge/package-ESM--only-ffe536.svg
[package-url]: https://nodejs.org/api/esm.html

[npm]: https://img.shields.io/npm/v/@conventional-changelog/git-client.svg
[npm-url]: https://npmjs.com/package/@conventional-changelog/git-client

[node]: https://img.shields.io/node/v/@conventional-changelog/git-client.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/librariesio/release/npm/@conventional-changelog/git-client
[deps-url]: https://libraries.io/npm/@conventional-changelog%2Fgit-client/tree

[size]: https://packagephobia.com/badge?p=@conventional-changelog/git-client
[size-url]: https://packagephobia.com/result?p=@conventional-changelog/git-client

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Simple git client for conventional changelog packages.

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
pnpm add @conventional-changelog/git-client conventional-commits-filter conventional-commits-parser
# yarn
yarn add @conventional-changelog/git-client conventional-commits-filter conventional-commits-parser
# npm
npm i @conventional-changelog/git-client conventional-commits-filter conventional-commits-parser
```

Note: `conventional-commits-filter` and `conventional-commits-parser` are required only if you need `ConventionalGitClient#getCommits` method.

## Usage

```js
import {
  GitClient,
  ConventionalGitClient
} from '@conventional-changelog/git-client'

// Basic git client
const client = new GitClient(process.cwd())

await client.add('package.json')
await client.commit({ message: 'chore: release v1.0.0' })
await client.tag({ name: 'v1.0.0' })
await client.push('master')

// Conventional git client, which extends basic git client
const conventionalClient = new ConventionalGitClient(process.cwd())

console.log(await conventionalClient.getVersionFromTags()) // v1.0.0
```

## API

### `new GitClient(cwd: string)`

Create a wrapper around `git` CLI instance.

#### `getRawCommits(params?: GitLogParams, restRawArgs?: string[]): AsyncIterable<string>`

Get raw commits stream.

#### `getTags(restRawArgs?: string[]): AsyncIterable<string>`

Get tags stream.

#### `checkIgnore(file: string, restRawArgs?: string[]): Promise<boolean>`

Check file is ignored via .gitignore.

#### `add(files: string | string[], restRawArgs?: string[]): Promise<void>`

Add files to git index.

#### `commit(params: GitCommitParams, restRawArgs?: string[]): Promise<void>`

Commit changes.

#### `tag(params: GitTagParams, restRawArgs?: string[]): Promise<void>`

Create a tag for the current commit.

#### `getCurrentBranch(restRawArgs?: string[]): Promise<string>`

Get current branch name.

#### `push(branch: string, restRawArgs?: string[]): Promise<void>`

Push changes to remote.

### `new ConventionalGitClient(cwd: string)`

Wrapper around Git CLI with conventional commits support.

#### `getCommits(params?: ConventionalGitLogParams, parserOptions?: ParserStreamOptions, restRawArgs?: string[]): AsyncIterable<Commit>`

Get parsed commits stream.

#### `getSemverTags(params?: GitTagsLogParams, restRawArgs?: string[]): AsyncIterable<string>`

Get semver tags stream.

#### `getVersionFromTags(prefix?: string, restRawArgs?: string[]): Promise<string | null>`

Get current sematic version from git tags.

## License

MIT © [Dan Onoshko](https://github.com/dangreen)
