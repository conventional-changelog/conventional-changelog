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
[deps-url]: https://libraries.io/npm/@conventional-changelog%2Fgit-client

[size]: https://packagephobia.com/badge?p=@conventional-changelog/git-client
[size-url]: https://packagephobia.com/result?p=@conventional-changelog/git-client

[build]: https://img.shields.io/github/actions/workflow/status/conventional-changelog/conventional-changelog/tests.yaml?branch=master
[build-url]: https://github.com/conventional-changelog/conventional-changelog/actions

[coverage]: https://coveralls.io/repos/github/conventional-changelog/conventional-changelog/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/conventional-changelog/conventional-changelog?branch=master

Simple git client for conventional changelog packages.

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

## Documentation

For the API reference, visit the [documentation website](https://conventional-changelog.js.org/git-client/).

## License

MIT © [Dan Onoshko](https://github.com/dangreen)
